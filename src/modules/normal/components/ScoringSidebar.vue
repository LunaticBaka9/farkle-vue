<!-- 计分速查、Hot Dice 提示、首次收分门槛和格言。 -->
<script setup>
import { ref } from "vue";
import AppIcon from "../../../shared/components/AppIcon.vue";
import Die from "../../../shared/components/Die.vue";

// format 用于统一分数格式；entryScore 决定首次收分门槛提示文本。
defineProps({ format: Function, entryScore: Number });
defineEmits(["openRules"]);
// 手机端默认折叠组合明细，避免计分速查占满整个下半屏。
const expanded = ref(false);
</script>
<template>
    <aside class="score-sidebar" aria-label="计分与玩法提示">
        <section class="score-card" :class="{ expanded }">
            <div class="score-head">
                <h2 class="score-title"><AppIcon name="dice" :size="17" />计分速查</h2>
                <span class="score-badge">QUICK GUIDE</span>
                <button
                    type="button"
                    class="score-toggle"
                    :class="{ expanded }"
                    :aria-expanded="expanded"
                    aria-controls="score-extra"
                    @click="expanded = !expanded">
                    {{ expanded ? "收起" : "展开" }}
                    <AppIcon class="score-toggle-icon" name="chevron" :size="12" />
                </button>
            </div>
            <p class="score-desc">记住这些组合，让每一掷更有把握。</p>
            <div>
                <div class="score-pair-row">
                    <Die :value="1" decorative small /><span>单个 1</span
                    ><strong class="score-value score-value-large">100<small class="score-unit">分</small></strong>
                </div>
                <div class="score-pair-row">
                    <Die :value="5" decorative small /><span>单个 5</span>
                    <strong class="score-value score-value-large">50<small class="score-unit">分</small></strong>
                </div>
            </div>
            <div class="score-sep"></div>
            <div class="score-line">
                <span>三个 1</span><strong class="score-value">300<small class="score-unit">分</small></strong>
            </div>
            <div class="score-line"><span>三个 2 — 6</span><strong class="score-value">点数 × 100</strong></div>
            <div id="score-extra" class="score-extra">
                <div class="score-line">
                    <span>四 / 五 / 六同</span><strong class="score-value compact">1,000 / 2,000 / 3,000</strong>
                </div>
                <div class="score-sep"></div>
                <div class="score-line">
                    <span>1–6 顺子</span><strong class="score-value">1,500<small class="score-unit">分</small></strong>
                </div>
                <div class="score-line">
                    <span>三对<span class="score-hint">2 + 2 + 2</span></span
                    ><strong class="score-value">1,500<small class="score-unit">分</small></strong>
                </div>
                <div class="score-line">
                    <span>四同 + 一对</span
                    ><strong class="score-value">1,500<small class="score-unit">分</small></strong>
                </div>
                <div class="score-line">
                    <span>两组三同</span><strong class="score-value">2,500<small class="score-unit">分</small></strong>
                </div>
            </div>
            <button class="score-more" @click="$emit('openRules')">
                查看完整规则与示例<AppIcon name="diagonal" :size="15" />
            </button>
        </section>
        <section class="hot-card">
            <div class="hot-icon"><AppIcon name="flame" :size="25" /></div>
            <div>
                <span class="hot-eyebrow">WHEN THE DICE ARE HOT</span>
                <h3 class="hot-title">六骰全中，好运加码。</h3>
                <p class="hot-text">六颗骰子全部计分？保留累计得分，重新掷出全部六颗骰子。冒险继续。</p>
                <span class="hot-tag"><span class="hot-dot"></span> HOT DICE · 火热再掷</span>
            </div>
        </section>
        <div class="entry-note">
            <AppIcon class="entry-icon" name="shield" :size="16" />
            <p class="entry-text">
                <template v-if="entryScore > 0">
                    首次收分，至少累计
                    <strong class="entry-strong">{{ format(entryScore) }} 分 </strong
                    >。<br />之后每回合随时可以见好就收。
                </template>
                <template v-else>首次收分无最低门槛。<br />选择有效计分骰子即可落袋为安。</template>
            </p>
        </div>
    </aside>
</template>

