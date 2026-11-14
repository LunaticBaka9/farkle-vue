// 天国骰子装备 store：维护 6 个出战槽位、库存校验和传给掷骰引擎的独立权重。
import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { ItemDef } from "../../../shared/game/types";
import { KINGDOM_DICE } from "../data/dices";
import { DICE_SLOT_COUNT, FALLBACK_DIE_ID } from "../domain/diceConstants.js";
import { createDiceCatalog } from "../domain/diceCatalog";
import type { DiceCatalogEntry, DiceLoadoutConfig, DiceSelectionResult } from "../domain/diceTypes";
import {
    buildDefaultSlots,
    countEquipped,
    getAvailableCount,
    validateLoadout,
    weightsForSlots,
} from "../domain/diceLoadoutRules";
import { restoreDiceLoadout, saveDiceLoadout } from "../storage/diceLoadoutStorage";
import { useKingdomStore } from "./kingdomStore.js";

const DICE_CATALOG: Record<string, DiceCatalogEntry> = createDiceCatalog(KINGDOM_DICE as readonly ItemDef[]);

export const useDiceLoadoutStore = defineStore("kingdom-dice-loadout", () => {
    const kingdom = useKingdomStore();

    // 特殊骰以收藏 id 计数；普通骰无限供应，不占用 ownedCounts。
    const ownedCounts = computed<Record<string, number>>(() => {
        const counts: Record<string, number> = {};
        for (const id of kingdom.ownedIds) {
            if (!DICE_CATALOG[id]) continue;
            counts[id] = (counts[id] ?? 0) + 1;
        }
        return counts;
    });

    const savedSlots = restoreDiceLoadout();
    const initialSlots =
        savedSlots && validateLoadout(savedSlots, { catalog: DICE_CATALOG, ownedCounts: ownedCounts.value }).ok
            ? savedSlots
            : buildDefaultSlots({ catalog: DICE_CATALOG, ownedCounts: ownedCounts.value });
    const equippedSlots = ref<string[]>([...initialSlots]);
    saveDiceLoadout(equippedSlots.value);

    const equippedCountMap = computed<Record<string, number>>(
        () => countEquipped(equippedSlots.value) as Record<string, number>,
    );
    const equippedDice = computed(() =>
        equippedSlots.value.flatMap((id, slotIndex) => {
            const die = DICE_CATALOG[id];
            return die ? [{ ...die, slotIndex }] : [];
        }),
    );
    const equippedWeights = computed(() => weightsForSlots(equippedSlots.value, DICE_CATALOG));
    // 传给引擎的完整 6 颗配置；dieId 保留给未来的护符/套装化学反应。
    const equippedConfigs = computed<DiceLoadoutConfig[]>(() =>
        equippedDice.value.map((die) => ({
            dieId: die.id,
            name: die.name,
            weights: die.weights,
            isInfinite: die.isInfinite,
        })),
    );
    const isValid = computed(
        () =>
            validateLoadout(equippedSlots.value, {
                catalog: DICE_CATALOG,
                ownedCounts: ownedCounts.value,
            }).ok,
    );
    const availableDice = computed(() =>
        KINGDOM_DICE.map((item) => {
            const die = DICE_CATALOG[item.id];
            return {
                ...die,
                ownedCount: ownedCounts.value[item.id] ?? 0,
                equippedCount: equippedCountMap.value[item.id] ?? 0,
                available: getAvailableCount({
                    dieId: item.id,
                    catalog: DICE_CATALOG,
                    ownedCounts: ownedCounts.value,
                    equippedCounts: equippedCountMap.value,
                }),
            };
        }),
    );

    /** 计算某颗骰子还能上几个槽位；无限骰返回 99。 */
    function availableCount(dieId: string): number {
        return getAvailableCount({
            dieId,
            catalog: DICE_CATALOG,
            ownedCounts: ownedCounts.value,
            equippedCounts: equippedCountMap.value,
        });
    }

    /** 判断能否把某颗骰子放入目标槽位，并返回给 UI 的提示文案。 */
    function canEquipDie(slotIndex: number, targetDieId: string): DiceSelectionResult {
        if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= DICE_SLOT_COUNT) {
            return { ok: false, message: "槽位不存在。" };
        }
        if (!DICE_CATALOG[targetDieId]) return { ok: false, message: "未知骰子，无法装备。" };
        if (equippedSlots.value[slotIndex] === targetDieId) return { ok: true, message: "该骰子已在槽位中。" };
        if (availableCount(targetDieId) > 0) return { ok: true, message: "可以装备。" };
        // 库存为 0 但目标骰子已在其他槽位时，允许交换两个槽位，避免玩家先手动卸下。
        if (equippedSlots.value.includes(targetDieId)) return { ok: true, message: "将交换两个槽位。" };
        return { ok: false, message: `${DICE_CATALOG[targetDieId].name} 已全部上场，库存不足。` };
    }

    /** 玩家点击槽位替换骰子；调用方只需处理 boolean，失败原因可由 canEquipDie 获取。 */
    function equipDieToSlot(slotIndex: number, targetDieId: string): boolean {
        const check = canEquipDie(slotIndex, targetDieId);
        if (!check.ok) return false;
        if (equippedSlots.value[slotIndex] === targetDieId) return true;
        const next = [...equippedSlots.value];
        const sourceIndex = equippedSlots.value.indexOf(targetDieId);
        if (availableCount(targetDieId) <= 0 && sourceIndex !== -1) {
            // 交换槽位：目标移动到点击槽位，原槽位接收被替换的骰子。
            next[sourceIndex] = equippedSlots.value[slotIndex];
        }
        next[slotIndex] = targetDieId;
        equippedSlots.value = next;
        return true;
    }

    /** 一次性传入恰好 6 颗骰子；挑战入口和外部配置都通过这里校验。 */
    function setLoadout(dieIds: readonly string[]): DiceSelectionResult {
        if (dieIds.length !== DICE_SLOT_COUNT) {
            return { ok: false, message: `必须传入 ${DICE_SLOT_COUNT} 颗骰子。` };
        }
        const check = validateLoadout(dieIds, { catalog: DICE_CATALOG, ownedCounts: ownedCounts.value });
        if (!check.ok) return check;
        equippedSlots.value = [...dieIds];
        return { ok: true, message: "骰子装备已更新。" };
    }

    /** 清空槽位时回填无限普通骰，保证出战列表永远是 6 颗。 */
    function unequipDieFromSlot(slotIndex: number): boolean {
        if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= DICE_SLOT_COUNT) return false;
        const fallback = DICE_CATALOG[FALLBACK_DIE_ID];
        if (!fallback) return false;
        const next = [...equippedSlots.value];
        next[slotIndex] = fallback.id;
        equippedSlots.value = next;
        return true;
    }

    // “恢复默认”按需求固定回填 6 颗无限普通骰，不再参考特殊骰库存。
    function resetLoadout(): void {
        if (DICE_CATALOG[FALLBACK_DIE_ID]) {
            equippedSlots.value = Array.from({ length: DICE_SLOT_COUNT }, () => FALLBACK_DIE_ID);
            return;
        }
        equippedSlots.value = buildDefaultSlots({ catalog: DICE_CATALOG, ownedCounts: ownedCounts.value });
    }

    // 购买、重置收藏后，旧装备可能包含已不拥有的骰子；自动回退到合法默认组合。
    watch(ownedCounts, () => {
        const check = validateLoadout(equippedSlots.value, {
            catalog: DICE_CATALOG,
            ownedCounts: ownedCounts.value,
        });
        if (!check.ok) resetLoadout();
    });
    // 槽位变化立即持久化，刷新对战路由后仍使用同一套权重。
    watch(equippedSlots, (slots) => saveDiceLoadout(slots), { deep: true });

    return {
        catalog: DICE_CATALOG,
        slotCount: DICE_SLOT_COUNT,
        equippedSlots,
        equippedCountMap,
        equippedDice,
        equippedWeights,
        equippedConfigs,
        ownedCounts,
        availableDice,
        isValid,
        availableCount,
        canEquipDie,
        equipDieToSlot,
        setLoadout,
        unequipDieFromSlot,
        resetLoadout,
    };
});
