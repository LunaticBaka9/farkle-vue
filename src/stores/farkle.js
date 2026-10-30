// 对局组合式函数模块：集中管理页面响应式状态、持久化、动画、音效和 AI 自动流程。
// 规则计算委托给 game/engine.js 和 game/scoring.js，不在此模块重复实现计分规则。
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { defineStore } from "pinia";
import {
    bankPoints,
    canBank,
    chooseAiMove,
    createGame,
    finishFarkle,
    isValidTargetScore,
    rollDice,
    selectionScore,
    startNextTurn,
    isValidEntryScore,
} from "../game/engine.js";
import { ENTRY_SCORE, TARGET_SCORE, farkleProbability, scoringOptions } from "../game/scoring.js";
import diceFallSound from "@/assets/sounds/the-dice-fell.mp3";

// localStorage 使用固定版本键；恢复时会对关键字段执行结构校验。
export const STORAGE_KEY = "farkle.table.v1";
export const format = (value) => value.toLocaleString("en-US");

/**
 * 从浏览器存储恢复旧对局。
 * 旧格式、损坏数据或不合法分数字段会被忽略并创建新对局。
 */
function restore() {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (value?.version !== 1 || !["ai", "local"].includes(value.mode) || ![0, 1].includes(value.active))
            return null;
        const targetScore = value.targetScore ?? TARGET_SCORE;
        const entryScore = value.entryScore ?? ENTRY_SCORE;
        if (!isValidTargetScore(targetScore) || !isValidEntryScore(entryScore)) return null;
        if (
            !Array.isArray(value.players) ||
            value.players.length !== 2 ||
            !value.players.every(
                (p) => typeof p.name === "string" && p.name.length <= 24 && Number.isInteger(p.score) && p.score >= 0,
            )
        )
            return null;
        if (
            !["ready", "selecting", "farkle", "handoff", "finished"].includes(value.phase) ||
            !Number.isInteger(value.turnScore) ||
            value.turnScore < 0
        )
            return null;
        if (
            !Array.isArray(value.dice) ||
            value.dice.length > 6 ||
            !value.dice.every(
                (d) => typeof d.id === "string" && Number.isInteger(d.value) && d.value >= 1 && d.value <= 6,
            )
        )
            return null;
        if (
            !Array.isArray(value.history) ||
            !Array.isArray(value.kept) ||
            !Number.isInteger(value.turn) ||
            value.turn < 1 ||
            !Number.isInteger(value.rollNumber) ||
            value.rollNumber < 0
        )
            return null;
        if (!["cautious", "balanced", "bold"].includes(value.difficulty)) return null;
        if (
            !value.history.every(
                (e) =>
                    e &&
                    ["bank", "farkle"].includes(e.type) &&
                    typeof e.name === "string" &&
                    Number.isInteger(e.points) &&
                    e.points >= 0 &&
                    Number.isInteger(e.turn),
            )
        )
            return null;
        if (![null, 0, 1].includes(value.finalStarter) || ![null, 0, 1, "tie"].includes(value.winner)) return null;
        if (value.phase === "finished" && value.winner === null) return null;
        return { ...value, targetScore, entryScore };
    } catch {
        return null;
    }
}

/**
 * 创建并导出 App 使用的完整对局状态与动作。
 * 返回值中的 computed/ref 可直接绑定到页面组件。
 */