<style scoped>
/* 侧栏：桌面端纵向排列，平板改为两列网格，窄屏再恢复单列。 */
.score-sidebar {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

/* 平板侧栏：两列网格，速查卡占左列三行。 */
@media (max-width: 1000px) {
    .score-sidebar {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: auto 1fr;
        gap: 20px;
        margin-top: 12px;
    }
}

/* 窄屏侧栏：恢复单列并收紧间距。 */
@media (max-width: 520px) {
    .score-sidebar {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 9px;
    }
}

/* 计分速查卡：深绿渐变底与细描边，内部隐藏溢出以容纳出血按钮。 */
.score-card {
    overflow: hidden;
    padding: 23px 22px 0;
    border: 1px solid #d5e4bf17;
    border-radius: 10px;
    background: linear-gradient(120deg, #202a21, #1a231d);
}

/* 平板速查卡：跨越左侧三行。 */
@media (max-width: 1000px) {
    .score-card {
        grid-row: span 3;
    }
}

/* 中屏速查卡：收紧左右内边距。 */
@media (max-width: 1180px) {
    .score-card {
        padding-right: 19px;
        padding-left: 19px;
    }
}

/* 窄屏速查卡：恢复较宽的左右内边距并略减上内边距。 */
@media (max-width: 520px) {
    .score-card {
        padding: 22px 21px 0;
    }
}

/* 速查卡标题行：标题与“QUICK GUIDE”徽标两端对齐。 */
.score-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

/* 速查卡标题：图标与文字横向排列。 */
.score-title {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: clamp(14px, 1.15vw, 16px);
    font-weight: 500;
}

/* 手机端速查卡标题：固定 14px。 */
@media (max-width: 700px) {
    .score-title {
        font-size: 14px;
    }
}

/* 窄屏速查卡标题：收紧图标间距。 */
@media (max-width: 520px) {
    .score-title {
        gap: 8px;
    }
}

/* “QUICK GUIDE”徽标：小型描边标签。 */
.score-badge {
    padding: 4px 5px;
    border: 1px solid #b5d28720;
    border-radius: 3px;
    background: #b1ce8608;
    color: #a4bb89;
    font-size: 6px;
    letter-spacing: 1px;
}

/* 组合明细容器：桌面端直接铺开，手机端可折叠。 */
.score-extra {
    display: contents;
}

/* 手机端展开按钮：默认隐藏，窄屏显示在卡片标题右侧。 */
.score-toggle {
    display: none;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border: 1px solid #c5e9952c;
    border-radius: 9999px;
    background: #c5e99508;
    color: #b5cd98;
    font-size: 11px;
    white-space: nowrap;
}

/* 展开按钮悬停：底色与文字提亮。 */
.score-toggle:hover {
    border-color: #c5e99555;
    background: #c5e99510;
    color: #d8edbd;
}

/* 展开按钮箭头：展开时向下旋转。 */
.score-toggle-icon {
    transition: transform 0.2s;
}

/* 展开状态下的箭头。 */
.score-toggle.expanded .score-toggle-icon {
    transform: rotate(90deg);
}

/* 手机端：隐藏装饰徽标，显示折叠按钮。 */
@media (max-width: 700px) {
    .score-badge {
        display: none;
    }

    .score-toggle {
        display: inline-flex;
    }

    .score-extra {
        display: none;
    }

    .score-card.expanded .score-extra {
        display: flex;
        flex-direction: column;
    }
}

/* 速查卡说明：标题下方的一行提示。 */
.score-desc {
    margin: 13px 0 17px;
    color: #819178;
    font-size: clamp(11px, 0.95vw, 12px);
    line-height: 1.7;
}

/* 手机端速查说明：固定 12px。 */
@media (max-width: 700px) {
    .score-desc {
        font-size: 12px;
    }
}

/* 窄屏速查说明：收紧下边距。 */
@media (max-width: 520px) {
    .score-desc {
        margin-bottom: 15px;
    }
}

/* 单个 1 / 单个 5 行：迷你骰、说明与分数横向排列。 */
.score-pair-row {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 0;
    color: #c4cdbb;
    font-size: clamp(12px, 1vw, 13px);
}

/* 手机端单骰行：固定 12px。 */
@media (max-width: 700px) {
    .score-pair-row {
        font-size: 12px;
    }
}

/* 窄屏单骰行：略增上下内边距。 */
@media (max-width: 520px) {
    .score-pair-row {
        padding: 10px 0;
    }
}

/* 普通计分行：说明与分数两端对齐，保证行高一致。 */
.score-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 35px;
    color: #b7c3ac;
    font-size: clamp(12px, 1vw, 13px);
}

/* 手机端计分行：固定 12px。 */
@media (max-width: 700px) {
    .score-line {
        font-size: 12px;
    }
}

/* 窄屏计分行：略增最小高度，方便触控阅读。 */
@media (max-width: 520px) {
    .score-line {
        min-height: 36px;
    }
}

/* 分隔线：在速查组合之间划分区块。 */
.score-sep {
    height: 1px;
    margin: 13px 0 9px;
    background: #cbdcaa14;
}

/* 计分分数：等宽数字，默认右对齐。 */
.score-value {
    color: #d2dfc4;
    font-family: var(--font-numeric);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
}

/* 单个 1/5 的大号分数：推到行尾并放大。 */
.score-value-large {
    margin-left: auto;
    color: #dfebd1;
    font-size: clamp(14px, 1.2vw, 16px);
}

/* 手机端大号分数：固定 14px。 */
@media (max-width: 700px) {
    .score-value-large {
        font-size: 14px;
    }
}

/* 四/五/六同的紧凑数字：中屏缩小避免换行。 */
.score-value.compact {
    font-size: 10px;
}

/* 中屏紧凑数字：再缩小一号。 */
@media (max-width: 1180px) {
    .score-value.compact {
        font-size: 9px;
    }
}

/* 平板紧凑数字：恢复 11px。 */
@media (max-width: 1000px) {
    .score-value.compact {
        font-size: 11px;
    }
}

/* 分数单位“分”：更小、更淡。 */
.score-unit {
    margin-left: 5px;
    color: #849574;
    font-size: clamp(10px, 0.85vw, 11px);
    font-weight: 400;
}

/* 手机端分数单位：固定 11px。 */
@media (max-width: 700px) {
    .score-unit {
        font-size: 11px;
    }
}

/* 三对后面的“2 + 2 + 2”提示。 */
.score-hint {
    margin-left: 6px;
    color: #849574;
    font-family: var(--font-numeric);
    font-size: clamp(10px, 0.85vw, 11px);
}

/* 手机端隐藏三对提示，避免行内拥挤。 */
@media (max-width: 700px) {
    .score-hint {
        display: none;
    }
}

/* 窄屏重新显示三对提示并固定 11px。 */
@media (max-width: 520px) {
    .score-hint {
        display: inline;
        font-size: 11px;
    }
}

/* 查看完整规则按钮：向两侧出血，填满卡片底边。 */
.score-more {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% + 44px);
    margin: 21px -22px 0;
    padding: 16px 22px;
    border: 0;
    border-top: 1px solid #cbdcaa14;
    background: #c5e99503;
    color: #b5cd98;
    font-size: clamp(10px, 0.85vw, 11px);
}

