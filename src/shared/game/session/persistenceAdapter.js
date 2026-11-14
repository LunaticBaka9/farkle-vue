// 对局持久化适配器：只负责读取本模块存档、迁移旧存档和写回。
import { restoreGame, saveGame } from "../persistence.js";

export function loadSessionGame({ storageKey, legacyKey = null }) {
    let restored = restoreGame(storageKey);
    let migrated = false;
    if (!restored && legacyKey) {
        restored = restoreGame(legacyKey);
        if (restored) {
            saveGame(restored, storageKey);
            migrated = true;
        }
    }
    return { restored, restoredNotice: Boolean(restored) || migrated };
}

export function persistSessionGame(game, storageKey) {
    saveGame(game, storageKey);
}