export const useFarkleStore = defineStore("farkle", () => {
    // restored 保存 localStorage 中校验通过的旧对局；恢复失败时使用 createGame() 创建全新对局。
    const restored = restore();
    // game 是对局唯一状态源，shallowRef 只在整个对象替换时触发响应式更新。
    const game = shallowRef(restored || createGame());
    // selected 保存当前玩家选中的骰子 ID；rollingFaces 只用于掷骰动画期间循环展示随机点数。
    const selected = ref([]);
    const rolling = ref(false);
    const rollingFaces = ref([]);
    // sound 控制页面反馈音效和投掷音效的总开关；默认开启，用户切换后仅影响当前运行时状态。
    const sound = ref(true);
    // modal 保存当前弹窗类型；null 表示关闭弹窗。
    const modal = ref(null);
    // toast 保存短时提示文案，空字符串表示不显示提示。
    const toast = ref("");
    // setup* 保存新对局表单的草稿值，提交前不会直接写入当前 game。
    const setupMode = ref(game.value.mode);
    const setupDifficulty = ref(game.value.difficulty);
    const setupTargetScore = ref(game.value.targetScore);
    const setupEntryScore = ref(game.value.entryScore ?? ENTRY_SCORE);
    const setupNames = ref(["", ""]);
    // aiChoice 保存 AI 当前决策的界面提示文案。
    const aiChoice = ref("");
    // 各类定时器负责 AI 流程、掷骰动画和 Toast；音频变量缓存 Web Audio 或 MP3 播放实例。
    let aiTimer, rollTimer, rollInterval, toastTimer, audioContext, diceFallAudio;

    // 以下 computed 都是由当前 game 状态派生，不保存可互相漂移的 UI 副本。
    const isAi = computed(() => game.value.mode === "ai" && game.value.active === 1);
    const player = computed(() => game.value.players[game.value.active]);
    const round = computed(() => Math.ceil(game.value.turn / 2));
    const targetScore = computed(() => game.value.targetScore);
    const targetInputValid = computed(() => isValidTargetScore(Number(setupTargetScore.value)));
    const entryInputValid = computed(() => isValidEntryScore(Number(setupEntryScore.value)));
    const chosenScore = computed(() => selectionScore(game.value, selected.value));
    const pendingScore = computed(() => game.value.turnScore + chosenScore.value);
    const validSelection = computed(() => chosenScore.value > 0);
    const canRollNow = computed(
        () =>
            !rolling.value &&
            !isAi.value &&
            (game.value.phase === "ready" || (game.value.phase === "selecting" && validSelection.value)),
    );
    const canBankNow = computed(() => !rolling.value && !isAi.value && canBank(game.value, selected.value));
    const nextDiceCount = computed(() =>
        game.value.phase === "ready" ? 6 : game.value.dice.length - selected.value.length || 6,
    );
    const nextRisk = computed(() => Math.round(farkleProbability(nextDiceCount.value) * 100));
    const entryMissing = computed(() => {
        const entryScore = game.value.entryScore ?? ENTRY_SCORE;
        return game.value.players[game.value.active].score === 0 && entryScore > 0 && pendingScore.value < entryScore;
    });
    const showHandoff = computed(() => ["farkle", "handoff"].includes(game.value.phase));
    const progress = (score) => `${Math.min((score / targetScore.value) * 100, 100)}%`;
    const difficultyLabels = { cautious: "稳健型", balanced: "均衡型", bold: "冒险型" };
    const headline = computed(() => {
        if (rolling.value) return "骰子落定之前，一切皆有可能。";
        if (game.value.phase === "finished")
            return game.value.winner === "tie"
                ? "势均力敌，平分秋色。"
                : `${game.value.players[game.value.winner].name}赢得了这场冒险！`;
        if (game.value.phase === "farkle") return "这一掷没有得分组合，本回合得分归零。";
        if (game.value.phase === "handoff")
            return `漂亮！${player.value.name}已收下 ${format(game.value.lastEvent?.points || 0)} 分。`;
        if (isAi.value) return aiChoice.value || "NOVA 正在权衡，下一掷值得冒险吗？";
        if (game.value.lastEvent?.type === "hot") return "HOT DICE！六骰全中，带着得分再来一轮。";
        if (game.value.phase === "ready") return `${player.value.name}的回合，掷出骰子，开启你的冒险。`;
        return "选出可计分的骰子，继续冒险，或见好就收。";
    });
    const selectionText = computed(() => {
        if (rolling.value) return "好运，正在路上…";
        if (game.value.phase !== "selecting") return "每一颗骰子，都藏着新的可能。";
        if (selected.value.length && !chosenScore.value) return "所选骰子中含有不能计分的骰子，请重新选择。";
        if (chosenScore.value) return `已选择 ${selected.value.length} 颗骰子`;
        return isAi.value ? "NOVA 正在寻找得分组合…" : "点击骰子，选择你的得分组合";
    });
    const winnerLabel = computed(() =>
        game.value.winner === "tie" ? "这次，平分秋色。" : `${game.value.players[game.value.winner ?? 0].name}获胜！`,
    );

    // 通知只用于短时 UI Toast；每次调用都会清除并重置原定时器。
    function notify(message) {
        clearTimeout(toastTimer);
        toast.value = message;
        toastTimer = setTimeout(() => {
            toast.value = "";
        }, 3200);
    }

    // 通过 Web Audio API 播放可选音效，浏览器不支持或用户关闭时静默失败。
    function play(type) {
        if (!sound.value) return;
        if (type === "roll") {
            try {
                diceFallAudio ||= new Audio(diceFallSound);
                diceFallAudio.pause();
                diceFallAudio.currentTime = 0;
                diceFallAudio.volume = 0.75;
                void diceFallAudio.play().catch(() => {});
            } catch {
                /* Audio is optional. */
            }
            return;
        }
        try {
            audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
            audioContext.resume().catch(() => {});
            const oscillator = audioContext.createOscillator(),
                gain = audioContext.createGain();
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            const now = audioContext.currentTime;
            oscillator.type = type === "farkle" ? "triangle" : "sine";
            oscillator.frequency.setValueAtTime(type === "bank" ? 660 : type === "farkle" ? 180 : 350, now);
            oscillator.frequency.exponentialRampToValueAtTime(type === "bank" ? 990 : 130, now + 0.15);
            gain.gain.setValueAtTime(0.045, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            oscillator.start();
            oscillator.stop(now + 0.22);
        } catch {
            /* Audio is optional. */
        }
    }
    function toggleSound() {
        sound.value = !sound.value;
        if (sound.value) play("bank");
    }
    // 玩家只能在 selecting 阶段选择当前骰子，重复点击会取消选择。
    function toggleDie(id) {
        if (rolling.value || isAi.value || game.value.phase !== "selecting") return;
        selected.value = selected.value.includes(id) ? selected.value.filter((x) => x !== id) : [...selected.value, id];
        play("select");
    }
    function suggest() {
        if (rolling.value || isAi.value || game.value.phase !== "selecting") return;
        selected.value = scoringOptions(game.value.dice)[0]?.ids || [];
    }
    // 掷骰先生成确定结果，再以定时动画展示随机点数，动画结束后提交 game 状态。
    function doRoll(ids = selected.value, automated = false) {
        if (rolling.value || (isAi.value && !automated)) return;
        try {
            const result = rollDice(game.value, ids);
            const count = result.dice.length;
            rolling.value = true;
            aiChoice.value = "";
            selected.value = [];
            rollingFaces.value = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
            play("roll");
            rollInterval = setInterval(() => {
                rollingFaces.value = rollingFaces.value.map(() => Math.floor(Math.random() * 6) + 1);
            }, 85);
            const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 650;
            rollTimer = setTimeout(() => {
                clearInterval(rollInterval);
                game.value = result;
                rolling.value = false;
                if (result.phase === "farkle") play("farkle");
                else if (result.lastEvent?.type === "hot") {
                    play("bank");
                    notify("HOT DICE · 六颗骰子全部计分，火热再掷！");
                }
            }, duration);
        } catch (error) {
            notify(error.message);
        }
    }
    // 收分动作调用纯规则引擎；成功后清空选择并播放反馈音效。
    function doBank(ids = selected.value, automated = false) {
        if (rolling.value || (isAi.value && !automated)) return;
        try {
            game.value = bankPoints(game.value, ids);
            selected.value = [];
            aiChoice.value = "";
            play("bank");
        } catch (error) {
            notify(error.message);
        }
    }
    function nextTurn() {
        if (game.value.phase === "farkle") game.value = finishFarkle(game.value);
        if (game.value.phase === "handoff") game.value = startNextTurn(game.value);
        selected.value = [];
        aiChoice.value = "";
    }
    // AI 自动机根据当前阶段安排掷骰、选择、收分或回合交接定时任务。
    function automate() {
        clearTimeout(aiTimer);
        if (rolling.value || modal.value || game.value.phase === "finished" || game.value.mode !== "ai") return;
        if (showHandoff.value) {
            aiTimer = setTimeout(nextTurn, game.value.phase === "farkle" ? 1800 : 1400);
            return;
        }
        if (!isAi.value) return;
        if (game.value.phase === "ready") {
            aiTimer = setTimeout(() => doRoll([], true), 850);
            return;
        }
        aiTimer = setTimeout(() => {
            const action = chooseAiMove(game.value);
            if (!action) return;
            selected.value = action.ids;
            aiChoice.value = `NOVA 选择了 ${action.ids.length} 颗骰子，准备${action.type === "bank" ? "收分" : "继续掷骰"}。`;
            aiTimer = setTimeout(() => {
                action.type === "bank" ? doBank(action.ids, true) : doRoll(action.ids, true);
            }, 1000);
        }, 1000);
    }
    // 打开新对局表单时，根据当前对局初始化默认模式、难度和目标分数。
    function openSetup(mode = game.value.mode) {
        setupMode.value = mode;
        setupDifficulty.value = game.value.difficulty;
        setupTargetScore.value = game.value.targetScore;
        setupEntryScore.value = game.value.entryScore ?? ENTRY_SCORE;
        setupNames.value = game.value.mode === "local" ? game.value.players.map((p) => p.name) : ["", ""];
        modal.value = "setup";
    }
    function selectMode(mode) {
        if (game.value.mode !== mode) openSetup(mode);
    }
    // 校验表单后创建新 game；本地模式还会使用用户填写的玩家名称。
    function newGame() {
        clearTimeout(aiTimer);
        clearTimeout(rollTimer);
        clearInterval(rollInterval);
        if (!targetInputValid.value) {
            notify("获胜分数须为 1,000–100,000 之间的 500 倍数。");
            return;
        }
        if (!entryInputValid.value) {
            notify("首次收分门槛须为 0–10,000 之间的 50 倍数。");
            return;
        }
        const fresh = createGame(
            setupMode.value,
            setupDifficulty.value,
            Number(setupTargetScore.value),
            Number(setupEntryScore.value),
        );
        if (setupMode.value === "local")
            fresh.players.forEach((p, i) => {
                p.name = setupNames.value[i].trim().slice(0, 24) || `玩家${i === 0 ? "一" : "二"}`;
            });
        rolling.value = false;
        selected.value = [];
        aiChoice.value = "";
        game.value = fresh;
        modal.value = null;
        notify("新对局已开始，祝你好运！");
    }
    function closeDialog() {
        modal.value = null;
    }

    // 监听对局、动画和弹窗状态，以便 AI 能够继续执行下一步动作。
    watch([game, rolling, modal], automate);
    // 持久化对局；若浏览器禁止 localStorage，则对局仍可正常游玩。
    watch(game, (value) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch {
            /* playable without storage */
        }
        if (value.phase === "finished") modal.value = "winner";
    });
    // 挂载后恢复提示、自动打开已结束对局，以及启动 AI 自动机。
    onMounted(() => {
        if (restored) notify("已恢复上次的对局");
        if (game.value.phase === "finished") modal.value = "winner";
        automate();
    });
    // 卸载组件前清理定时器、动画循环、Toast 和音频上下文，防止资源泄漏。
    onBeforeUnmount(() => {
        clearTimeout(aiTimer);
        clearTimeout(rollTimer);
        clearInterval(rollInterval);
        clearTimeout(toastTimer);
        diceFallAudio?.pause();
        audioContext?.close();
    });

    return {
        ENTRY_SCORE,
        format,
        game,
        selected,
        rolling,
        rollingFaces,
        sound,
        modal,
        toast,
        setupMode,
        setupDifficulty,
        setupTargetScore,
        setupEntryScore,
        setupNames,
        aiChoice,
        isAi,
        player,
        round,
        targetScore,
        targetInputValid,
        entryInputValid,
        chosenScore,
        pendingScore,
        validSelection,
        canRollNow,
        canBankNow,
        nextDiceCount,
        nextRisk,
        entryMissing,
        showHandoff,
        progress,
        difficultyLabels,
        headline,
        selectionText,
        winnerLabel,
        notify,
        toggleSound,
        toggleDie,
        suggest,
        doRoll,
        doBank,
        nextTurn,
        openSetup,
        selectMode,
        newGame,
        closeDialog,
    };
});
