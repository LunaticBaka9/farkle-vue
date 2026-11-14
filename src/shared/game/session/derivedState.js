// 对局派生状态：只根据 game/selected/rolling 计算 UI 需要的只读数据。
import { computed } from "vue";
import { canBank, selectionScore } from "../engine.js";
import { ENTRY_SCORE, farkleProbability } from "../scoring.js";
import { format } from "../../utils/format.js";

export const difficultyLabels = { cautious: "稳健型", balanced: "均衡型", bold: "冒险型" };

export function createSessionDerivedState({ game, selected, rolling, aiChoice }) {
    const isAi = computed(() => game.value.mode === "ai" && game.value.active === 1);
    const player = computed(() => game.value.players[game.value.active]);
    const round = computed(() => Math.ceil(game.value.turn / 2));
    const targetScore = computed(() => game.value.targetScore);
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

    return {
        isAi,
        player,
        round,
        targetScore,
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
    };
}
