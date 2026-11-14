<script setup>
import AppIcon from "./AppIcon.vue";

// GameDialogs 在 winner 状态下挂载此结果视图；分数与胜者来自 Pinia game 状态。
defineProps({ game: Object, format: Function, winnerLabel: String, theme: String });
const emit = defineEmits(["close", "openSetup", "openActivity"]);
</script>

<template>
    <section class="winner">
        <div class="winner-emblem"><AppIcon name="trophy" :size="45" /></div>
        <div class="winner-eyebrow">WHAT A GAME. WHAT A JOURNEY.</div>
        <h2 id="winner-title" class="dlg-h2 winner-title">{{ winnerLabel }}</h2>
        <p class="dlg-lede">
            {{ game.winner === "tie" ? "旗鼓相当的对手，值得再来一局。" : "每一次果断收手，每一次勇敢再掷，都算数。" }}
        </p>
        <div class="winner-board">
            <div v-for="(player, index) in game.players" :key="index" class="winner-player">
                <span class="winner-name">{{ player.name }}</span>
                <strong class="winner-score" :class="{ win: game.winner === index }">
                    {{ format(player.score) }}
                </strong>
                <small class="winner-label" :class="{ win: game.winner === index }">
                    {{ game.winner === index ? "WINNER" : "POINTS" }}
                </small>
            </div>
        </div>
        <button class="dlg-btn primary winner-btn" @click="emit('openSetup')">
            再来一局<AppIcon name="restart" :size="17" />
        </button>
        <button class="dlg-btn secondary winner-btn winner-btn-secondary" @click="emit('openActivity')">
            查看动态详情<AppIcon name="history" :size="17" />
        </button>
        <button class="winner-back" @click="emit('close')">回到牌桌查看记录</button>
    </section>
</template>

<style scoped>
/* 结果页整体居中排版。 */
.winner {
    padding-top: 5px;
    text-align: center;
}

/* 奖杯徽章：圆形渐变底与柔和绿色光晕。 */
.winner-emblem {
    display: grid;
    place-items: center;
    width: 90px;
    height: 90px;
    margin: 0 auto 25px;
    border: 1px solid #c5e9953a;
    border-radius: 50%;
    background: radial-gradient(#c5e99516, #c5e99502);
    color: var(--color-lime);
    box-shadow: 0 0 40px #c5e99508;
}

/* 英文眉题：小字号、宽字距，营造仪式感。 */
.winner-eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #acbf97;
    font-size: 7px;
    font-weight: 600;
    letter-spacing: 2px;
}

/* 胜者标题：与上方眉题留出间距，并允许长名字换行。 */
.winner-title {
    margin-top: 17px;
    overflow-wrap: break-word;
}

/* 窄屏胜者标题：略减字号，避免长名字占用过多高度。 */
@media (max-width: 520px) {
    .winner-title {
        font-size: 26px;
    }
}

/* 双方分数面板：两列等宽，中间用竖线分隔。 */
.winner-board {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 26px;
    padding: 23px 0;
    border: 1px solid #cadfa424;
    border-radius: 8px;
    background: #0a140c33;
}

/* 单个玩家分数块：纵向居中排列。 */
.winner-player {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

/* 第二位玩家左侧分隔线。 */
.winner-player + .winner-player {
    border-left: 1px solid #b1c58c21;
}

/* 玩家名：允许长名字换行，并保留左右呼吸空间。 */
.winner-name {
    padding: 0 8px;
    color: #a5b691;
    font-size: clamp(12px, 1vw, 13px);
    overflow-wrap: break-word;
}

/* 窄屏玩家名：固定 12px。 */
@media (max-width: 700px) {
    .winner-name {
        font-size: 12px;
    }
}

/* 分数：等宽数字字体，适合大号展示。 */
.winner-score {
    color: #cedbc0;
    font-family: var(--font-numeric);
    font-size: 32px;
    font-weight: 400;
    letter-spacing: -0.5px;
}

/* 胜者分数：改用品牌绿高亮。 */
.winner-score.win {
    color: var(--color-lime);
}

/* 窄屏分数：略减字号。 */
@media (max-width: 520px) {
    .winner-score {
        font-size: 30px;
    }
}

/* 分数下方标签：全大写小字，区分胜者与普通分数。 */
.winner-label {
    color: #839474;
    font-size: clamp(9px, 0.75vw, 10px);
    letter-spacing: 2px;
}

/* 胜者标签：同样使用品牌绿。 */
.winner-label.win {
    color: var(--color-lime);
}

/* 窄屏标签：固定 9px。 */
@media (max-width: 700px) {
    .winner-label {
        font-size: 9px;
    }
}

/* 操作按钮：占满弹窗宽度并居中内容。 */
.winner-btn {
    justify-content: center;
    width: 100%;
    margin-top: 25px;
}

/* 第二个操作按钮与主按钮之间留出间隔。 */
.winner-btn-secondary {
    margin-top: 9px;
}

/* 仅主按钮把尾部图标推到最右侧；次按钮保持文字与图标居中。 */
.winner-btn.primary > svg:last-child {
    margin-left: auto;
}

/* 返回牌桌的文字按钮：无边框无底色，悬停变绿。 */
.winner-back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 18px;
    padding: 7px 0;
    border: 0;
    background: transparent;
    color: #8d9b88;
    font-size: clamp(11px, 0.95vw, 12px);
}

/* 返回按钮悬停：文字变为品牌绿。 */
.winner-back:hover {
    color: var(--color-lime);
}

/* 窄屏返回按钮：固定 12px。 */
@media (max-width: 700px) {
    .winner-back {
        font-size: 12px;
    }
}
</style>
