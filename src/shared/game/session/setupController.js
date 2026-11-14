// 设置入口控制器：只负责把当前对局参数带入设置弹窗。
import { ENTRY_SCORE } from "../scoring.js";

export function createSetupController({ game, ui }) {
    function selectMode(mode) {
        if (game.value.mode === mode) return;
        ui.openSetup({
            mode,
            difficulty: game.value.difficulty,
            targetScore: game.value.targetScore,
            entryScore: game.value.entryScore ?? ENTRY_SCORE,
            names: [game.value.players[0]?.name || "", game.value.players[1]?.name || ""],
        });
    }

    return { selectMode };
}
