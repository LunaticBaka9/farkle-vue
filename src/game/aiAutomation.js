// AI 定时流程：由 Pinia store 传入响应式状态与动作，负责安排和清理自动步骤。
import { chooseAiMove } from "./engine.js";

export function createAiAutomation({
    game,
    rolling,
    modal,
    isAi,
    showHandoff,
    selected,
    aiChoice,
    doRoll,
    doBank,
    nextTurn,
}) {
    let timer;

    // store 的 game/rolling/modal 变化时调用；新状态会先取消旧任务，避免过期动作执行。
    function run() {
        clearTimeout(timer);
        if (rolling.value || modal.value || game.value.phase === "finished" || game.value.mode !== "ai") return;
        if (showHandoff.value) {
            timer = setTimeout(nextTurn, game.value.phase === "farkle" ? 1800 : 1400);
            return;
        }
        if (!isAi.value) return;
        if (game.value.phase === "ready") {
            timer = setTimeout(() => doRoll([], true), 850);
            return;
        }
        timer = setTimeout(() => {
            const action = chooseAiMove(game.value);
            if (!action) return;
            selected.value = action.ids;
            aiChoice.value =
                "NOVA 选择了 " +
                action.ids.length +
                " 颗骰子，准备" +
                (action.type === "bank" ? "收分" : "继续掷骰") +
                "。";
            timer = setTimeout(() => {
                action.type === "bank" ? doBank(action.ids, true) : doRoll(action.ids, true);
            }, 1000);
        }, 1000);
    }

    // 新对局提交时取消进行中的 AI 延时任务；store 卸载也调用同一个清理入口。
    function cancel() {
        clearTimeout(timer);
    }

    return { run, cancel, dispose: cancel };
}
