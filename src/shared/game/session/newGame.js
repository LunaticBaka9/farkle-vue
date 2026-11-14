// 新对局控制器：只负责校验表单、创建新 game 和同步设置草稿。
import { createGame } from "../engine.js";
import { isEntryScoreInputValid, isTargetScoreInputValid } from "../setupValidation.js";

export function createNewGameAction({ game, selected, ui, resetAnimation }) {
    function newGame(overrides = {}) {
        resetAnimation();
        const mode = overrides.mode ?? ui.setupMode;
        const difficulty = overrides.difficulty ?? ui.setupDifficulty;
        const target = Number(overrides.targetScore ?? ui.setupTargetScore);
        const entry = Number(overrides.entryScore ?? ui.setupEntryScore);
        const names = overrides.names ?? ui.setupNames;

        ui.setupMode = mode;
        ui.setupDifficulty = difficulty;
        ui.setupTargetScore = target;
        ui.setupEntryScore = entry;
        ui.setupNames = [...names];

        if (!isTargetScoreInputValid(target)) {
            ui.notify("获胜分数须为 1,000–100,000 之间的 500 倍数。", "error");
            return false;
        }
        if (!isEntryScoreInputValid(entry)) {
            ui.notify("首次收分门槛须为 0–10,000 之间的 50 倍数。", "error");
            return false;
        }
        const fresh = createGame(mode, difficulty, target, entry);
        // 表单里的名称对 AI 和本地模式都有效；空值回退到该模式的默认名字。
        const fallback = mode === "ai" ? ["你", "NOVA"] : ["玩家一", "玩家二"];
        fresh.players.forEach((player, index) => {
            const name = String(names?.[index] ?? "")
                .trim()
                .slice(0, 24);
            player.name = name || fallback[index];
        });
        selected.value = [];
        game.value = fresh;
        ui.modal = null;
        ui.notify("新对局已开始，祝你好运！");
        return true;
    }

    return newGame;
}
