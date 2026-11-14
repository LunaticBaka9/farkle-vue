// 掷骰动画控制器：只负责掷骰结果、滚动点位和计时器清理。
import { rollDice } from "../engine.js";

export function createRollController({
    game,
    selected,
    rolling,
    rollingFaces,
    aiChoice,
    isAi,
    play,
    notify,
    random = Math.random,
    isReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
}) {
    let rollTimer;
    let rollInterval;

    function clearTimers() {
        clearTimeout(rollTimer);
        clearInterval(rollInterval);
    }

    function resetAnimation() {
        clearTimers();
        rolling.value = false;
        rollingFaces.value = [];
    }

    function doRoll(ids = selected.value, automated = false) {
        if (rolling.value || (isAi.value && !automated)) return;
        try {
            const result = rollDice(game.value, ids);
            const count = result.dice.length;
            rolling.value = true;
            aiChoice.value = "";
            selected.value = [];
            rollingFaces.value = Array.from({ length: count }, () => Math.floor(random() * 6) + 1);
            play("roll");
            rollInterval = setInterval(() => {
                rollingFaces.value = rollingFaces.value.map(() => Math.floor(random() * 6) + 1);
            }, 85);
            const duration = isReducedMotion() ? 120 : 650;
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
            notify(error.message, "error");
        }
    }

    return { doRoll, clearTimers, resetAnimation };
}
