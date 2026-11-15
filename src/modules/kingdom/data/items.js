import { INVENTORY_ITEMS } from "./inventoryItems.ts";
import { KINGDOM_DICE } from "./dices.ts";

// 天国模式静态目录：由 kingdom 模式页、商店和对战装备展示共同读取。
export const KINGDOM_DICE_MAX_COPIES = 6;

export const DEFAULT_KINGDOM_STATE = Object.freeze({
    coins: 1250,
    ownedIds: Object.freeze([]),
});

// 对手参数由 KingdomMode 传给对战入口；挑战金额、目标和难度均以此目录为准。
export const KINGDOM_OPPONENTS = Object.freeze([
    {
        id: "squire",
        name: "学徒骑士",
        title: "初级挑战者",
        difficulty: "cautious",
        wager: 50,
        target: 5000,
        icon: "shield",
    },
    {
        id: "archer",
        name: "林间射手",
        title: "精准控局者",
        difficulty: "balanced",
        wager: 100,
        target: 7500,
        icon: "user",
    },
    {
        id: "alchemist",
        name: "宫廷炼金师",
        title: "善用风险的棋手",
        difficulty: "bold",
        wager: 180,
        target: 10000,
        icon: "spark",
    },
    {
        id: "knight",
        name: "黑甲骑士",
        title: "皇家精英",
        difficulty: "balanced",
        wager: 260,
        target: 10000,
        icon: "shield",
    },
    {
        id: "dragon",
        name: "龙堡守卫",
        title: "传说级对手",
        difficulty: "bold",
        wager: 400,
        target: 15000,
        icon: "flame",
    },
]);

// 商店的徽章商品直接从背包目录生成，名称、效果和售价不再重复维护。
const KINGDOM_BADGE_SHOP_ITEMS = INVENTORY_ITEMS.map((item) => ({
    id: item.id,
    category: "item",
    name: item.name,
    detail: `${item.tierLabel} · ${item.effect}`,
    price: item.price,
    icon: "shield",
}));

// 骰子名称、描述和 ID 来自真实骰子目录；无限供应的普通骰无需购买。
const KINGDOM_DICE_SHOP_ITEMS = KINGDOM_DICE.filter((die) => !die.isInfinite).map((die) => ({
    id: die.id,
    category: "dice",
    name: die.name,
    detail: die.desc ?? "",
    price: 500,
    icon: die.icon,
}));

// 商店渲染此列表；骰子与徽章均从各自的实际目录生成。
export const KINGDOM_SHOP_ITEMS = Object.freeze([
    ...KINGDOM_DICE_SHOP_ITEMS,
    ...KINGDOM_BADGE_SHOP_ITEMS,
]);

// 对战牌桌从同一商品目录生成装备名称与图标，保证商店与装备展示一致。
export const KINGDOM_EQUIPMENT = Object.freeze({
    item: Object.freeze(
        Object.fromEntries(
            KINGDOM_SHOP_ITEMS.filter((item) => item.category === "item").map((item) => [item.id, item]),
        ),
    ),
    dice: Object.freeze(
        Object.fromEntries(
            KINGDOM_SHOP_ITEMS.filter((item) => item.category === "dice").map((item) => [item.id, item]),
        ),
    ),
});
