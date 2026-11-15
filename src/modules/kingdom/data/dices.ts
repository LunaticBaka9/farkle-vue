// 天国特殊骰子静态目录：背包、骰子列表和对战装备按 id 读取；权重数值对应 dices.csv 的各面百分比。

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
        id: "dice-plain",
        name: "普通骰子",
        maxStack: 6,
        isInfinite: true,
        desc: "所有数的概率都一样。",
        note: "就是普通骰子，无任何特殊效果。",
        weights: [1, 1, 1, 1, 1, 1],
    }),
    defineDice({
        id: "weighted-die",
        name: "灌铅骰子",
        icon: "flame",
        desc: "这种内部灌了铅的骰子是所有老千的最爱。只要对手没发现，它就能帮你赢光酒馆里所有人的钱。",
        note: "顶级神器，三分之二概率直接出1",
        weights: [66.7, 6.7, 6.7, 6.7, 6.7, 6.7],
    }),
    defineDice({
        id: "pie-die",
        name: "派骰子",
        desc: "烤在派里藏着带进监狱的骰子，表面还沾着点面粉和油脂，但用起来出奇地顺手。",
        note: "不会出5和6，出1率极高，配灌铅骰子是公认最强组合",
        weights: [46.2, 7.7, 23.1, 23.1, 0, 0],
    }),
    defineDice({
        id: "painted-die",
        name: "涂漆骰子",
        desc: "表面涂着鲜艳彩漆。漆面不仅是为了好看，厚薄不均的颜料也悄悄改变了它的重心。",
        note: "极易出5（1.3版微调后依然很强）",
        weights: [20, 6.7, 6.7, 6.7, 40, 20],
    }),
    defineDice({
        id: "monk-die",
        name: "僧侣骰子",
        series: "dlc",
        desc: "修道院里的修士们在祈祷之余用来消遣的小玩意，似乎受到了某种特殊的“祝福”。",
        note: "1和2双高概率",
        weights: [40, 40, 5, 5, 5, 5],
    }),
    defineDice({
        id: "dice-heaven",
        name: "天国骰",
        icon: "shield",
        desc: "骰子上印有天国（Heavenly Kingdom）的徽记，仿佛有天主在暗中眷顾着投掷它的人。",
        note: "6点面为天国标志，出1率很高",
        weights: [36.8, 10.5, 10.5, 10.5, 10.5, 21.1],
    }),
    defineDice({
        id: "favourable-die",
        name: "幸运骰子（白）",
        icon: "spark",
        desc: "一颗深受幸运女神青睐的白色骰子，总能在关键时刻掷出你最需要的点数。",
        note: "1和5合计高达66.6%，绝不出2，极度稳健",
        weights: [33.3, 0, 5.6, 5.6, 33.3, 22.2],
    }),
    defineDice({
        id: "dice-lucky",
        name: "幸运骰子（蓝）",
        icon: "spark",
        desc: "染成深蓝色的骰子，据说能为持有者带来意想不到的好运。",
        note: "偏重1和6，综合手感不错",
        weights: [27.3, 4.6, 9.1, 13.6, 18.2, 27.3],
    }),
    defineDice({
        id: "mother-of-pearl-die",
        name: "珍珠母骰子",
        series: "dlc",
        desc: "用珍贵的珍珠母贝精雕细琢而成的奢华骰子，在烛光下泛着温润的光泽。",
        note: "1、5、6均衡高出率",
        weights: [25, 8.3, 8.3, 8.3, 25, 25],
    }),
    defineDice({
        id: "cautious-cheater-die",
        name: "谨慎骗子的骰子",
        desc: "只有老练且谨慎的赌徒才会使用的特制骰子——作弊的痕迹非常隐蔽，绝不会因为赢太狠而被当场拆穿。",
        note: "1和5概率对称偏高，不易爆掉",
        weights: [23.8, 14.3, 9.5, 14.3, 23.8, 14.3],
    }),
    defineDice({
        id: "dice-strip",
        name: "脱衣骰子",
        desc: "原本是酒馆里玩“脱衣赌博”游戏时专用的骰子，如今流落到了牌桌上。",
        note: "1、5、6均高于平均值",
        weights: [25, 12.5, 12.5, 12.5, 18.8, 18.8],
    }),
    defineDice({
        id: "tengri-die",
        name: "腾格里骰子",
        desc: "刻有东方游牧民族长生天（Tengri）图腾的异域骰子，蕴含着草原神灵的庇佑。",
        note: "纯粹提高了1点的出率",
        weights: [28.6, 14.3, 14.3, 14.3, 14.3, 14.3],
    }),
    defineDice({
        id: "aranka-die",
        name: "阿兰卡的骰子",
        desc: "游牧民女巫阿兰卡（Aranka）的私人骰子，据说被她施过某种偏向奇数的吉普赛小戏法。",
        note: "85.8%概率出奇数（1/3/5），非常强力",
        weights: [28.6, 4.8, 28.6, 4.8, 28.6, 4.8],
    }),
    defineDice({
        id: "dice-odd",
        name: "奇数骰子",
        desc: "经过特殊打磨的骰子，几乎总是停在1、3、5这样的奇数面上。",
        note: "80%概率出奇数（1/3/5）",
        weights: [26.7, 6.7, 26.7, 6.7, 26.7, 6.7],
    }),
    defineDice({
        id: "dice-even",
        name: "偶数骰子",
        desc: "经过特殊配重的骰子，极其容易掷出2、4、6这样的偶数。",
        note: "80%概率出偶数（2/4/6），适合凑三连偶数",
        weights: [6.7, 26.7, 6.7, 26.7, 6.7, 26.7],
    }),
    defineDice({
        id: "saint-antiochus-die",
        name: "圣安提阿克斯的骰子",
        desc: "以圣安提阿克斯命名的骰子，传说神圣的三位一体之力总能指引它停在“3”上。",
        note: "首发版本100%出3，1.3/1.4补丁后大幅削弱为40%出3",
        weights: [20, 6.7, 40, 6.7, 6.7, 20],
    }),
    defineDice({
        id: "holy-trinity-die",
        name: "圣三一骰子",
        desc: "颂扬圣父、圣子、圣灵三位一体的骰子，点数几乎从不超过3。",
        note: "偏向1、2、3小点数",
        weights: [21.1, 26.3, 36.8, 5.3, 5.3, 5.3],
    }),
    defineDice({
        id: "dice-trinity",
        name: "出三骰",
        desc: "无论是巧合还是工艺使然，这颗骰子对数字“3”有着特别的执着。",
        note: "偏重3点（1.3版削弱后为36.4%）",
        weights: [18.2, 9.1, 36.4, 9.1, 18.2, 9.1],
    }),
    defineDice({
        id: "dice-lu",
        name: "恶一骰子（Ci）",
        icon: "flame",
        series: "lucifer",
        desc: "刻有音节“Ci”的诡异骰子，偏爱象征恶魔的“6”。",
        note: "恶一、恶二、恶三骰属性完全相同，集齐有特殊彩蛋含义",
        weights: [14.3, 14.3, 14.3, 14.3, 14.3, 28.6],
    }),
    defineDice({
        id: "dice-qian",
        name: "恶二骰子（Fer）",
        icon: "flame",
        series: "lucifer",
        desc: "刻有音节“Fer”的诡异骰子，偏爱象征恶魔的“6”。",
        note: "恶一、恶二、恶三骰属性完全相同，集齐有特殊彩蛋含义",
        weights: [14.3, 14.3, 14.3, 14.3, 14.3, 28.6],
    }),
    defineDice({
        id: "dice-esan",
        name: "恶三骰子（Lu）",
        icon: "flame",
        series: "lucifer",
        desc: "刻有音节“Lu”的诡异骰子，偏爱象征恶魔的“6”。",
        note: "恶一、恶二、恶三骰属性完全相同，集齐有特殊彩蛋含义",
        weights: [14.3, 14.3, 14.3, 14.3, 14.3, 28.6],
    }),
    defineDice({
        id: "dice-mini",
        name: "缩水骰子",
        desc: "因为材质干燥收缩而略微变形的骨骰，意外地让6点和1点变得更容易朝上。",
        note: "偏重6点和1点",
        weights: [22.2, 11.1, 11.1, 11.1, 11.1, 33.3],
    }),
    defineDice({
        id: "sad-greaser-die",
        name: "悲伤格雷泽的骰子",
        desc: "属于一个外号叫“悲伤油腻鬼”的倒霉赌徒，他输光了一切后把这颗骰子留在了酒桌上。",
        note: "偏重1、2、5",
        weights: [26.1, 26.1, 4.4, 4.4, 26.1, 13],
    }),
    defineDice({
        id: "greasy-die",
        name: "油腻骰子",
        desc: "长期被没洗手的赌徒把玩，表面包了一层厚厚的油垢，滚动起来滑溜溜的。",
        note: "略微偏向6点和奇数",
        weights: [17.7, 11.8, 17.7, 11.8, 17.7, 23.5],
    }),
    defineDice({
        id: "grozav-lucky-die",
        name: "格罗扎夫的幸运骰子",
        desc: "雇佣兵格罗扎夫（Grozav）视若珍宝的幸运骰，虽然他坚信这玩意能让他发财，但它其实只会疯狂出2。",
        note: "极高概率出2点，单用易爆，需搭配多颗凑2点三连",
        weights: [6.7, 66.7, 6.7, 6.7, 6.7, 6.7],
    }),
    defineDice({
        id: "grimy-die",
        name: "坏骰子",
        desc: "脏兮兮、边角磨损严重的旧骰子，虽然很难掷出1，但出5的概率倒是出奇地高。",
        note: "出1极低，但5点出率极高，勉强可用",
        weights: [6.3, 31.3, 6.3, 6.3, 43.8, 6.3],
    }),
    defineDice({
        id: "lousy-gambler-die",
        name: "蹩脚骰子",
        desc: "某个输红了眼的蹩脚赌徒留下的粗制滥造作弊骰，手艺相当差劲。",
        note: "靠35%的5点保底",
        weights: [10, 15, 10, 15, 35, 15],
    }),
    defineDice({
        id: "unbalanced-die",
        name: "失衡骰子",
        desc: "切割时明显歪了一边的骰子，重心严重偏向1和2。",
        note: "偏向1和2",
        weights: [25, 33.3, 8.3, 8.3, 16.7, 8.3],
    }),
    defineDice({
        id: "king-die",
        name: "国王骰子",
        desc: "雕工考究、带着王冠图案的骰子，看起来很气派，但实际上很容易让你颗粒无收。",
        note: "偏向3和4，不易单颗计分",
        weights: [12.5, 18.8, 21.9, 25, 12.5, 9.4],
    }),
    defineDice({
        id: "mathematician-die",
        name: "数学家的骰子",
        desc: "一位学者试图通过精密几何计算打造出的“完美骰子”，结果反而把最值钱的5和6全算没了。",
        note: "极度偏向2、3、4，出5和6极低",
        weights: [16.7, 20.8, 25, 29.2, 4.2, 4.2],
    }),
    defineDice({
        id: "wagoner-die",
        name: "战车御者的骰子",
        desc: "车夫们在驿站休息时用来消遣的粗糙木骰，总是滚出2和3。",
        note: "几乎不出1，偏向2和3",
        weights: [5.6, 27.8, 33.3, 11.1, 11.1, 11.1],
    }),
    defineDice({
        id: "unlucky-die",
        name: "倒霉骰子",
        desc: "仿佛受到诅咒的骰子，只要把它放进骰盅，1和6就会神奇地消失。",
        note: "1和6概率极低，易爆骰",
        weights: [9.1, 27.3, 18.2, 18.2, 18.2, 9.1],
    }),
    defineDice({
        id: "painter-die",
        name: "画家骰子",
        series: "dlc",
        desc: "画家用剩下的颜料随意涂色的骰子，色彩斑斓，但运气实在不怎么样。",
        note: "红、绿、蓝款概率相同，与倒霉骰子完全一致",
        weights: [9.1, 27.3, 18.2, 18.2, 18.2, 9.1],
    }),
    defineDice({
        id: "misfortune-die",
        name: "厄运骰",
        desc: "极度不祥的骰子，几乎永远不会停在1或6上，拿它上桌无异于主动送钱。",
        note: "最坑骰子，1和6概率低至4.6%",
        weights: [4.6, 22.7, 22.7, 22.7, 22.7, 4.6],
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
