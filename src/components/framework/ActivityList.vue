<!-- 展示最近收分和 Farkle 事件的对局动态列表。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
// history 为按时间倒序保存的对局动态；format 用于统一格式化分数。
defineProps({ history: Array, format: Function });
defineEmits(["openDetails"]);
</script>
<template>
    <section class="activity" aria-label="对局记录">
        <div class="activity-head">
            <h2 class="activity-title"><AppIcon class="activity-icon" name="history" :size="17" />对局动态</h2>
            <button class="activity-details" type="button" @click="$emit('openDetails')">
                查看详情<AppIcon name="chevron" :size="13" />
            </button>
        </div>
        <div v-if="!history.length" class="activity-empty">
            <span class="activity-spark">✦</span>
            <p class="activity-empty-text">故事还没开始。第一掷，交给你。</p>
            <span class="activity-empty-line"></span>
        </div>
        <ol v-else class="activity-list">
            <li v-for="(event, index) in history.slice(0, 5)" :key="event.id" class="activity-item">
                <span class="activity-status" :class="event.type === 'bank' ? 'bank' : 'farkle'">
                    <AppIcon :name="event.type === 'bank' ? 'check' : 'close'" :size="11" />
                </span>
                <span class="activity-body">
                    <strong class="activity-name">{{ event.name }}</strong
                    >{{ event.type === "bank" ? "落袋为安" : "遭遇 Farkle"
                    }}<small v-if="event.final" class="activity-final-tag">触发最终回合</small></span
                >
                <b class="activity-points" :class="{ bank: event.type === 'bank' }"
                    >{{
                        event.type === "bank"
                            ? "+" + format(event.points)
                            : event.points
                              ? "失去 " + format(event.points)
                              : "本回合归零"
                    }}<small v-if="event.type === 'bank'" class="activity-unit">分</small></b
                ><time class="activity-time">{{ index === 0 ? "刚刚" : `第 ${Math.ceil(event.turn / 2)} 轮` }}</time>
            </li>
        </ol>
    </section>
</template>

<style scoped>
/* 对局动态区：与上方牌桌留出间距。 */
.activity {
    padding-top: 26px;
}

/* 窄屏动态区：略减上边距。 */
@media (max-width: 520px) {
    .activity {
        padding-top: 22px;
    }
}

/* 动态标题行：标题与“查看详情”两端对齐。 */
.activity-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

/* 动态标题：图标与文字横向排列。 */
.activity-title {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: clamp(14px, 1.15vw, 16px);
    font-weight: 500;
}

/* 手机端动态标题：固定 14px。 */
@media (max-width: 700px) {
    .activity-title {
        font-size: 14px;
    }
}

/* 窄屏动态标题：收紧图标间距。 */
@media (max-width: 520px) {
    .activity-title {
        gap: 8px;
    }
}

/* 动态标题图标：比正文更灰的绿色。 */
.activity-icon {
    color: #adbf98;
}

/* 查看详情按钮：无边框透明底，悬停提亮。 */
.activity-details {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 32px;
    padding: 4px 0;
    border: 0;
    background: transparent;
    color: var(--color-lime);
    font-size: clamp(11px, 0.95vw, 12px);
    letter-spacing: normal;
}

/* 查看详情悬停：文字变浅绿。 */
.activity-details:hover {
    color: #d8f0b7;
}

/* 手机端查看详情：固定 12px，并提高到 40px 触控高度。 */
@media (max-width: 700px) {
    .activity-details {
        min-height: 40px;
        font-size: 12px;
    }
}

/* 空状态：感叹号、提示文字与渐隐横线排成一行。 */
.activity-empty {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 25px;
    padding-bottom: 10px;
    color: #75846e;
}

/* 窄屏空状态：略减上边距。 */
@media (max-width: 520px) {
    .activity-empty {
        padding-top: 23px;
    }
}

/* 空状态星号：浅绿色小装饰。 */
.activity-spark {
    color: #819874;
    font-size: 17px;
}

/* 空状态提示：保持单行并限制字号。 */
.activity-empty-text {
    font-size: clamp(12px, 1vw, 13px);
    white-space: nowrap;
}

/* 手机端空状态提示：固定 12px。 */
@media (max-width: 700px) {
    .activity-empty-text {
        font-size: 12px;
    }
}

