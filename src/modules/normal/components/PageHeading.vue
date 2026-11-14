<!-- 页面主标题、产品标语和当前获胜目标展示。 -->
<script setup>
import AppIcon from "../../../shared/components/AppIcon.vue";
// targetScore 展示当前获胜目标；format 提供统一的分数数字格式化函数。
defineProps({ targetScore: Number, format: Function });
</script>
<template>
    <section class="page-heading">
        <div>
            <div class="eyebrow">
                <span class="eyebrow-dot"></span>
                ROLL THE DICE. OWN THE MOMENT.
            </div>
            <h1 class="headline">再掷一次，<span class="headline-muted">好运在手。</span></h1>
            <!-- 副标题使用响应式字号，避免大屏字体过小或窄屏文字拥挤。 -->
            <p class="subtitle">是落袋为安，还是放手一搏？让每一次选择，都值得心跳。</p>
        </div>
        <div class="target-card">
            <span class="target-icon"><AppIcon name="trophy" :size="24" /></span>
            <div>
                <small class="target-label">本局目标</small>
                <strong class="target-value">{{ format(targetScore) }}<span class="target-unit">分</span></strong>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* 标题区：横跨主网格整行，左侧文案、右侧目标卡片。 */
.page-heading {
    display: flex;
    grid-column: 1 / -1;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 0;
}

/* 手机端标题区：与下方内容留出间距。 */
@media (max-width: 700px) {
    .page-heading {
        margin-bottom: 28px;
    }
}

/* 窄屏标题区：改为顶部对齐并收紧间距。 */
@media (max-width: 520px) {
    .page-heading {
        align-items: flex-start;
        gap: 12px;
    }
}

/* 英文眉题：小字号宽字距，前方带一个绿色光点。 */
.eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #acbf97;
    font-size: clamp(8px, 0.7vw, 9px);
    font-weight: 600;
    letter-spacing: 2px;
}

/* 手机端眉题：固定 8px。 */
@media (max-width: 700px) {
    .eyebrow {
        font-size: 8px;
    }
}

/* 窄屏眉题：收紧光点间距与字距。 */
@media (max-width: 520px) {
    .eyebrow {
        gap: 6px;
        letter-spacing: 1.4px;
    }
}

/* 眉题前的光点：品牌绿并带柔和光晕。 */
.eyebrow-dot {
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
    .eyebrow-dot {
        width: 4px;
        height: 4px;
    }
}

/* 主标题：大号半粗体，紧凑字距提升标题密度。 */
.headline {
    margin: 10px 0 7px;
    font-size: clamp(27px, 2.65vw, 38px);
    font-weight: 650;
    line-height: 1.5;
    letter-spacing: -0.9px;
}

/* 手机端主标题：略减字号。 */
@media (max-width: 700px) {
    .headline {
        font-size: 30px;
    }
}

/* 窄屏主标题：缩小并强制单行，避免断成三行。 */
@media (max-width: 520px) {
    .headline {
        margin-top: 12px;
        font-size: 26px;
        letter-spacing: -0.7px;
        white-space: nowrap;
    }
}

/* 极窄屏主标题：允许换行并再减字号。 */
@media (max-width: 374px) {
    .headline {
        font-size: 24px;
        white-space: normal;
    }
}

/* 主标题后半句：降低对比度，形成层次。 */
.headline-muted {
    color: #c6d1be;
}

/* 副标题：宽松行高，读起来更轻松。 */
.subtitle {
    color: #839180;
    font-size: clamp(14px, 1vw, 16px);
    line-height: 1.8;
    letter-spacing: 0.2px;
}

/* 手机端副标题：缩小字号。 */
@media (max-width: 700px) {
    .subtitle {
        font-size: clamp(12px, 1.8vw, 14px);
    }
}

/* 窄屏副标题：限制宽度并固定 12px。 */
@media (max-width: 520px) {
    .subtitle {
        max-width: 235px;
        font-size: 12px;
        line-height: 1.7;
    }
}

/* 极窄屏副标题：占满可用宽度。 */
@media (max-width: 374px) {
    .subtitle {
        max-width: 100%;
    }
}

/* 目标分数卡片：浅色描边和内底，与标题形成信息层级。 */
.target-card {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 13px 19px;
    border: 1px solid #afbe9c24;
    border-radius: 10px;
    background: #bbc79d05;
}

/* 手机端目标卡片：收紧间距与内边距。 */
@media (max-width: 700px) {
    .target-card {
        gap: 9px;
        padding: 12px;
    }
}

/* 窄屏隐藏目标卡片：目标分数已在记分板显示，避免标题区横向溢出。 */
@media (max-width: 520px) {
    .target-card {
        display: none;
    }
}

/* 目标图标：奖杯使用浅黄绿色。 */
.target-icon {
    display: flex;
    align-items: center;
    color: #b9d193;
}

/* 手机端目标图标：仅缩小宽度，保留奖杯原高度。 */
@media (max-width: 700px) {
    .target-icon svg {
        width: 20px;
    }
}

/* “本局目标”标签：小号宽字距。 */
.target-label {
    display: block;
    margin-bottom: 3px;
    color: #82917c;
    font-size: clamp(10px, 0.9vw, 11px);
    letter-spacing: 0.8px;
}

/* 目标分数：等宽数字，突出数值。 */
.target-value {
    font-family: var(--font-numeric);
    font-size: 23px;
    letter-spacing: 0.6px;
}

/* 手机端目标分数：略减字号。 */
@media (max-width: 700px) {
    .target-value {
        font-size: 20px;
    }
}

/* 目标分数单位“分”：更小、更灰。 */
.target-unit {
    margin-left: 7px;
    color: #82917b;
    font-size: 9px;
    font-weight: 400;
}


</style>
