// 天国骰子领域类型：只声明数据结构，不包含运行时代码。
export const DICE_SLOT_COUNT = 6;
export const FALLBACK_DIE_ID = "dice-plain";

export type DiceWeights = readonly [number, number, number, number, number, number];
export type DiceSlots = [string, string, string, string, string, string];

export interface DiceLoadoutConfig {
    dieId: string;
    name: string;
    weights: DiceWeights;
    isInfinite: boolean;
}

export interface DiceCatalogEntry {
    id: string;
    name: string;
    description: string;
    icon: string;
    weights: DiceWeights;
    isInfinite: boolean;
}

export interface DiceInventoryState {
    /** 玩家拥有的特殊骰子数量表，例如 { "dice-royal": 2 }。 */
    ownedCounts: Record<string, number>;
    /** 当前出战的 6 个骰子槽位，存 dieId；普通骰可重复。 */
    equippedSlots: DiceSlots;
}

export interface DiceSelectionResult {
    ok: boolean;
    message: string;
}
