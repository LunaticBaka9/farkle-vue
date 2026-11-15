import { KINGDOM_SHOP_ITEM_COUNT } from "../domain/shopRotation.js";

export const KINGDOM_SHOP_STORAGE_KEY = "farkle.kingdom.shop.v1";

// 天国商店 store 初始化时读取；存档仅包含本轮展示的商品 ID。
export function restoreKingdomShopIds(storage = null) {
    try {
        const ids = JSON.parse((storage ?? globalThis.localStorage).getItem(KINGDOM_SHOP_STORAGE_KEY) ?? "null");
        if (
            !Array.isArray(ids) ||
            ids.length !== KINGDOM_SHOP_ITEM_COUNT ||
            !ids.every((id) => typeof id === "string") ||
            new Set(ids).size !== ids.length
        ) {
            return null;
        }
        return ids;
    } catch {
        return null;
    }
}

// 商店随机刷新后调用；写入失败时页面仍使用当前内存列表。
export function saveKingdomShopIds(ids, storage = null) {
    try {
        (storage ?? globalThis.localStorage).setItem(KINGDOM_SHOP_STORAGE_KEY, JSON.stringify(ids));
        return true;
    } catch {
        return false;
    }
}
