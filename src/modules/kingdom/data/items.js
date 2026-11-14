// 天国模式静态目录：由 kingdom 模式页、商店和对战装备展示共同读取。
export const DEFAULT_KINGDOM_STATE = Object.freeze({
    coins: 1250,
    ownedIds: Object.freeze(["item-cross", "item-bag", "dice-royal"]),
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

// 商店渲染此列表；收藏和装备使用稳定 id 关联，不在视图组件里重复定义商品信息。
export const KINGDOM_SHOP_ITEMS = Object.freeze([
    { id: "dice-royal", category: "dice", name: "皇家骰子", detail: "金色纹章，庄重典雅", price: 320, icon: "dice" },
    { id: "dice-knight", category: "dice", name: "骑士骰子", detail: "银灰盔甲，坚毅可靠", price: 480, icon: "shield" },
    {
        id: "dice-lucky",
        category: "dice",
        name: "幸运骰子",
        detail: "低调闪光，为关键一掷增添运气",
        price: 650,
        icon: "spark",
    },
    {
        id: "item-cross",
        category: "item",
        name: "皇家十字印记",
        detail: "稀有护符，可用于天国对局",
        price: 220,
        icon: "shield",
    },
    {
        id: "item-bag",
        category: "item",
        name: "古堡金币袋",
        detail: "古旧皮革，便于携带金币",
        price: 180,
        icon: "bank",
    },
    {
        id: "item-spark",
        category: "item",
        name: "幸运火花",
        detail: "等待下一次奇遇的神秘道具",
        price: 360,
        icon: "flame",
    },
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
