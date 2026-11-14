// 天国玩家存档适配层：由 KingdomMode 的初始化、购买、挑战和重置流程调用。
import { DEFAULT_KINGDOM_STATE, KINGDOM_SHOP_ITEMS } from "./items.js";

export const KINGDOM_STORAGE_KEY = "farkle.kingdom.v1";

// 恢复并校验本地玩家进度；商品目录是 ownedIds 的有效 ID 来源。
export function restoreKingdomState(storage = null) {
    try {
        const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(KINGDOM_STORAGE_KEY));
        return {
            coins: Number.isInteger(saved?.coins) && saved.coins >= 0 ? saved.coins : DEFAULT_KINGDOM_STATE.coins,
            ownedIds: Array.isArray(saved?.ownedIds)
                ? [...new Set(saved.ownedIds.filter((id) => KINGDOM_SHOP_ITEMS.some((item) => item.id === id)))]
                : [...DEFAULT_KINGDOM_STATE.ownedIds],
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
