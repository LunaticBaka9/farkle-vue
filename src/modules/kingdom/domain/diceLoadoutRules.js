// 骰子装备规则：纯函数校验 6 个槽位、库存和权重，不依赖 Vue 或 Pinia。
import { DICE_SLOT_COUNT, FALLBACK_DIE_ID, UNIFORM_WEIGHTS } from "./diceConstants.js";

/** @param {readonly string[]} slots @returns {Record<string, number>} 统计当前 6 个出战槽位里每种骰子占用的数量。 */
export function countEquipped(slots) {
    const counts = {};
    for (const dieId of slots) counts[dieId] = (counts[dieId] ?? 0) + 1;
    return counts;
}

/** @param {{ isInfinite?: boolean } | undefined} die @returns {boolean} 判断骰子是否无限供应。 */
export function isInfiniteDie(die) {
    return Boolean(die?.isInfinite);
}

/**
 * @param {{ dieId: string, catalog: Record<string, any>, ownedCounts: Record<string, number>, equippedCounts: Record<string, number> }} input
 * @returns {number} 某种骰子当前还能上几颗；无限骰返回 99。
 */
export function getAvailableCount({ dieId, catalog, ownedCounts, equippedCounts }) {
    const die = catalog[dieId];
    if (!die) return 0;
    if (isInfiniteDie(die)) return 99;
    return Math.max(0, (ownedCounts[dieId] ?? 0) - (equippedCounts[dieId] ?? 0));
}

/**
 * @param {readonly string[]} slots
 * @param {{ catalog: Record<string, any>, ownedCounts: Record<string, number> }} input
 * @returns {{ ok: boolean, message: string }}
 */
export function validateLoadout(slots, { catalog, ownedCounts }) {
    if (!Array.isArray(slots) || slots.length !== DICE_SLOT_COUNT) {
        return { ok: false, message: `必须装备 ${DICE_SLOT_COUNT} 颗骰子。` };
    }
    for (const dieId of slots) {
        if (typeof dieId !== "string" || !catalog[dieId]) {
            return { ok: false, message: "装备中包含未知骰子。" };
        }
    }
    const equippedCounts = countEquipped(slots);
    for (const [dieId, count] of Object.entries(equippedCounts)) {
        const die = catalog[dieId];
        if (isInfiniteDie(die)) continue;
        if (count > (ownedCounts[dieId] ?? 0)) {
            return { ok: false, message: `${die.name} 最多只能装备 ${ownedCounts[dieId] ?? 0} 颗。` };
        }
    }
    return { ok: true, message: "装备有效。" };
}

/**
 * @param {{ catalog: Record<string, any>, ownedCounts: Record<string, number> }} input
 * @returns {string[]}
 */
export function buildDefaultSlots({ catalog, ownedCounts }) {
    const fallbackId = catalog[FALLBACK_DIE_ID]
        ? FALLBACK_DIE_ID
        : Object.values(catalog).find((die) => isInfiniteDie(die))?.id || Object.keys(catalog)[0];
    const slots = [];
    for (const [dieId, count] of Object.entries(ownedCounts)) {
        if (!catalog[dieId] || isInfiniteDie(catalog[dieId])) continue;
        for (let index = 0; index < count && slots.length < DICE_SLOT_COUNT; index += 1) slots.push(dieId);
    }
    while (slots.length < DICE_SLOT_COUNT) slots.push(fallbackId);
    return slots.slice(0, DICE_SLOT_COUNT);
}

/** 只接受 6 个非负有限权重；非法配置回退为均匀骰，避免脏数据破坏随机分布。 */
export function normalizeDiceWeights(weights) {
    if (!Array.isArray(weights) || weights.length !== 6) return UNIFORM_WEIGHTS;
    const valid = weights.every((weight) => Number.isFinite(weight) && weight >= 0);
    if (!valid || weights.every((weight) => weight === 0)) return UNIFORM_WEIGHTS;
    return weights;
}

/** 把槽位映射成掷骰引擎需要的 6 组权重。 */
export function weightsForSlots(slots, catalog) {
    return slots.map((dieId) => normalizeDiceWeights(catalog[dieId]?.weights));
}
