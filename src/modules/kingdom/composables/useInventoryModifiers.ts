import { computed } from "vue";
import { useInventoryStore } from "../stores/useInventoryStore.ts";
import type { FarkleModifier } from "../domain/inventoryTypes.ts";

// 天国对战 store 调用；输入为背包 store 中实时响应的装备槽。
export function useInventoryModifiers() {
    const inventory = useInventoryStore();

    return computed<FarkleModifier[]>(() => {
        const modifiers: FarkleModifier[] = [];
        for (const itemId of inventory.equippedSlots) {
            if (itemId === "badge-gold-tyche") {
                modifiers.push({
                    id: "badge-gold-tyche-score-effect",
                    onCalculateScore(context) {
                        if (context.values.filter((value) => value === 6).length >= 3) context.bonusFlat += 600;
                    },
                });
            }
        }
        return modifiers;
    });
}