/* 查看规则按钮悬停：底色与文字一起提亮。 */
.score-more:hover {
    background: #c5e9950a;
    color: #d8edbd;
}

/* 中屏查看规则按钮：跟随卡片内边距收窄出血量。 */
@media (max-width: 1180px) {
    .score-more {
        width: calc(100% + 38px);
        margin-right: -19px;
        margin-left: -19px;
        padding-right: 19px;
        padding-left: 19px;
    }
}

/* 手机端查看规则按钮：固定 11px。 */
@media (max-width: 700px) {
    .score-more {
        font-size: 11px;
    }
}

/* 窄屏查看规则按钮：恢复 21px 出血与内边距。 */
@media (max-width: 520px) {
    .score-more {
        width: calc(100% + 42px);
        margin-right: -21px;
        margin-left: -21px;
        padding-right: 21px;
        padding-left: 21px;
    }
}

/* Hot Dice 提示卡：暖绿色渐变底与浅色描边。 */
.hot-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 21px 19px;
    border: 1px solid #b6b87c39;
    border-radius: 10px;
    background: linear-gradient(110deg, #30352280, #262f2080);
}

/* 平板 Hot Dice 卡：与网格顶部对齐。 */
@media (max-width: 1000px) {
    .hot-card {
        align-self: start;
    }
}

