// 天国特殊骰子静态目录：背包、骰子列表和对战装备按 id 读取；权重来自特殊骰子效果表。
// 概率分档：极大 ≥33.3%，大 25–33.3%，中等 20–25%，小 10–20%，极小 <10%。普通骰各面约 16.7%。

import type { ItemDef } from "../../../shared/game/types";

type DiceWeights = readonly [number, number, number, number, number, number];

type DiceInput = Omit<ItemDef, "type" | "maxStack" | "icon" | "weights"> & {
    weights: DiceWeights;
    maxStack?: number;
    icon?: string;
};

/**
 * 组装一颗骰子的 ItemDef。weights 下标 0 对应 1 点，值为相对权重，掷骰时再归一化。
 * 调用方：本目录初始化；partial 来自下方效果表逐条配置。
 */
function defineDice(partial: DiceInput): ItemDef {
    return Object.freeze({
        type: "dice",
        maxStack: 1,
        icon: "dice",
        isInfinite: false,
        ...partial,
        weights: Object.freeze([...partial.weights]) as DiceWeights,
    });
}

export const KINGDOM_ITEMS: readonly ItemDef[] = Object.freeze([
    defineDice({
        id: "dice-alfonse-demon",
        name: "阿方瑟的恶魔骰子",
        icon: "flame",
        desc: "一点的面为恶魔脸，效果类似癞子（搭子），可以与任意组合搭配，但不能单独成数。",
        note: "DLC 的骰子，有癞子，但出所有面的概率都一样。",
        series: "dlc",
        wildFace: 1,
        weights: [1, 1, 1, 1, 1, 1],
    }),
    defineDice({
        id: "dice-alfonse",
        name: "阿方瑟的骰子",
        icon: "spark",
        desc: "极大概率出一，中等概率出六，小概率出五，其他数的概率极小。",
        note: "DLC 的骰子，阿方瑟骰子一套，BUG 级的存在。",
        series: "dlc",
        weights: [36, 9, 9, 9, 15, 22],
    }),
    defineDice({
        id: "dice-ambrose",
        name: "安布罗斯的骰子",
        desc: "大概率出一，中等概率出二和六，小概率出五，其他数的概率极小。",
        note: "整体概率都比阿方瑟的骰子低一点。",
        weights: [30, 22, 6, 6, 14, 22],
    }),
    defineDice({
        id: "dice-demon-head",
        name: "恶魔之首",
        icon: "flame",
        desc: "一点的面为恶魔脸，效果类似癞子（搭子），可以与任意组合搭配，但不能单独成数。",
        note: "有癞子，但出所有面的概率都一样。",
        wildFace: 1,
        weights: [1, 1, 1, 1, 1, 1],
    }),
    defineDice({
        id: "dice-even",
        name: "偶数骰子",
        desc: "80% 概率出偶数，20% 概率出奇数。",
        weights: [1, 4, 1, 4, 1, 4],
    }),
    defineDice({
        id: "dice-odd",
        name: "奇数骰子",
        desc: "80% 概率出奇数，20% 概率出偶数。",
        weights: [4, 1, 4, 1, 4, 1],
    }),
    defineDice({
        id: "dice-heaven",
        name: "天国骰子",
        icon: "shield",
        desc: "极大概率出一，中等概率出六。",
        note: "天国骰子的六点面仅是特殊造型，没有恶魔脸效果。",
        weights: [36, 11, 10, 11, 10, 22],
    }),
    defineDice({
        id: "dice-lu",
        name: "卢氏骰子",
        icon: "flame",
        desc: "极大概率出六。",
        note: "恶魔三骰，路西法的「卢」。",
        series: "lucifer",
        weights: [12, 12, 12, 12, 12, 40],
    }),
    defineDice({
        id: "dice-qian",
        name: "「茜」骰子",
        icon: "flame",
        desc: "极大概率出六。",
        note: "恶魔三骰，路西法的「茜」。",
        series: "lucifer",
        weights: [12, 12, 12, 12, 12, 40],
    }),
    defineDice({
        id: "dice-esan",
        name: "恶三骰",
        icon: "flame",
        desc: "极大概率出六。",
        note: "恶魔三骰，路西法的「法」。",
        series: "lucifer",
        weights: [12, 12, 12, 12, 12, 40],
    }),
    defineDice({
        id: "dice-fortune",
        name: "幸运之骰",
        icon: "spark",
        // 效果表同时写了「中等概率出二」和「不会出二」；按前半句落实，六点权重为 0。
        desc: "极大概率出一和五，中等概率出二，极小概率出三和四，不会出六。",
        note: "虽然名字相近，但幸运骰子与幸运之骰的概率机制不一样。",
        weights: [34, 22, 5, 5, 34, 0],
    }),
    defineDice({
        id: "dice-lucky",
        name: "幸运骰子",
        icon: "spark",
        desc: "大概率出一和六，其他数的概率从大到小依次递减。",
        note: "虽然名字相近，但幸运骰子与幸运之骰的概率机制不一样。",
        weights: [30, 6, 8, 12, 16, 28],
    }),
    defineDice({
        id: "dice-mini",
        name: "缩小版的骰子",
        desc: "极大概率出六，大概率出二，小概率出其他数。",
        note: "外观上其实没有小。",
        weights: [10, 26, 10, 10, 10, 34],
    }),
    defineDice({
        id: "dice-strip",
        name: "脱衣骰子",
        desc: "大概率出一，小概率出五和六，略小概率出其他数。",
        note: "因为是从类似脱衣舞娘的职业处获得的骰子，因而得名。",
        weights: [30, 13, 13, 12, 16, 16],
    }),
    defineDice({
        id: "dice-henry-beta",
        name: "亨利的B测骰子",
        desc: "极大概率出二。",
        note: "垃圾系列。",
        series: "junk",
        weights: [12, 40, 12, 12, 12, 12],
    }),
    defineDice({
        id: "dice-tampered",
        name: "动过手脚的骰子",
        desc: "极大概率出二，中等概率出一，小概率出五，其他数的概率极小。",
        note: "垃圾系列。",
        series: "junk",
        weights: [22, 36, 9, 9, 15, 9],
    }),
    defineDice({
        id: "dice-unwelcome",
        name: "不受欢迎的骰子",
        desc: "大概率出二，小概率出三四五，极小概率出一和六。",
        note: "垃圾系列。",
        series: "junk",
        weights: [9, 28, 18, 18, 18, 9],
    }),
    defineDice({
        id: "dice-jinx",
        name: "厄运骰子",
        desc: "极小概率出一和六。",
        note: "垃圾系列。",
        series: "junk",
        weights: [6, 22, 22, 22, 22, 6],
    }),
    defineDice({
        id: "dice-trinity",
        name: "三圣一骰子",
        desc: "极大概率出三，中等概率出二，小概率出一，其他数的概率极小。",
        note: "垃圾系列。",
        series: "junk",
        weights: [15, 22, 36, 9, 9, 9],
    }),
    defineDice({
        id: "dice-royal",
        name: "皇家骰子",
        icon: "dice",
        desc: "皇家工坊打造的标准骰子，六个面的权重保持均衡。",
        note: "基础骰，权重留作后续平衡调整的入口。",
        weights: [1, 1, 1, 1, 1, 1],
    }),
    defineDice({
        id: "dice-knight",
        name: "骑士骰子",
        icon: "shield",
        desc: "骑士团配发的制式骰子，六个面的权重保持均衡。",
        note: "基础骰，权重留作后续平衡调整的入口。",
        weights: [1, 1, 1, 1, 1, 1],
    }),
    defineDice({
        id: "dice-plain",
        name: "普通骰子",
        maxStack: 6,
        isInfinite: true,
        desc: "所有数的概率都一样。",
        note: "就是普通骰子，无任何特殊效果。",
        weights: [1, 1, 1, 1, 1, 1],
    }),
]);

export const KINGDOM_ITEMS_BY_ID: Readonly<Record<string, ItemDef>> = Object.freeze(
    Object.fromEntries(KINGDOM_ITEMS.map((item) => [item.id, item])),
);

export const KINGDOM_DICE: ItemDef[] = KINGDOM_ITEMS.filter((item) => item.type === "dice");

/**
 * 按配置表 id 取 ItemDef；背包实例的 defId、商店和对战装备展示都会查这里。
 */
export function getKingdomItem(id: string): ItemDef | null {
    return KINGDOM_ITEMS_BY_ID[id] ?? null;
}
