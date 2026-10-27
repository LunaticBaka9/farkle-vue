<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import AppIcon from "./components/AppIcon.vue";
import Die from "./components/Die.vue";
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
} from "./game/engine.js";
import { ENTRY_SCORE, RULES_SOURCE, TARGET_SCORE, farkleProbability, scoringOptions } from "./game/scoring.js";

const STORAGE_KEY = "farkle.table.v1";
const format = (value) => value.toLocaleString("en-US");
function restore() {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (value?.version !== 1 || !["ai", "local"].includes(value.mode) || ![0, 1].includes(value.active))
            return null;
        const targetScore = value.targetScore ?? TARGET_SCORE;
        if (!isValidTargetScore(targetScore)) return null;
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
        if (
            !value.kept.every(
                (group) =>
                    group &&
                    Array.isArray(group.values) &&
                    group.values.length <= 6 &&
                    group.values.every((v) => Number.isInteger(v) && v >= 1 && v <= 6) &&
                    Number.isInteger(group.score),
            )
        )
            return null;
        if (["selecting", "farkle"].includes(value.phase) && !value.dice.length) return null;
        if (![null, 0, 1].includes(value.finalStarter) || ![null, 0, 1, "tie"].includes(value.winner)) return null;
        if (value.phase === "finished" && value.winner === null) return null;
        return { ...value, targetScore };
    } catch {
        return null;
    }
}
const restored = restore();
const game = shallowRef(restored || createGame());
const selected = ref([]);
const rolling = ref(false);
const rollingFaces = ref([]);
const sound = ref(false);
const modal = ref(null);
const dialog = ref(null);
const toast = ref("");
const setupMode = ref(game.value.mode);
const setupDifficulty = ref(game.value.difficulty);
const setupTargetScore = ref(game.value.targetScore);
const setupNames = ref(["", ""]);
const aiChoice = ref("");
let aiTimer, rollTimer, rollInterval, toastTimer, audioContext;

const isAi = computed(() => game.value.mode === "ai" && game.value.active === 1);
const player = computed(() => game.value.players[game.value.active]);
const round = computed(() => Math.ceil(game.value.turn / 2));
const targetScore = computed(() => game.value.targetScore);
const targetInputValid = computed(() => isValidTargetScore(Number(setupTargetScore.value)));
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
const entryMissing = computed(
    () => game.value.players[game.value.active].score === 0 && pendingScore.value < ENTRY_SCORE,
);
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

function notify(message) {
    clearTimeout(toastTimer);
    toast.value = message;
    toastTimer = setTimeout(() => {
        toast.value = "";
    }, 3200);
}
function play(type) {
    if (!sound.value) return;
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
function toggleDie(id) {
    if (rolling.value || isAi.value || game.value.phase !== "selecting") return;
    selected.value = selected.value.includes(id) ? selected.value.filter((x) => x !== id) : [...selected.value, id];
    play("select");
}
function suggest() {
    if (rolling.value || isAi.value || game.value.phase !== "selecting") return;
    selected.value = scoringOptions(game.value.dice)[0]?.ids || [];
}
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
function openSetup(mode = game.value.mode) {
    setupMode.value = mode;
    setupDifficulty.value = game.value.difficulty;
    setupTargetScore.value = game.value.targetScore;
    setupNames.value = game.value.mode === "local" ? game.value.players.map((p) => p.name) : ["", ""];
    modal.value = "setup";
}
function selectMode(mode) {
    if (game.value.mode !== mode) openSetup(mode);
}
function newGame() {
    clearTimeout(aiTimer);
    clearTimeout(rollTimer);
    clearInterval(rollInterval);
    if (!targetInputValid.value) {
        notify("获胜分数须为 1,000–100,000 之间的 500 倍数。");
        return;
    }
    const fresh = createGame(setupMode.value, setupDifficulty.value, Number(setupTargetScore.value));
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
watch([game, rolling, modal], automate);
watch(game, (value) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
        /* The game remains playable when storage is unavailable. */
    }
    if (value.phase === "finished") modal.value = "winner";
});
watch(modal, async (value) => {
    await nextTick();
    if (value && !dialog.value.open) dialog.value.showModal();
    else if (!value && dialog.value.open) dialog.value.close();
});
onMounted(() => {
    if (restored) notify("已恢复上次的对局");
    if (game.value.phase === "finished") modal.value = "winner";
    automate();
});
onBeforeUnmount(() => {
    clearTimeout(aiTimer);
    clearTimeout(rollTimer);
    clearInterval(rollInterval);
    clearTimeout(toastTimer);
    audioContext?.close();
});
</script>

