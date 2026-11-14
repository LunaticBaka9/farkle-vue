// 骰子装备存档：只负责 localStorage 读写，语义校验交给 diceLoadoutRules。
const DICE_LOADOUT_STORAGE_KEY = "farkle.kingdom.diceLoadout.v1";

export function restoreDiceLoadout(storage: Storage | null = null): string[] | null {
    try {
        const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(DICE_LOADOUT_STORAGE_KEY) ?? "null");
        if (!Array.isArray(saved) || saved.length !== 6 || !saved.every((id) => typeof id === "string")) return null;
        return saved;
    } catch {
        return null;
    }
}

export function saveDiceLoadout(slots: readonly string[], storage: Storage | null = null): boolean {
    try {
        (storage ?? globalThis.localStorage).setItem(DICE_LOADOUT_STORAGE_KEY, JSON.stringify(slots));
        return true;
    } catch {
        return false;
    }
}

export { DICE_LOADOUT_STORAGE_KEY };
