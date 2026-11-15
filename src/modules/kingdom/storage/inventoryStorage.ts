const INVENTORY_STORAGE_KEY = "farkle.kingdom.inventory.v1";

// 背包 store 初始化时读取；输入来自浏览器本地装备槽存档。
export function restoreInventoryLoadout(storage: Storage | null = null): (string | null)[] | null {
    try {
        const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(INVENTORY_STORAGE_KEY) ?? "null");
        if (
            !Array.isArray(saved) ||
            saved.length !== 3 ||
            !saved.every((itemId) => itemId === null || typeof itemId === "string")
        ) {
            return null;
        }
        return saved;
    } catch {
        return null;
    }
}

// 装备槽变更时写入；写入失败由调用方保留当前内存状态。
export function saveInventoryLoadout(slots: readonly (string | null)[], storage: Storage | null = null): boolean {
    try {
        (storage ?? globalThis.localStorage).setItem(INVENTORY_STORAGE_KEY, JSON.stringify(slots));
        return true;
    } catch {
        return false;
    }
}

export { INVENTORY_STORAGE_KEY };
