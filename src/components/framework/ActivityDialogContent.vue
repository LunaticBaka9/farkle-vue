<script setup>
import AppIcon from "./AppIcon.vue";

// GameDialogs 在 activity 状态下挂载此只读视图；game/history 来自 Pinia store。
defineProps({ game: Object, format: Function, theme: String });
const emit = defineEmits(["close"]);
</script>

<template>
    <section class="activity-dialog">
        <div class="dlg-eyebrow">THE COMPLETE STORY</div>
        <h2 id="activity-title" class="dlg-h2 activity-heading">本局动态详情</h2>
        <p class="dlg-lede">按时间顺序回顾当前对局的全部收分与 Farkle 动态。</p>
        <ol v-if="game.history.length" class="activity-list">
            <li v-for="event in game.history" :key="event.id" class="activity-item">
                <span class="activity-status" :class="event.type === 'bank' ? 'bank' : 'farkle'">
                    <AppIcon :name="event.type === 'bank' ? 'check' : 'close'" :size="12" />
                </span>
                <div class="activity-body">
                    <strong class="activity-name">{{ event.name }}</strong>
                    <span class="activity-event">{{ event.type === "bank" ? "落袋为安" : "遭遇 Farkle" }}</span>
                    <small class="activity-turn">第 {{ Math.ceil(event.turn / 2) }} 轮</small>
                    <small v-if="event.final" class="dlg-final-tag activity-final">触发最终回合</small>
                </div>
                <b class="activity-points">
                    {{
                        event.type === "bank"
                            ? "+" + format(event.points)
                            : event.points
                              ? "失去 " + format(event.points)
                              : "本回合归零"
                    }}
                    <small v-if="event.type === 'bank'">分</small>
                </b>
            </li>
        </ol>
        <div v-else class="activity-empty">
            <AppIcon name="history" :size="28" />
            <p>当前对局还没有收分或 Farkle 动态。</p>
        </div>
        <button class="dlg-btn primary activity-close" @click="emit('close')">
            返回对局<AppIcon name="arrow" :size="17" />
        </button>
    </section>
</template>

<style scoped>
/* 动态详情容器：限制正文宽度并留出弹窗内边距。 */
.activity-dialog {
    max-width: 620px;
    padding: 44px 48px 38px;
}

/* 手机端：压缩四周留白，给事件列表更多横向空间。 */
@media (max-width: 700px) {
    .activity-dialog {
        padding: 38px 22px 24px;
    }
}

/* 标题与眉题之间的间距。 */
.activity-heading {
    margin-top: 8px;
}

/* 事件列表：纵向排列，每条之间留 10px。 */
.activity-list {
    display: grid;
    gap: 10px;
    margin: 24px 0;
    padding: 0;
}

/* 单条事件：图标、文字与分数横向排列，底部用细线分隔。 */
.activity-item {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 58px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--color-line);
}

/* 手机端事件：允许换行，并把内容对齐到顶部。 */
@media (max-width: 700px) {
    .activity-item {
        flex-wrap: wrap;
        align-items: flex-start;
    }
}

/* 事件状态圆点：收分与爆骰共用尺寸。 */
.activity-status {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
}

/* 收分事件：浅绿底与浅绿图标。 */
.activity-status.bank {
    background: #c5e99510;
    color: #bdda96;
}

/* 爆骰事件：浅橙底与暖橙图标。 */
.activity-status.farkle {
    background: #c0947315;
    color: #d4a783;
}

/* 事件正文：占据剩余宽度，方便长名字换行。 */
.activity-body {
    flex: 1;
    min-width: 0;
}

/* 玩家名：与后续事件说明保持 7px 间距。 */
.activity-name {
    margin-right: 7px;
    color: #d4dfca;
}

/* 事件说明：收分或 Farkle 的中文描述。 */
.activity-event {
    color: #93a28a;
    font-size: clamp(12px, 1vw, 13px);
}

/* 手机端事件说明：另起一行并略增字号。 */
@media (max-width: 700px) {
    .activity-event {
        display: block;
        margin-top: 4px;
        font-size: 13px;
    }
}

/* 轮次信息：比说明更小、更灰。 */
.activity-turn {
    display: inline-block;
    margin-left: 8px;
    color: #75846e;
    font-size: clamp(10px, 0.85vw, 11px);
}

/* 手机端轮次：另起一行，去掉左边距。 */
@media (max-width: 700px) {
    .activity-turn {
        display: block;
        margin-top: 4px;
        margin-left: 0;
        font-size: 11px;
    }
}

/* 最终回合标签在手机端改为独占一行。 */
@media (max-width: 700px) {
    .activity-final {
        display: block;
        margin-top: 4px;
        margin-left: 0;
        font-size: 11px;
    }
}

/* 事件分数：右对齐并禁止换行。 */
.activity-points {
    margin-left: auto;
    white-space: nowrap;
}

/* 手机端事件分数：与左侧图标错开对齐。 */
@media (max-width: 700px) {
    .activity-points {
        margin-top: 4px;
        margin-left: 28px;
    }
}

/* 空状态：虚线框内居中显示图标与提示。 */
.activity-empty {
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 12px;
    min-height: 180px;
    margin: 24px 0;
    border: 1px dashed var(--color-line);
    border-radius: 12px;
    color: #75846e;
}

/* 底部返回按钮：占满宽度并居中内容。 */
.activity-close {
    justify-content: center;
    width: 100%;
    margin-top: 25px;
}

/* 返回按钮尾部图标：推到最右侧。 */
.activity-close > svg:last-child {
    margin-left: auto;
}
</style>
