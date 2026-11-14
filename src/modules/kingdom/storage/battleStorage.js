// 天国挑战会话元数据：记录当前挑战的对手，与对局快照分开保存。
export const KINGDOM_ACTIVE_BATTLE_KEY = "farkle.kingdom.activeBattle.v1";
export const KINGDOM_BATTLE_STORAGE_KEY = "farkle.kingdom.battle.v1";

export function restoreActiveBattle(storage = null) {
    try {
        const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(KINGDOM_ACTIVE_BATTLE_KEY));
        if (!saved || typeof saved.opponentId !== "string" || !saved.opponentId) return null;
        return { opponentId: saved.opponentId };
    } catch {
        return null;
    }
}

export function saveActiveBattle(activeBattle, storage = null) {
    try {
        (storage ?? globalThis.localStorage).setItem(KINGDOM_ACTIVE_BATTLE_KEY, JSON.stringify(activeBattle));
        return true;
    } catch {
        return false;
    }
}

export function clearActiveBattle(storage = null) {
    try {
        (storage ?? globalThis.localStorage).removeItem(KINGDOM_ACTIVE_BATTLE_KEY);
        return true;
    } catch {
        return false;
    }
}

// 挑战结束后清除对战快照，避免下一次挑战恢复上一局分数。
export function clearKingdomBattleSnapshot(storage = null) {
    try {
        (storage ?? globalThis.localStorage).removeItem(KINGDOM_BATTLE_STORAGE_KEY);
        return true;
    } catch {
        return false;
    }
}
