// 选骰控制器：只负责骰子选中和帮我选。
import { scoringOptions } from "../scoring.js";

export function createSelectionController({ game, selected, rolling, isAi, play, getScoreModifiers = () => [] }) {
    function toggleDie(dieId) {
        if (rolling.value || isAi.value || game.value.phase !== "selecting") return;
        selected.value = selected.value.includes(dieId)
            ? selected.value.filter((id) => id !== dieId)
            : [...selected.value, dieId];
        play("select");
    }

    function suggest() {
        if (rolling.value || isAi.value || game.value.phase !== "selecting") return;
        selected.value = scoringOptions(game.value.dice, getScoreModifiers())[0]?.ids || [];
    }

    return { toggleDie, suggest };
}
