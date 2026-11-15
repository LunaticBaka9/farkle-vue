// 天国背包、商店目录与徽章效果转换器共同使用的物品契约。
export type BadgeTier = "tin" | "silver" | "gold" | "special";

export interface InventoryItemDefinition {
    id: string;
    name: string;
    type: "badge";
    series: string;
    tier: BadgeTier;
    tierLabel: string;
    description: string;
    effect: string;
    price: number;
    maxStack: 1;
}

export interface InventorySlot {
    itemId: string | null; // 格子里装的物品 ID，null 代表空格
    count: number; // 数量
}

export interface FarkleScoreContext {
    values: readonly number[];
    baseScore: number;
    bonusFlat: number;
}

export interface FarkleModifier {
    id: string;
    onCalculateScore(context: FarkleScoreContext): void;
}
