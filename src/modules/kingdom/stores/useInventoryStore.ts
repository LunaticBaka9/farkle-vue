import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { InventorySlot } from "../domain/inventoryTypes.ts";
import {
    INVENTORY_ITEMS,
    INVENTORY_ITEM_BY_ID,
    INVENTORY_SLOT_COUNT,
} from "../data/inventoryItems.ts";
import { restoreInventoryLoadout, saveInventoryLoadout } from "../storage/inventoryStorage.ts";
import { useKingdomStore } from "./kingdomStore.js";

function normalizeSlots(slots: readonly (string | null)[], ownedCounts: Record<string, number>) {
    const result = Array.from({ length: INVENTORY_SLOT_COUNT }, () => null as string | null);
    const equippedCounts: Record<string, number> = {};
    for (let index = 0; index < result.length; index += 1) {
        const itemId = slots[index];
        if (!itemId || !INVENTORY_ITEM_BY_ID[itemId]) continue;
        const count = (equippedCounts[itemId] ?? 0) + 1;
        if (count > (ownedCounts[itemId] ?? 0)) continue;
        result[index] = itemId;
        equippedCounts[itemId] = count;
    }
    return result;
}

export const useInventoryStore = defineStore("kingdom-inventory", () => {
    const kingdom = useKingdomStore();
    const items = computed<Record<string, number>>(() => {
        const counts: Record<string, number> = {};
        for (const ownedId of kingdom.ownedIds) {
            if (INVENTORY_ITEM_BY_ID[ownedId]) counts[ownedId] = (counts[ownedId] ?? 0) + 1;
        }
        return counts;
    });
    const inventorySlots = computed<InventorySlot[]>(() =>
        INVENTORY_ITEMS.map((item) => ({
            itemId: item.id,
            count: items.value[item.id] ?? 0,
        })),
    );
    const savedSlots = restoreInventoryLoadout();
    const equippedSlots = ref<(string | null)[]>(normalizeSlots(savedSlots ?? [], items.value));

    // 背包弹窗调用；装备前校验玩家实际持有数量及目标槽位。
    function equipItem(slotIndex: number, itemId: string): boolean {
        if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= INVENTORY_SLOT_COUNT) return false;
        if (!INVENTORY_ITEM_BY_ID[itemId] || (items.value[itemId] ?? 0) < 1) return false;

        const next = [...equippedSlots.value];
        const alreadyEquipped = next.filter((id, index) => index !== slotIndex && id === itemId).length;
        if (alreadyEquipped >= items.value[itemId]) return false;
        next[slotIndex] = itemId;
        equippedSlots.value = next;
        return true;
    }

    // 背包弹窗调用；卸下指定槽位的道具。
    function unequipItem(slotIndex: number): boolean {
        if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= INVENTORY_SLOT_COUNT) return false;
        const next = [...equippedSlots.value];
        next[slotIndex] = null;
        equippedSlots.value = next;
        return true;
    }

    // 天国玩家状态重建或背包操作调用；清空全部装备槽。
    function resetLoadout() {
        equippedSlots.value = Array.from({ length: INVENTORY_SLOT_COUNT }, () => null);
    }

    watch(
        items,
        (ownedCounts) => {
            equippedSlots.value = normalizeSlots(equippedSlots.value, ownedCounts);
        },
        { deep: true, flush: "sync" },
    );
    watch(equippedSlots, (slots) => saveInventoryLoadout(slots), { deep: true, immediate: true });

    return {
        items,
        inventorySlots,
        itemDefinitions: INVENTORY_ITEMS,
        equippedSlots,
        equipItem,
        unequipItem,
        resetLoadout,
    };
});
