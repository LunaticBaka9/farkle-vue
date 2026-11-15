import type { BadgeTier, InventoryItemDefinition } from "../domain/inventoryTypes.ts";

// 商店和背包共同读取此目录；价格按徽章等级划分，等级和效果来自 badges.csv。
export const INVENTORY_SLOT_COUNT = 3;

const TIER_DEFINITIONS: readonly { tier: BadgeTier; label: string; price: number }[] = [
    { tier: "tin", label: "锡制", price: 200 },
    { tier: "silver", label: "银制", price: 400 },
    { tier: "gold", label: "金制", price: 800 },
];

interface BadgeSeries {
    id: string;
    name: string;
    background: string;
    effects: Partial<Record<BadgeTier, string>>;
}

const BADGE_SERIES: readonly BadgeSeries[] = [
    {
        id: "doppelganger",
        name: "翻倍徽章",
        background: "徽章上刻着一对一模一样的双生子图案，象征成双成对与财富的复制。",
        effects: {
            tin: "将上一次掷骰得分翻倍，每局可用 1 次。",
            silver: "将上一次掷骰得分翻倍，每局可用 2 次。",
            gold: "将上一次掷骰得分翻倍，每局限用 3 次。",
        },
    },
    {
        id: "warlord",
        name: "军阀徽章",
        background: "铸有披甲统帅浮雕，象征在牌桌上如战场般一锤定音的统治力。",
        effects: {
            tin: "当前回合总得分增加 25%，每局限用 1 次。",
            silver: "当前回合总得分增加 50%，每局限用 1 次。",
            gold: "当前回合总得分翻倍，每局限用 1 次。",
        },
    },
    {
        id: "might",
        name: "力量徽章",
        background: "刻有紧握重锤的壮汉图案，代表压倒性的力量与绝对的数量优势。",
        effects: {
            tin: "投掷时额外增加 1 颗骰子，每局可用 1 次。",
            silver: "投掷时额外增加 1 颗骰子，每局可用 2 次。",
            gold: "投掷时额外增加 1 颗骰子，每局限用 3 次。",
        },
    },
    {
        id: "resurrection",
        name: "复活徽章",
        background: "描绘破棺重生的神迹图案，寓意在绝境中获得重来一次的机会。",
        effects: {
            tin: "投掷不理想或爆掉时，可重新投掷整轮，每局可用 1 次。",
            silver: "投掷不理想或爆掉时，可重新投掷整轮，每局可用 2 次。",
            gold: "投掷不理想或爆掉时，可重新投掷整轮，每局限用 3 次。",
        },
    },
    {
        id: "fortune",
        name: "幸运女神徽章",
        background: "刻有蒙眼女神与命运之轮，祈求福尔图娜女神为你拨正一颗偏离的骰子。",
        effects: {
            tin: "投掷后可重掷任意 1 颗骰子，每局限用 1 次。",
            silver: "投掷后可重掷任意 2 颗骰子，每局限用 1 次。",
            gold: "投掷后可重掷最多 3 颗骰子，每局限用 1 次。",
        },
    },
    {
        id: "transmutation",
        name: "转化徽章",
        background: "带有炼金术士符号的神秘徽章，传说能像点石成金一样改变骰面的数字。",
        effects: {
            tin: "投掷后将指定的 1 颗骰子改为 3 点，每局限用 1 次。",
            silver: "投掷后将指定的 1 颗骰子改为 5 点，每局限用 1 次。",
            gold: "投掷后将指定的 1 颗骰子改为 1 点，每局限用 1 次。",
        },
    },
    {
        id: "headstart",
        name: "先行徽章",
        background: "刻着疾驰骏马，象征在比赛鸣哨前便已抢占先机。",
        effects: {
            tin: "开局获得少量初始分数领先。",
            silver: "开局获得中等初始分数领先。",
            gold: "开局获得大量初始分数领先。",
        },
    },
    {
        id: "defence",
        name: "防守徽章",
        background: "铸有坚固盾牌与城垛，用于抵御对手在牌桌上耍弄的花招。",
        effects: {
            tin: "整局抵消并禁用对手锡制徽章效果。",
            silver: "整局抵消并禁用对手银制徽章效果。",
            gold: "整局抵消并禁用对手金制徽章效果。",
        },
    },
    {
        id: "swap-out",
        name: "调换徽章",
        background: "刻有交错双箭，代表灵活变通与偷天换日的牌桌技巧。",
        effects: {
            silver: "投掷后可重掷任意 1 颗骰子，每局限用 1 次。",
            gold: "投掷后可重掷 2 颗点数相同的骰子，每局限用 1 次。",
        },
    },
];

