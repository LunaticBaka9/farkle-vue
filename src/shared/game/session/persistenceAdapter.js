// 对局持久化适配器：只读取当前模块存档和写回；旧结构由校验器判定后直接重建。
import { restoreGame, saveGame } from "../persistence.js";

export function loadSessionGame({ storageKey }) {
    const restored = restoreGame(storageKey);
    return { restored, restoredNotice: Boolean(restored) };
}

export function persistSessionGame(game, storageKey) {
    saveGame(game, storageKey);
}
