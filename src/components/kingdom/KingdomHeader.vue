<script setup>
// 天国页面标题、当前金币、背包入口和骰子收藏入口。
import AppIcon from "../framework/AppIcon.vue";

defineProps({
    coins: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(["openBackpack", "openDiceList", "resetPlayerState"]);
</script>

<template>
    <header class="kingdom-header">
        <div class="kingdom-intro">
            <span class="kingdom-eyebrow">
                <span class="kingdom-dot"></span>
                KINGDOM DICE
            </span>
            <h1 class="kingdom-title">天国骰子</h1>
            <p class="kingdom-subtitle">使用来自中世纪的奇妙骰子来和人对决吧</p>
        </div>

        <div class="kingdom-tools" aria-label="天国模式功能">
            <div class="coin-bar">
                <span class="coin-emblem">◎</span>
                <span class="coin-label">COINS</span>
                <strong class="coin-value">{{ coins.toLocaleString("zh-CN") }}</strong>
                <button
                    type="button"
                    class="coin-reset"
                    aria-label="重置天国玩家状态"
                    title="重置天国玩家状态"
                    @click="emit('resetPlayerState')">
                    <AppIcon name="restart" :size="14" />
                </button>
            </div>
            <div class="kingdom-actions">
                <button type="button" class="kingdom-action" @click="emit('openBackpack')">
                    <span class="kingdom-action-text">背包</span>
                </button>
                <button type="button" class="kingdom-action" @click="emit('openDiceList')">
                    <span class="kingdom-action-text">骰子列表</span>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* 天国页头：为右侧悬浮工具区预留空间。 */
.kingdom-header {
    position: relative;
}

/* 标题文案区：桌面端右侧留出工具区宽度。 */
.kingdom-intro {
    padding-right: 352px;
}

/* 中屏标题区：略收预留宽度。 */
@media (max-width: 1180px) {
    .kingdom-intro {
        padding-right: 330px;
    }
}

/* 平板标题区：工具区改为文档流，取消右侧预留。 */
@media (max-width: 1000px) {
    .kingdom-intro {
        padding-right: 0;
    }
}

/* 天国眉题：绿色光点加金色氛围小字。 */
.kingdom-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #acbf97;
    font-size: clamp(8px, 0.7vw, 9px);
    font-weight: 600;
    letter-spacing: 2px;
}

/* 手机端天国眉题：固定 8px。 */
@media (max-width: 700px) {
    .kingdom-eyebrow {
        font-size: 8px;
    }
}

/* 窄屏天国眉题：收紧间距与字距。 */
@media (max-width: 520px) {
    .kingdom-eyebrow {
        gap: 6px;
        letter-spacing: 1.4px;
    }
}

/* 眉题前的光点：品牌绿并带光晕。 */
.kingdom-dot {
    display: inline-block;
    flex-shrink: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-lime);
    box-shadow: 0 0 9px #c5e99520;
}

/* 窄屏光点：缩小到 4px。 */
@media (max-width: 520px) {
    .kingdom-dot {
        width: 4px;
        height: 4px;
    }
}

/* 天国主标题：大号半粗体与紧凑字距。 */
.kingdom-title {
    margin-bottom: 7px;
    font-size: clamp(27px, 2.65vw, 38px);
    font-weight: 650;
    letter-spacing: -0.9px;
    line-height: 1.5;
}

/* 手机端天国标题：略减字号。 */
@media (max-width: 700px) {
    .kingdom-title {
        font-size: 30px;
    }
}

/* 窄屏天国标题：缩小并强制单行。 */
@media (max-width: 520px) {
    .kingdom-title {
        margin-top: 12px;
        font-size: 26px;
        letter-spacing: -0.7px;
        white-space: nowrap;
    }
}

/* 极窄屏天国标题：允许换行并再减字号。 */
@media (max-width: 374px) {
    .kingdom-title {
        font-size: 24px;
        white-space: normal;
    }
}

/* 天国副标题：宽松行高，保持与其他模式一致。 */
.kingdom-subtitle {
    color: #839180;
    font-size: clamp(14px, 1vw, 16px);
    letter-spacing: 0.2px;
    line-height: 1.8;
}

/* 手机端天国副标题：缩小字号。 */
@media (max-width: 700px) {
    .kingdom-subtitle {
        font-size: clamp(12px, 1.8vw, 14px);
    }
}

/* 窄屏天国副标题：限制宽度并固定 12px。 */
@media (max-width: 520px) {
    .kingdom-subtitle {
        max-width: 235px;
        font-size: 12px;
        line-height: 1.7;
    }
}

/* 极窄屏天国副标题：占满可用宽度。 */
@media (max-width: 374px) {
    .kingdom-subtitle {
        max-width: 100%;
    }
}

/* 天国工具区：桌面端悬浮在页头右上角。 */
.kingdom-tools {
    position: absolute;
    top: -12px;
    right: 0;
    display: flex;
    align-items: flex-start;
    gap: 32px;
}