/* 手机端 Hot Dice 卡：收紧间距与内边距。 */
@media (max-width: 700px) {
    .hot-card {
        gap: 9px;
        padding: 20px 15px;
    }
}

/* 窄屏 Hot Dice 卡：占满宽度并恢复较宽内边距。 */
@media (max-width: 520px) {
    .hot-card {
        width: 100%;
        gap: 13px;
        padding: 21px;
    }
}

/* 火焰图标容器：轻微下移以对齐标题。 */
.hot-icon {
    padding-top: 3px;
    color: #d4d394;
}

/* 手机端火焰图标：仅缩小宽度，保留火焰原高度。 */
@media (max-width: 700px) {
    .hot-icon svg {
        width: 20px;
    }
}

/* 窄屏火焰图标：仅调整宽度，保留火焰原高度。 */
@media (max-width: 520px) {
    .hot-icon svg {
        width: 25px;
    }
}

/* Hot Dice 英文眉题：小号宽字距。 */
.hot-eyebrow {
    color: #afba81;
    font-size: clamp(8px, 0.7vw, 9px);
    letter-spacing: 1.4px;
}

/* 手机端眉题：固定 9px 并收紧字距。 */
@media (max-width: 700px) {
    .hot-eyebrow {
        font-size: 9px;
        letter-spacing: 0.6px;
    }
}

/* 窄屏眉题：恢复 1.2px 字距。 */
@media (max-width: 520px) {
    .hot-eyebrow {
        letter-spacing: 1.2px;
    }
}

/* Hot Dice 标题。 */
.hot-title {
    margin: 9px 0 10px;
    color: #dce3c1;
    font-size: clamp(14px, 1.15vw, 16px);
    font-weight: 500;
}

/* 手机端 Hot Dice 标题：缩紧上下边距并固定 14px。 */
@media (max-width: 700px) {
    .hot-title {
        margin: 10px 0;
        font-size: 14px;
    }
}

/* Hot Dice 正文：较大的行高提升可读性。 */
.hot-text {
    color: #9ca98a;
    font-size: clamp(11px, 0.95vw, 12px);
    line-height: 1.95;
}

/* 手机端 Hot Dice 正文：固定 12px。 */
@media (max-width: 700px) {
    .hot-text {
        font-size: 12px;
    }
}

/* Hot Dice 标签：前方带绿色圆点。 */
.hot-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    color: #b5c793;
    font-size: clamp(9px, 0.75vw, 10px);
    letter-spacing: 0.3px;
}

/* 手机端 Hot Dice 标签：固定 9px。 */
@media (max-width: 700px) {
    .hot-tag {
        font-size: 9px;
    }
}

/* Hot Dice 圆点：品牌绿并带光晕。 */
.hot-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-lime);
    box-shadow: 0 0 9px #c5e99520;
}

/* 首次收分提示：盾牌图标与说明文字横向排列。 */
.entry-note {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-top: 1px;
    padding: 0 9px;
    color: #7f9271;
}

/* 平板收分提示：与网格顶部对齐。 */
@media (max-width: 1000px) {
    .entry-note {
        align-self: start;
    }
}

/* 窄屏收分提示：去掉上边距并留出下边距。 */
@media (max-width: 520px) {
    .entry-note {
        margin-top: 0;
        margin-bottom: 8px;
    }
}

/* 盾牌图标：与正文首行对齐。 */
.entry-icon {
    margin-top: 3px;
}

/* 收分提示正文：宽松行高。 */
.entry-text {
    font-size: clamp(11px, 0.95vw, 12px);
    line-height: 1.9;
}

/* 手机端收分提示正文：固定 12px。 */
@media (max-width: 700px) {
    .entry-text {
        font-size: 12px;
    }
}

/* 门槛分数强调：略亮的绿色。 */
.entry-strong {
    color: #acbd94;
    font-weight: 500;
}
</style>
