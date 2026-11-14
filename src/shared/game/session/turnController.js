// 回合动作控制器：只负责收分和交接回合。
import { bankPoints, finishFarkle, startNextTurn } from "../engine.js";

export function createTurnController({ game, selected, aiChoice, rolling, isAi, play, notify }) {
    function doBank(ids = selected.value, automated = false) {
        if (rolling.value || (isAi.value && !automated)) return;
        try {
            game.value = bankPoints(game.value, ids);
            selected.value = [];
            aiChoice.value = "";
            play("bank");
        } catch (error) {
            notify(error.message, "error");
        }
    }

    function nextTurn() {
        if (game.value.phase === "farkle") game.value = finishFarkle(game.value);
        if (game.value.phase === "handoff") game.value = startNextTurn(game.value);
        selected.value = [];
        aiChoice.value = "";
    }

    return { doBank, nextTurn };
}