/* 平板工具区：回到文档流并改为纵向排列，保留 32px 间距。 */
@media (max-width: 1000px) {
    .kingdom-tools {
        position: static;
        flex-direction: column;
        align-items: stretch;
        margin-top: 20px;
    }
}

/* 金币条：暗金渐变底与内高光。 */
.coin-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 9px;
    height: 42px;
    padding: 0 16px;
    border: 1px solid #b99b6138;
    border-radius: 8px;
    background: linear-gradient(90deg, #15130e99, #3a301b99);
    box-shadow:
        inset 0 1px 0 #d8c9901a,
        0 5px 14px #0004;
}

/* 平板金币条：全宽并让标签与数值分列两端。 */
@media (max-width: 1000px) {
    .coin-bar {
        order: -1;
        justify-content: space-between;
        width: 100%;
        height: 42px;
        align-self: stretch;
    }
}

/* 金币图标：金色圆形徽标。 */
.coin-emblem {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border: 1px solid #dbc886;
    border-radius: 50%;
    background: linear-gradient(145deg, #f0d98f, #9f8142);
    color: #4a3b1b;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 0 12px #d7bd6240;
}

/* “COINS”标签：小号宽字距。 */
.coin-label {
    color: #9d9273;
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 2px;
}

/* 平板金币标签：把后面的数值与重置按钮推到右侧。 */
@media (max-width: 1000px) {
    .coin-label {
        margin-right: auto;
    }
}

/* 金币数值：等宽数字并使用浅金色。 */
.coin-value {
    color: #eedb9a;
    font-family: var(--font-numeric);
    font-size: 18px;
}

/* 金币重置按钮：小型暗金按钮。 */
.coin-reset {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 1px solid #b99b6155;
    border-radius: 5px;
    background: #211c12;
    color: #cdbb88;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
}

/* 重置按钮悬停：边框、底色与图标一起提亮。 */
.coin-reset:hover {
    border-color: #eadcaa;
    background: #302817;
    color: #f0e5bf;
}

/* 天国功能按钮组：桌面端横向排列。 */
.kingdom-actions {
    display: flex;
    align-items: center;
    gap: 32px;
}

/* 平板功能按钮组：改为等宽双列。 */
@media (max-width: 1000px) {
    .kingdom-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        width: 100%;
    }
}

/* 窄屏功能按钮组：收紧列间距。 */
@media (max-width: 520px) {
    .kingdom-actions {
        gap: 6px;
    }
}

/* 天国功能按钮：暗金雕花边框与多层内外阴影。 */
.kingdom-action {
    position: relative;
    min-width: 158px;
    min-height: 42px;
    padding: 9px 22px;
    overflow: hidden;
    border: 1px solid #d1c49f;
    background: linear-gradient(145deg, #2a2517 0%, #16140f 52%, #302916 100%);
    color: #f5edd8;
    font-size: 15px;
    line-height: 1;
    box-shadow:
        inset 0 1px 0 #fff7c44d,
        inset 0 -4px 8px #080702b3,
        inset 0 0 18px #b99b6110,
        0 6px 16px #05050580,
        0 0 0 3px #c2b27d12;
    transition-property: transform, background, border-color, box-shadow;
    transition-duration: 0.2s;
}

/* 按钮内圈雕花细线。 */
.kingdom-action::before {
    position: absolute;
    inset: 5px;
    border: 1px solid #d6c79255;
    content: "";
}

/* 按钮表面的斜向高光层。 */
.kingdom-action::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(115deg, #ffffff0a 0%, transparent 35%, #d7c69009 62%, transparent 100%);
    content: "";
    pointer-events: none;
}

/* 天国功能按钮悬停：上浮 2px 并提亮金属质感。 */
.kingdom-action:hover {
    border-color: #eadcaa;
    background: linear-gradient(145deg, #39311d, #181610 52%, #40351f);
    box-shadow:
        inset 0 1px 0 #fff7c466,
        inset 0 -4px 8px #08070299,
        inset 0 0 22px #b99b6120,
        0 9px 22px #05050599,
        0 0 0 3px #c2b27d20;
    transform: translateY(-2px);
}

/* 天国功能按钮按下：回落 1px 并压暗阴影。 */
.kingdom-action:active {
    box-shadow:
        inset 0 2px 10px #05040299,
        0 3px 8px #05050580;
    transform: translateY(1px);
}

/* 平板天国按钮：取消固定最小宽度，增加上下内边距。 */
@media (max-width: 1000px) {
    .kingdom-action {
        min-width: 0;
        padding: 14px 12px;
        font-size: 16px;
    }
}

/* 窄屏天国按钮：保证 52px 高度并收紧左右内边距。 */
@media (max-width: 520px) {
    .kingdom-action {
        min-height: 52px;
        padding: 8px;
        font-size: 15px;
    }
}

/* 按钮文字：抬到高光层之上，并加一层柔和描边阴影。 */
.kingdom-action-text {
    position: relative;
    z-index: 10;
    text-shadow:
        0 2px 2px #000,
        0 0 12px #d5b97833;
}
</style>