/* 空状态横线：从浅绿渐变到透明，延伸视觉。 */
.activity-empty-line {
    flex: 1;
    height: 1px;
    margin-left: 8px;
    background: linear-gradient(90deg, #a9c18615, transparent);
}

/* 动态列表：纵向排列，每条间隔 13px。 */
.activity-list {
    display: grid;
    gap: 13px;
    margin-top: 16px;
    padding: 0;
}

/* 单条动态：状态图标、正文、分数与时间横向排列。 */
.activity-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #93a28a;
    font-size: clamp(12px, 1vw, 13px);
}

/* 手机端动态：允许换行，避免长名字挤压时间。 */
@media (max-width: 700px) {
    .activity-item {
        flex-wrap: wrap;
        font-size: 12px;
    }
}

/* 窄屏动态：收紧元素间距。 */
@media (max-width: 520px) {
    .activity-item {
        gap: 6px;
    }
}

/* 动态状态圆点：收分与爆骰共用尺寸。 */
.activity-status {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
}

/* 收分状态：浅绿底与浅绿图标。 */
.activity-status.bank {
    background: #c5e99510;
    color: #bdda96;
}

/* 爆骰状态：浅橙底与暖橙图标。 */
.activity-status.farkle {
    background: #c0947315;
    color: #d4a783;
}

/* 动态正文：占满中间剩余宽度。 */
.activity-body {
    flex: 1;
    min-width: 0;
}

/* 手机端动态正文：保留状态图标宽度，避免文字钻到图标下方。 */
@media (max-width: 700px) {
    .activity-body {
        min-width: calc(100% - 24px);
    }
}

/* 玩家名：与事件说明保持 7px 间距，并允许长名字换行。 */
.activity-name {
    margin-right: 7px;
    color: #c6d4bc;
    font-weight: 500;
    overflow-wrap: break-word;
}

/* 窄屏玩家名：收紧右边距。 */
@media (max-width: 520px) {
    .activity-name {
        margin-right: 5px;
    }
}

/* 最终回合标签：跟在事件说明后的金色小徽标。 */
.activity-final-tag {
    display: inline-block;
    margin-left: 7px;
    padding: 2px 4px;
    border: 1px solid #b8a26b26;
    border-radius: 3px;
    color: #d8c18b;
    font-size: clamp(9px, 0.75vw, 10px);
}

/* 窄屏最终回合标签：缩小左边距与字号。 */
@media (max-width: 520px) {
    .activity-final-tag {
        margin-left: 4px;
        font-size: 6px;
    }
}

/* 动态分数：禁止换行，默认偏暖棕色。 */
.activity-points {
    color: #b4967b;
    font-size: clamp(10px, 0.85vw, 11px);
    font-weight: 500;
    white-space: nowrap;
}

/* 收分分数：改用更大的浅绿色字号。 */
.activity-points.bank {
    color: #c0d8a0;
    font-size: clamp(11px, 0.95vw, 12px);
}

/* 手机端收分分数：固定 12px。 */
@media (max-width: 700px) {
    .activity-points.bank {
        font-size: 12px;
    }
}

/* 手机端爆骰分数：固定 10px。 */
@media (max-width: 700px) {
    .activity-points {
        font-size: 10px;
    }
}

/* 收分单位“分”：更小、更灰。 */
.activity-unit {
    margin-left: 3px;
    color: #839773;
    font-size: clamp(9px, 0.75vw, 10px);
}

/* 手机端收分单位：固定 10px。 */
@media (max-width: 700px) {
    .activity-unit {
        font-size: 10px;
    }
}

/* 动态时间：右对齐并保持固定最小宽度。 */
.activity-time {
    flex-shrink: 0;
    min-width: 31px;
    margin-left: 8px;
    color: #8a9a83;
    font-size: clamp(9px, 0.75vw, 10px);
    text-align: right;
}

/* 手机端时间：另起一行并左对齐。 */
@media (max-width: 700px) {
    .activity-time {
        width: calc(100% - 24px);
        margin-left: 24px;
        font-size: 10px;
        text-align: left;
    }
}

/* 窄屏时间：收紧左边距。 */
@media (max-width: 520px) {
    .activity-time {
        margin-left: 4px;
    }
}
</style>
