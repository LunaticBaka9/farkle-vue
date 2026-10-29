<!-- 统一 SVG 图标的路径映射与尺寸输出。 -->
<script setup>
// Props：name 决定显示哪个图标，size 控制 SVG 的宽高；默认值保证单独使用时仍能渲染。
defineProps({ name: { type: String, default: "dice" }, size: { type: [Number, String], default: 20 } });
// 集中维护图标路径，让界面只需传递语义化名称。
// 集中维护图标名称与 SVG 路径的映射；模板只需传入语义化 name。
// 所有路径均基于 24 × 24 的 viewBox 编写，便于统一缩放和描边。
const paths = {
    // map：折叠地图轮廓与路线标记，用于冒险模式入口和地图框架。
    map: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6m6-3v15m6-12v15m-1-11 2-2 2 2-2 3-2-3",

    // dice：方形骰子轮廓及角落、中心五点，用于品牌和掷骰动作。
    dice: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2M7 7h.01M17 7h.01M12 12h.01M7 17h.01M17 17h.01",

    // arrow：向右的直线箭头，用于按钮继续、下一步等操作。
    arrow: "M5 12h14m-6-6 6 6-6 6",

    // diagonal：左下指向右上的箭线与方框，用于外部规则链接。
    diagonal: "M6 18 18 6M6 6h12v12",

    // user：单个用户轮廓，用于本地模式玩家头像。
    user: "M20 21v-2a7 7 0 0 0-14 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",

    // users：两个用户轮廓，用于本地双人模式入口。
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-7a4 4 0 0 1 0 8m5 9v-2a4 4 0 0 0-3-3.87",

    // bot：带天线、眼睛和嘴部的机器人轮廓，用于 AI 对手。
    bot: "M12 3v3m-2-3h4M6 7h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3M7 12h.01M17 12h.01m-8 4h6M1 12v3m22-3v3",

    // restart：顺时针回复箭头，用于新对局或重新开始按钮。
    restart: "M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6",

    // book：翻开的书本轮廓，用于玩法规则入口。
    book: "M12 5C8 2 4 3 2 4v16c3-2 6-2 10 0 4-2 7-2 10 0V4c-3-2-6-2-10 1m0 0v15",

    // sound：喇叭与递增声波，表示音效已开启。
    sound: "M11 5 6 9H3v6h3l5 4V5m5 3a6 6 0 0 1 0 8m4-11a10 10 0 0 1 0 14",

    // mute：喇叭加斜线，表示音效已关闭。
    mute: "M11 5 6 9H3v6h3l5 4V5m5 4 6 6m0-6-6 6",

    // trophy：奖杯、把手和底座，用于目标分数或获胜结果。
    trophy: "M8 3h8v6a4 4 0 0 1-8 0V3m0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 1v5m-4 3h8m-6-3h4v3",

    // spark：星形闪光，用于智能推荐或特殊提示。
    spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3",

    // check：打勾线条，用于成功提示、落袋收分和确认状态。
    check: "m5 12 4 4L19 6",

    // close：两条交叉线，用于关闭弹窗或取消操作。
    close: "m6 6 12 12M6 18 18 6",

    // bank：银行建筑轮廓，表示收分并结束回合。
    bank: "M3 10h18L12 3 3 10m2 3v6m7-6v6m7-6v6M3 22h18",

    // history：时钟与历史箭头，用于对局动态记录区域。
    history: "M4 6v5h5m-5-1a9 9 0 1 1 1 8m7-12v6l4 2",

    // shield：盾牌轮廓与勾选标记，表示保护、规则门槛或安全提示。
    shield: "M12 3 3 7v6c0 5 9 9 9 9s9-4 9-9V7l-9-4m-4 9 3 3 5-5",

    // flame：火焰轮廓，用于 Hot Dice 连续得分状态。
    flame: "M12 3c1 6 7 7 7 12a7 7 0 1 1-14 0c0-3 2-5 4-7 0 3 2 3 3 4 2-3 0-6 0-9m0 12c-2 1-3 2-3 4a3 3 0 0 0 6 0c0-2-2-3-3-4",

    // info：圆圈内的字母 i，用于说明文字和操作提示。
    info: "M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",

    // chevron：向右尖括号，用于折叠项、下一步或导航标记。
    chevron: "m9 5 7 7-7 7",
};
</script>
<template>
    <!-- SVG viewBox 固定为 24 × 24，使任意图标都能按 size 等比缩放。 -->
    <!-- 未知名称回退到骰子图标，确保图标组件始终有可渲染路径。 -->
    <svg
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        :stroke-width="name === 'dice' ? 2.2 : 1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
    >
        <path :d="paths[name] || paths.dice" />
    </svg>
</template>
