// 天国玩家存档适配层：由 KingdomMode 的初始化、购买、挑战和重置流程调用。
import { DEFAULT_KINGDOM_STATE, KINGDOM_DICE_MAX_COPIES, KINGDOM_SHOP_ITEMS } from "../data/items.js";

export const KINGDOM_STORAGE_KEY = "farkle.kingdom.v1";

// 单颗骰子可以重复购买；普通道具仍最多持有 1 件。
function normalizeOwnedIds(ownedIds) {
    if (!Array.isArray(ownedIds)) return [...DEFAULT_KINGDOM_STATE.ownedIds];
    const counts = {};
    const result = [];
    for (const id of ownedIds) {
        const item = KINGDOM_SHOP_ITEMS.find((entry) => entry.id === id);
        if (!item) continue;
        const max = item.category === "dice" ? KINGDOM_DICE_MAX_COPIES : 1;
        if ((counts[id] ?? 0) >= max) continue;
        counts[id] = (counts[id] ?? 0) + 1;
        result.push(id);
    }
    // 空集合只可能来自损坏/旧结构存档，直接用默认收藏重建。
    return result.length ? result : [...DEFAULT_KINGDOM_STATE.ownedIds];
}

// 恢复并校验本地玩家进度；旧结构不兼容时由默认存档重建。
export function restoreKingdomState(storage = null) {
    try {
        const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(KINGDOM_STORAGE_KEY));
        return {
            coins: Number.isInteger(saved?.coins) && saved.coins >= 0 ? saved.coins : DEFAULT_KINGDOM_STATE.coins,
            ownedIds: normalizeOwnedIds(saved?.ownedIds),
        };
    } catch {
        return { coins: DEFAULT_KINGDOM_STATE.coins, ownedIds: [...DEFAULT_KINGDOM_STATE.ownedIds] };
    }
}

// KingdomMode 的金币或收藏更新后调用；失败时页面内状态仍可继续使用。
export function saveKingdomState(state, storage = null) {
    try {
        (storage ?? globalThis.localStorage).setItem(KINGDOM_STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch {
        return false;
    }
}