<template>
    <div class="site-shell">
        <header class="site-header">
            <a class="brand" href="./" aria-label="Farkle 首页"
                ><span class="brand-mark"><AppIcon name="dice" :size="27" /></span>farkle<span class="brand-period"
                    >.</span
                ></a
            >
            <span class="header-motto">A LITTLE LUCK. A LOT OF NERVE.</span>
            <nav aria-label="游戏工具">
                <button
                    class="sound-toggle"
                    :aria-label="sound ? '关闭音效' : '开启音效'"
                    :aria-pressed="sound"
                    @click="toggleSound"
                >
                    <AppIcon :name="sound ? 'sound' : 'mute'" :size="18" /><span>{{
                        sound ? "音效开启" : "音效关闭"
                    }}</span></button
                ><span class="nav-divider"></span
                ><button class="rules-button" @click="modal = 'rules'">
                    <AppIcon name="book" :size="17" />玩法规则
                </button>
            </nav>
        </header>

        <main class="main-content">
            <section class="page-heading">
                <div>
                    <div class="eyebrow"><span class="green-dot"></span> ROLL THE DICE. OWN THE MOMENT.</div>
                    <h1>再掷一次，<span>好运在手。</span></h1>
                    <p>是落袋为安，还是放手一搏？让每一次选择，都值得心跳。</p>
                </div>
                <div class="target-badge">
                    <span class="target-icon"><AppIcon name="trophy" :size="24" /></span>
                    <div>
                        <small>本局目标</small><strong>{{ format(targetScore) }}<span>分</span></strong>
                    </div>
                </div>
            </section>

            <div class="game-layout">
                <section class="main-column" aria-label="Farkle 对局">
                    <div class="game-toolbar">
                        <div class="mode-tabs" role="group" aria-label="游戏模式">
                            <button
                                :class="{ active: game.mode === 'ai' }"
                                :aria-pressed="game.mode === 'ai'"
                                @click="selectMode('ai')"
                            >
                                <AppIcon name="bot" :size="16" />单人对战 <span class="mode-tag">AI</span></button
                            ><button
                                :class="{ active: game.mode === 'local' }"
                                :aria-pressed="game.mode === 'local'"
                                @click="selectMode('local')"
                            >
                                <AppIcon name="users" :size="16" />本地双人
                            </button>
                        </div>
                        <button class="text-button new-game-button" @click="openSetup()">
                            <AppIcon name="restart" :size="16" /><span>新对局</span>
                        </button>
                    </div>

                    <div class="scoreboard">
                        <article
                            v-for="(p, index) in game.players"
                            :key="index"
                            class="player-card"
                            :class="{
                                'is-active': game.active === index && game.phase !== 'finished',
                                'player-two': index === 1,
                            }"
                            :aria-label="`${p.name}，总分 ${p.score}`"
                        >
                            <div class="player-card-top">
                                <div class="player-avatar">
                                    <AppIcon :name="index === 1 && game.mode === 'ai' ? 'bot' : 'user'" :size="21" />
                                </div>
                                <div class="player-identity">
                                    <h2>
                                        {{ p.name
                                        }}<span v-if="index === 1 && game.mode === 'ai'" class="ai-label">AI</span>
                                    </h2>
                                    <span>{{
                                        index === 1 && game.mode === "ai"
                                            ? difficultyLabels[game.difficulty] + "对手"
                                            : "PLAYER 0" + (index + 1)
                                    }}</span>
                                </div>
                                <span v-if="game.active === index && game.phase !== 'finished'" class="current-badge"
                                    ><i></i>当前回合</span
                                ><span v-else class="waiting-label">{{
                                    game.phase === "finished" ? "对局结束" : "等待中"
                                }}</span>
                            </div>
                            <div class="score-number">
                                {{ format(p.score) }}<span>/ {{ format(targetScore) }}</span>
                            </div>
                            <div
                                class="score-progress"
                                role="progressbar"
                                :aria-label="`${p.name}的目标进度`"
                                :aria-valuenow="Math.min(p.score, targetScore)"
                                :aria-valuemin="0"
                                :aria-valuemax="targetScore"
                            >
                                <div :style="{ width: progress(p.score) }"></div>
                            </div>
                        </article>
                    </div>

                    <section
                        class="game-table"
                        :class="{ 'table-farkle': game.phase === 'farkle', 'table-final': game.finalStarter !== null }"
                        aria-label="骰子牌桌"
                    >
                        <div class="table-corner corner-tl"></div>
                        <div class="table-corner corner-tr"></div>
                        <div class="table-corner corner-bl"></div>
                        <div class="table-corner corner-br"></div>
                        <div class="table-topline">
                            <span
                                ><span class="green-dot"></span
                                >{{
                                    game.finalStarter !== null
                                        ? "最后一回合 · FINAL ROUND"
                                        : `第 ${String(round).padStart(2, "0")} 轮`
                                }}</span
                            ><span class="table-caption">SIX DICE. INFINITE POSSIBILITIES.</span>
                        </div>
                        <div v-if="game.finalStarter !== null && game.phase !== 'finished'" class="final-notice">
                            <AppIcon name="trophy" :size="13" />{{
                                game.players[game.finalStarter].name
                            }}已达目标，对手还有最后一次机会。
                        </div>
                        <div class="turn-summary">
                            <div class="table-overline">
                                {{
                                    game.phase === "farkle"
                                        ? "这一掷，运气暂时离场"
                                        : game.phase === "finished"
                                          ? "THANKS FOR PLAYING"
                                          : "本回合累计"
                                }}
                            </div>
                            <div class="turn-score" :class="{ 'farkle-title': game.phase === 'farkle' }">
                                {{ game.phase === "farkle" ? "FARKLE!" : format(game.turnScore)
                                }}<span v-if="game.phase !== 'farkle'">pts</span>
                            </div>
                            <p class="turn-description" role="status" aria-live="polite">{{ headline }}</p>
                        </div>

                        <div
                            class="dice-zone"
                            :class="{
                                'waiting-dice': game.phase === 'ready' || showHandoff,
                                'farkle-dice': game.phase === 'farkle',
                            }"
                        >
                            <template v-if="rolling"
                                ><Die
                                    v-for="(value, index) in rollingFaces"
                                    :key="index"
                                    :value="value"
                                    :index="index"
                                    rolling
                                    disabled
                            /></template>
                            <template v-else-if="game.dice.length"
                                ><Die
                                    v-for="(die, index) in game.dice"
                                    :key="die.id"
                                    :value="die.value"
                                    :index="index"
                                    :selected="selected.includes(die.id)"
                                    :disabled="isAi || game.phase !== 'selecting'"
                                    @select="toggleDie(die.id)"
                            /></template>
                            <template v-else
                                ><Die
                                    v-for="(value, index) in [1, 5, 3, 6, 2, 4]"
                                    :key="index"
                                    :value="value"
                                    :index="index"
                                    decorative
                            /></template>
                        </div>

                        <div class="selection-line" :class="{ 'invalid-selection': selected.length && !chosenScore }">
                            <span>{{ selectionText }}</span
                            ><span v-if="chosenScore" class="selection-points">+{{ format(chosenScore) }} 分</span
                            ><button
                                v-if="game.phase === 'selecting' && !isAi && !rolling"
                                class="suggest-button"
                                @click="suggest"
                            >
                                <AppIcon name="spark" :size="12" />帮我选
                            </button>
                        </div>

                        <div class="kept-tray">
                            <span class="kept-label"><AppIcon name="shield" :size="13" />已保留</span>
                            <div v-if="game.kept.length" class="kept-groups">
                                <span
                                    v-for="(group, index) in game.kept"
                                    :key="index"
                                    class="kept-group"
                                    :title="`第 ${group.roll} 次投掷，${group.score} 分`"
                                    ><Die
                                        v-for="(value, i) in group.values"
                                        :key="i"
                                        :value="value"
                                        :index="i"
                                        small
                                        decorative
                                /></span>
                            </div>
                            <span v-else class="kept-placeholder">等待你的第一个得分组合</span
                            ><span class="kept-note">组合仅限同一次投掷</span>
                        </div>

                        <div v-if="showHandoff" class="handoff-actions">
                            <div v-if="game.mode === 'ai'" class="auto-handoff">
                                <span class="thinking-dots"><i></i><i></i><i></i></span> 正在交接回合
                            </div>
                            <button v-else class="button button-primary" @click="nextTurn">
                                {{
                                    game.finalStarter !== null && game.active !== game.finalStarter
                                        ? "查看最终结果"
                                        : `交给${game.players[1 - game.active].name}`
                                }}<AppIcon name="arrow" :size="18" />
                            </button>
                        </div>
                        <div v-else-if="game.phase === 'finished'" class="finished-actions">
                            <button class="button button-primary" @click="openSetup()">
                                <AppIcon name="restart" :size="18" />再来一局</button
                            ><button class="button button-secondary" @click="modal = 'winner'">
                                查看结果<AppIcon name="trophy" :size="17" />
                            </button>
                        </div>
                        <div v-else class="table-actions">
                            <button class="button button-primary roll-button" :disabled="!canRollNow" @click="doRoll()">
                                <AppIcon name="dice" :size="21" /><span>{{
                                    rolling
                                        ? "掷骰中…"
                                        : isAi
                                          ? "NOVA 思考中…"
                                          : game.phase === "ready"
                                            ? "掷出骰子"
                                            : "继续掷骰"
                                }}</span
                                ><span v-if="game.phase === 'selecting' && !rolling && !isAi" class="button-count"
                                    >{{ nextDiceCount }} 颗</span
                                ><AppIcon name="arrow" :size="17" /></button
                            ><button
                                class="button button-secondary bank-button"
                                :disabled="!canBankNow"
                                :title="entryMissing ? '首次收分需在同一回合累计至少 500 分' : '把本回合得分加入总分'"
                                @click="doBank()"
                            >
                                <AppIcon name="bank" :size="18" /><span>收分 · 结束回合</span
                                ><strong v-if="canBankNow">+{{ format(pendingScore) }}</strong>
                            </button>
                        </div>
                        <div class="table-footnote">
                            <template v-if="validSelection && !showHandoff && !rolling"
                                ><AppIcon name="info" :size="12" /><span>{{
                                    entryMissing
                                        ? `首次收分还差 ${ENTRY_SCORE - pendingScore} 分，需继续掷骰。`
                                        : `下次掷 ${nextDiceCount} 颗，爆骰概率约 ${nextRisk}%。冒险还是收手？`
                                }}</span></template
                            ><template v-else
                                ><AppIcon name="info" :size="12" /><span
                                    >没有得分组合即爆骰，本回合未收分得分全部归零。</span
                                ></template
                            >
                        </div>
                    </section>

                    <section class="activity-section" aria-label="对局记录">
                        <div class="section-title">
                            <h2><AppIcon name="history" :size="17" />对局动态</h2>
                            <span>THE STORY SO FAR</span>
                        </div>
                        <div v-if="!game.history.length" class="activity-empty">
                            <span class="empty-spark">✦</span>
                            <p>故事还没开始。第一掷，交给你。</p>
                            <span class="empty-line"></span>
                        </div>
                        <ol v-else class="activity-list">
                            <li v-for="(event, index) in game.history.slice(0, 5)" :key="event.id">
                                <span class="event-icon" :class="event.type"
                                    ><AppIcon :name="event.type === 'bank' ? 'check' : 'close'" :size="11" /></span
                                ><span
                                    ><strong>{{ event.name }}</strong
                                    >{{ event.type === "bank" ? "落袋为安" : "遭遇 Farkle"
                                    }}<small v-if="event.final" class="final-tag">触发最终回合</small></span
                                ><b :class="event.type"
                                    >{{
                                        event.type === "bank"
                                            ? "+" + format(event.points)
                                            : event.points
                                              ? "失去 " + format(event.points)
                                              : "本回合归零"
                                    }}<small v-if="event.type === 'bank'">分</small></b
                                ><time>{{ index === 0 ? "刚刚" : `第 ${Math.ceil(event.turn / 2)} 轮` }}</time>
                            </li>
                        </ol>
                    </section>
                </section>

                <aside class="sidebar" aria-label="计分与玩法提示">
                    <section class="score-guide">
                        <div class="section-title">
                            <h2><AppIcon name="dice" :size="17" />计分速查</h2>
                            <span class="reference-badge">QUICK GUIDE</span>
                        </div>
                        <p class="guide-description">记住这些组合，让每一掷更有把握。</p>
                        <div class="single-scoring">
                            <div>
                                <Die :value="1" decorative small /><span>单个 1</span
                                ><strong>100<small>分</small></strong>
                            </div>
                            <div>
                                <Die :value="5" decorative small /><span>单个 5</span
                                ><strong>50<small>分</small></strong>
                            </div>
                        </div>
                        <div class="guide-divider"></div>
                        <div class="score-rule">
                            <span>三个 1</span><strong>300<small>分</small></strong>
                        </div>
                        <div class="score-rule"><span>三个 2 — 6</span><strong>点数 × 100</strong></div>
                        <div class="score-rule">
                            <span>四 / 五 / 六同</span><strong class="compact-score">1,000 / 2,000 / 3,000</strong>
                        </div>
                        <div class="guide-divider"></div>
                        <div class="score-rule">
                            <span>1–6 顺子</span><strong>1,500<small>分</small></strong>
                        </div>
                        <div class="score-rule">
                            <span>三对<span class="rule-hint">2 + 2 + 2</span></span
                            ><strong>1,500<small>分</small></strong>
                        </div>
                        <div class="score-rule">
                            <span>四同 + 一对</span><strong>1,500<small>分</small></strong>
                        </div>
                        <div class="score-rule">
                            <span>两组三同</span><strong>2,500<small>分</small></strong>
                        </div>
                        <button class="full-rules-link" @click="modal = 'rules'">
                            查看完整规则与示例<AppIcon name="diagonal" :size="15" />
                        </button>
                    </section>
                    <section class="hot-dice-card">
                        <div class="hot-dice-icon"><AppIcon name="flame" :size="25" /></div>
                        <div>
                            <span class="hot-eyebrow">WHEN THE DICE ARE HOT</span>
                            <h3>六骰全中，好运加码。</h3>
                            <p>六颗骰子全部计分？保留累计得分，重新掷出全部六颗骰子。冒险继续。</p>
                            <span class="hot-tag"><span class="green-dot"></span> HOT DICE · 火热再掷</span>
                        </div>
                    </section>
                    <div class="entry-note">
                        <AppIcon name="shield" :size="16" />
                        <p>首次收分，至少累计 <strong>500 分</strong>。<br />之后每回合随时可以见好就收。</p>
                    </div>
                    <div class="sidebar-quote">
                        <span>✧</span>
                        <p>运气决定点数<br /><strong>勇气决定下一掷</strong></p>
                    </div>
                </aside>
            </div>
        </main>

        <footer class="site-footer">
            <span class="footer-brand">farkle<span>.</span><small>ROLL. RISK. REPEAT.</small></span
            ><span>为每一个「再来一次」的瞬间而作。</span
            ><span class="footer-spec">6 DICE <i>/</i> 2 PLAYERS <i>/</i> {{ format(targetScore) }} POINTS</span>
        </footer>
        <Transition name="toast"
            ><div v-if="toast" class="toast-message" role="status">
                <AppIcon name="check" :size="15" />{{ toast }}
            </div></Transition
        >

        <dialog
            ref="dialog"
            class="game-dialog"
            :aria-labelledby="modal === 'rules' ? 'rules-title' : modal === 'setup' ? 'setup-title' : 'winner-title'"
            @cancel.prevent="closeDialog"
            @click="
                (event) => {
                    if (event.target === dialog) closeDialog();
                }
            "
        >
            <button class="dialog-close" aria-label="关闭弹窗" @click="closeDialog">
                <AppIcon name="close" :size="20" />
            </button>
            <section v-if="modal === 'rules'" class="rules-content">
                <div class="eyebrow">A QUICK GUIDE TO GOOD TIMES</div>
                <h2 id="rules-title">六颗骰子，一场冒险。</h2>
                <p class="dialog-intro">两位玩家轮流掷骰，争取先达到本局自定义获胜分数。</p>
                <ol class="rules-steps">
                    <li>
                        <span>01</span>
                        <div>
                            <h3>掷骰，选出得分组合</h3>
                            <p>
                                每回合从六颗骰子开始。每次投掷后，选出至少一颗可计分骰子；不计分的 2、3、4、6
                                不能单独保留。组合必须来自同一次投掷。
                            </p>
                        </div>
                    </li>
                    <li>
                        <span>02</span>
                        <div>
                            <h3>继续冒险，还是落袋为安？</h3>
                            <p>
                                继续掷剩余骰子，或点击「收分」将本回合得分加入总分。首次上分需要在同一回合累计至少 500
                                分，以后没有最低门槛。
                            </p>
                        </div>
                    </li>
                    <li>
                        <span>03</span>
                        <div>
                            <h3>小心 Farkle，也期待 Hot Dice</h3>
                            <p>
                                新掷的骰子完全没有计分组合，即爆骰：本回合未收分得分归零。若六颗骰子全部计分，则可以保留本回合得分，重新掷全部六颗。
                            </p>
                        </div>
                    </li>
                    <li>
                        <span>04</span>
                        <div>
                            <h3>最后一次机会，最后一搏</h3>
                            <p>有人达到本局目标分数后，对手还有最后一回合。最终总分较高者获胜；同分则平局。</p>
                        </div>
                    </li>
                </ol>
                <div class="example-note">
                    <AppIcon name="spark" :size="18" />
                    <p>
                        例如掷出 <strong>1、5、2、3、4、6</strong>，你可以选 1 和 5 得 150 分，或选择全部六颗以顺子获得
                        <strong>1,500 分</strong>。不同次投掷的同点数不能拼成三同。
                    </p>
                </div>
                <p class="rules-source">
                    本作采用
                    <a :href="RULES_SOURCE" target="_blank" rel="noopener noreferrer"
                        >PlayMonster Farkle 规则<AppIcon name="diagonal" :size="11" /></a
                    >。不同版本的计分可能有所差异，以本页速查表为准。
                </p>
                <button class="button button-primary dialog-main-action" @click="closeDialog">
                    明白了，骰子交给我<AppIcon name="arrow" :size="17" />
                </button>
            </section>
            <form v-else-if="modal === 'setup'" class="setup-content" @submit.prevent="newGame">
                <div class="eyebrow">A FRESH START</div>
                <h2 id="setup-title">新的对局，新的可能。</h2>
                <p class="dialog-intro">选择对手和目标分数，开始一场为你定制的对决。</p>
                <div class="setup-mode-options">
                    <button
                        type="button"
                        :class="{ chosen: setupMode === 'ai' }"
                        :aria-pressed="setupMode === 'ai'"
                        @click="setupMode = 'ai'"
                    >
                        <AppIcon name="bot" :size="26" /><strong>挑战 NOVA</strong
                        ><span>单人 · 与 AI 对战</span></button
                    ><button
                        type="button"
                        :class="{ chosen: setupMode === 'local' }"
                        :aria-pressed="setupMode === 'local'"
                        @click="setupMode = 'local'"
                    >
                        <AppIcon name="users" :size="26" /><strong>和朋友来一局</strong><span>双人 · 本地轮流游玩</span>
                    </button>
                </div>
                <div class="target-setup">
                    <label class="field-label" for="target-score">获胜分数</label>
                    <div class="target-input-wrap">
                        <input
                            id="target-score"
                            v-model.number="setupTargetScore"
                            type="number"
                            inputmode="numeric"
                            min="1000"
                            max="100000"
                            step="500"
                            required
                            :aria-invalid="!targetInputValid"
                            aria-describedby="target-score-hint"
                        /><span>分</span>
                    </div>
                    <div class="target-presets" aria-label="常用目标分数">
                        <button
                            v-for="preset in [5000, 10000, 15000]"
                            :key="preset"
                            type="button"
                            :class="{ chosen: Number(setupTargetScore) === preset }"
                            :aria-pressed="Number(setupTargetScore) === preset"
                            @click="setupTargetScore = preset"
                        >
                            {{ format(preset) }}
                        </button>
                    </div>
                    <p id="target-score-hint" class="field-hint" :class="{ 'hint-error': !targetInputValid }">
                        {{
                            targetInputValid
                                ? "可设为 1,000–100,000 分，每次递增 500 分。默认 10,000 分。"
                                : "请输入 1,000–100,000 之间的 500 倍数。"
                        }}
                    </p>
                </div>
                <template v-if="setupMode === 'ai'"
                    ><label class="field-label" for="ai-difficulty">AI 风格</label
                    ><select id="ai-difficulty" v-model="setupDifficulty">
                        <option value="cautious">稳健型 — 见好就收</option>
                        <option value="balanced">均衡型 — 权衡风险与回报</option>
                        <option value="bold">冒险型 — 让好运再飞一会</option>
                    </select></template
                >
                <div v-else class="name-fields">
                    <label class="field-label"
                        >玩家一<input
                            v-model="setupNames[0]"
                            maxlength="24"
                            placeholder="玩家一"
                            autocomplete="off" /></label
                    ><label class="field-label"
                        >玩家二<input v-model="setupNames[1]" maxlength="24" placeholder="玩家二" autocomplete="off"
                    /></label>
                </div>
                <p class="setup-notice"><AppIcon name="info" :size="14" />开始新对局将重置当前得分及对局记录。</p>
                <button type="submit" class="button button-primary dialog-main-action" :disabled="!targetInputValid">
                    开始新对局<AppIcon name="arrow" :size="18" />
                </button>
            </form>
            <section v-else-if="modal === 'winner'" class="winner-content">
                <div class="winner-emblem"><AppIcon name="trophy" :size="45" /></div>
                <div class="eyebrow">WHAT A GAME. WHAT A JOURNEY.</div>
                <h2 id="winner-title">{{ winnerLabel }}</h2>
                <p class="dialog-intro">
                    {{
                        game.winner === "tie"
                            ? "旗鼓相当的对手，值得再来一局。"
                            : "每一次果断收手，每一次勇敢再掷，都算数。"
                    }}
                </p>
                <div class="final-scores">
                    <div v-for="(p, i) in game.players" :key="i" :class="{ victorious: game.winner === i }">
                        <span>{{ p.name }}</span
                        ><strong>{{ format(p.score) }}</strong
                        ><small>{{ game.winner === i ? "WINNER" : "POINTS" }}</small>
                    </div>
                </div>
                <button class="button button-primary dialog-main-action" @click="openSetup()">
                    再来一局<AppIcon name="restart" :size="17" /></button
                ><button class="text-button return-table" @click="closeDialog">回到牌桌查看记录</button>
            </section>
        </dialog>
    </div>
</template>