function createSeriesBadge(series: BadgeSeries, tier: BadgeTier): InventoryItemDefinition {
    const tierDefinition = TIER_DEFINITIONS.find((entry) => entry.tier === tier);
    const tierLabel = tierDefinition?.label ?? "特殊";
    return {
        id: `badge-${series.id}-${tier}`,
        name: `${series.name}（${tierLabel}）`,
        type: "badge",
        series: series.name,
        tier,
        tierLabel,
        description: series.background,
        effect: series.effects[tier] ?? "",
        price: tierDefinition?.price ?? 500,
        maxStack: 1,
    };
}

function createUniqueBadge({
    id,
    name,
    series,
    tier,
    description,
    effect,
}: {
    id: string;
    name: string;
    series: string;
    tier: BadgeTier;
    description: string;
    effect: string;
}): InventoryItemDefinition {
    const tierDefinition = TIER_DEFINITIONS.find((entry) => entry.tier === tier);
    return {
        id: `badge-${id}`,
        name,
        type: "badge",
        series,
        tier,
        tierLabel: tierDefinition?.label ?? "特殊",
        description,
        effect,
        price: tierDefinition?.price ?? 500,
        maxStack: 1,
    };
}

const TIER_ORDER: readonly BadgeTier[] = ["tin", "silver", "gold"];

const UNIQUE_BADGES: readonly InventoryItemDefinition[] = [
    createUniqueBadge({
        id: "gold-emperor",
        name: "金制君主徽章",
        series: "金制君主徽章",
        tier: "gold",
        description: "铸有神圣罗马帝国皇帝肖像的纯金徽章，象征至高无上的一统天下。",
        effect: "每当掷出 1+1+1 组合，该组合得分变为 3 倍（3000 分），可无限次触发。",
    }),
    createUniqueBadge({
        id: "gold-wedding",
        name: "金制婚礼徽章",
        series: "金制婚礼徽章",
        tier: "gold",
        description: "为庆祝塞米领主奥尔达与阿格尼丝大婚而特制的纯金纪念徽章。",
        effect: "投掷后可重掷最多 3 颗骰子，每局限用 1 次。",
    }),
    createUniqueBadge({
        id: "gold-tyche",
        name: "金制堤喀徽章",
        series: "金制堤喀徽章 DLC",
        tier: "gold",
        description: "供奉希腊幸运女神堤喀的异域金章，偏爱数字 6。",
        effect: "每当掷出 6+6+6，该组合得分翻倍（1200 分），可无限次触发。",
    }),
    createUniqueBadge({
        id: "bird-king-silver",
        name: "鸟王徽章",
        series: "鸟王徽章",
        tier: "silver",
        description: "一枚造型奇特的银质徽章，上面自豪地刻着“鸟类真正国王”的滑稽徽记。",
        effect: "投掷时额外增加 1 颗骰子，每局限用 2 次。",
    }),
    createUniqueBadge({
        id: "priests-advantage",
        name: "教区牧师的优势徽章",
        series: "教区牧师的优势徽章",
        tier: "special",
        description: "属于神职人员的专用徽章，刻着象征神明注视世人的全视之眼。",
        effect: "解锁专属计分组合“圣眼”（The Eye）：同时保留 1、3、5 即可计分。",
    }),
    createUniqueBadge({
        id: "executioners-advantage",
        name: "行刑者的优势徽章",
        series: "行刑者的优势徽章",
        tier: "special",
        description: "刽子手公会流传出来的阴森徽章，上面刻着绞刑架的轮廓。",
        effect: "解锁专属计分组合“绞刑架”（The Gallows）：同时保留 4、5、6 即可计分。",
    }),
    createUniqueBadge({
        id: "carpenters-advantage",
        name: "木匠的优势徽章",
        series: "木匠的优势徽章",
        tier: "special",
        description: "刻有手锯与刨子图案的行会徽章，代表木匠精准利落的切割手艺。",
        effect: "解锁专属计分组合“切割”（The Cut）：同时保留 3、5 即可计分。",
    }),
];

const SERIES_BADGES = BADGE_SERIES.flatMap((series) =>
    TIER_ORDER.filter((tier) => series.effects[tier]).map((tier) => createSeriesBadge(series, tier)),
);

export const INVENTORY_ITEMS: readonly InventoryItemDefinition[] = Object.freeze([...SERIES_BADGES, ...UNIQUE_BADGES]);

export const INVENTORY_ITEM_BY_ID: Readonly<Record<string, InventoryItemDefinition>> = Object.freeze(
    Object.fromEntries(INVENTORY_ITEMS.map((item) => [item.id, item])),
);
