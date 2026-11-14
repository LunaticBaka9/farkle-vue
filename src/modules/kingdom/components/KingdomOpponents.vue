<script setup>
import AppIcon from "../../../shared/components/AppIcon.vue";

defineProps({
    coins: { type: Number, required: true },
    opponents: { type: Array, required: true },
});

const emit = defineEmits(["challenge"]);
</script>

<template>
    <section class="opponents-card" aria-labelledby="kingdom-opponents-title">
        <div class="opponents-head">
            <div>
                <span class="opponents-eyebrow">THE ROYAL OPPONENTS</span>
                <h2 id="kingdom-opponents-title" class="opponents-title">选择对手</h2>
            </div>
            <span class="opponents-count">{{ opponents.length }} 位</span>
        </div>
        <div class="opponents-list">
            <article v-for="(opponent, index) in opponents" :key="opponent.id" class="opponent-row">
                <span class="opponent-avatar"><AppIcon :name="opponent.icon" :size="30" /></span>
                <div class="opponent-info">
                    <div class="opponent-name-row">
                        <strong class="opponent-name">{{ opponent.name }}</strong>
                        <small class="opponent-index">0{{ index + 1 }}</small>
                    </div>
                    <p class="opponent-detail">
                        {{ opponent.title }} · {{ opponent.target.toLocaleString("zh-CN") }} 分
                    </p>
                </div>
                <button
                    type="button"
                    class="opponent-challenge"
                    :disabled="coins < opponent.wager"
                    @click="emit('challenge', opponent)">
                    挑战 · {{ opponent.wager }} 金币
                </button>
            </article>
        </div>
    </section>
</template>

<style scoped>
/* 对手卡片：与商店一致的深色玻璃底与金色描边。 */
.opponents-card {
    overflow: hidden;
    border: 1px solid #b99b6140;
    border-radius: 18px;
    background: linear-gradient(145deg, #201d1355, #0d100b88);
    box-shadow:
        inset 0 1px 0 #dfcf9a12,
        0 12px 30px #0003;
}

/* 对手区标题栏：标题与数量徽标两端对齐。 */
.opponents-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 27px 33px;
    border-bottom: 1px solid #b99b6120;
}

/* 窄屏对手标题栏：收紧左右内边距。 */
@media (max-width: 520px) {
    .opponents-head {
        padding-right: 14px;
        padding-left: 14px;
    }
}

/* 对手区英文眉题：金色小字。 */
.opponents-eyebrow {
    color: #9d9273;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
}

/* 对手区标题：米金色大字。 */
.opponents-title {
    margin-top: 8px;
    color: #eee5cc;
    font-size: 30px;
    font-weight: 600;
}

/* 窄屏对手区标题：缩小到 18px。 */
@media (max-width: 520px) {
    .opponents-title {
        font-size: 18px;
    }
}

/* 对手数量徽标：圆角金色描边。 */
.opponents-count {
    padding: 8px 14px;
    border: 1px solid #b99b6138;
    border-radius: 9999px;
    color: #b7a879;
    font-size: 14px;
}

/* 对手列表：纵向排列，每行间隔 12px。 */
.opponents-list {
    display: grid;
    gap: 12px;
    padding: 18px;
}

/* 对手行：头像、信息与挑战按钮三段式布局。 */
.opponent-row {
    display: grid;
    grid-template-columns: 63px minmax(0, 1fr) auto;
    align-items: center;
    gap: 18px;
    padding: 15px 18px;
    border: 1px solid #b99b6124;
    border-radius: 12px;
    background: #15140e66;
    transition-property: border-color, background, transform;
    transition-duration: 0.2s;
}

/* 对手行悬停：描边与底色提亮。 */
.opponent-row:hover {
    border-color: #b99b6170;
    background: #2b271577;
}

/* 窄屏对手行：头像与信息两列，挑战按钮另起一行。 */
@media (max-width: 520px) {
    .opponent-row {
        grid-template-columns: 38px minmax(0, 1fr);
    }
}

/* 对手头像：圆形暗金底。 */
.opponent-avatar {
    display: grid;
    place-items: center;
    width: 63px;
    height: 63px;
    border: 1px solid #b99b6150;
    border-radius: 50%;
    background: radial-gradient(circle, #3b351e, #17160f);
    color: #d8c58b;
}

/* 窄屏对手头像：缩小到 38px。 */
@media (max-width: 520px) {
    .opponent-avatar {
        width: 38px;
        height: 38px;
    }
}

/* 对手信息区：允许长名字收缩。 */
.opponent-info {
    min-width: 0;
}

/* 对手名字行：名字与序号横向排列。 */
.opponent-name-row {
    display: flex;
    align-items: center;
    gap: 7px;
}

/* 对手名字：单行省略。 */
.opponent-name {
    overflow: hidden;
    color: #e7dec4;
    font-size: 21px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 对手序号：暗金色小字。 */
.opponent-index {
    color: #918765;
    font-size: 12px;
}

/* 对手称号与目标分数：暖灰色。 */
.opponent-detail {
    margin-top: 5px;
    color: #989175;
    font-size: 16px;
}

/* 挑战按钮：金色渐变、内高光与外投影。 */
.opponent-challenge {
    min-width: 168px;
    padding: 14px 18px;
    border: 1px solid #c6b4775c;
    background: linear-gradient(145deg, #5a502f, #302916);
    color: #f0e5bf;
    font-size: 16px;
    box-shadow:
        inset 0 1px 0 #fff7c426,
        0 4px 10px #0005;
    transition-property: transform, border-color, background;
    transition-duration: 0.2s;
}

/* 挑战按钮悬停：上浮 1px 并提亮金属底色。 */
.opponent-challenge:hover {
    border-color: #decf92;
    background: linear-gradient(145deg, #756843, #403620);
    transform: translateY(-1px);
}

/* 挑战按钮按下：回落 1px。 */
.opponent-challenge:active {
    transform: translateY(1px);
}

/* 挑战按钮禁用（金币不足）：压暗并恢复禁用光标。 */
.opponent-challenge:disabled {
    border-color: #77705240;
    background: #302d2366;
    color: #777561;
    cursor: not-allowed;
}

/* 窄屏挑战按钮：跨两列并占满宽度。 */
@media (max-width: 520px) {
    .opponent-challenge {
        grid-column: span 2;
        width: 100%;
        min-width: 0;
        margin-top: 4px;
    }
}
</style>
