<!-- 模式切换、新对局入口以及双方玩家总分与进度。 -->
<script setup>
import AppIcon from "../framework/AppIcon.vue";
// game/targetScore 提供当前对局信息；difficultyLabels/progress 负责显示 AI 难度和进度。
defineProps({ game: Object, targetScore: Number, format: Function, difficultyLabels: Object, progress: Function });
defineEmits(["selectMode", "openSetup"]);
</script>
<template>
    <div>
        <div class="scoreboard-head">
            <div class="mode-group" role="group" aria-label="游戏模式">
                <button
                    class="mode-tab"
                    :class="{ active: game.mode === 'ai' }"
                    :aria-pressed="game.mode === 'ai'"
                    @click="$emit('selectMode', 'ai')">
                    <AppIcon class="mode-tab-icon" name="bot" :size="16" />单人对战
                    <span class="ai-badge">AI</span>
                </button>
                <button
                    class="mode-tab"
                    :class="{ active: game.mode === 'local' }"
                    :aria-pressed="game.mode === 'local'"
                    @click="$emit('selectMode', 'local')">
                    <AppIcon class="mode-tab-icon" name="users" :size="16" />本地双人
                </button>
            </div>
            <button class="new-game-btn" aria-label="新对局" @click="$emit('openSetup')">
                <AppIcon name="restart" :size="16" /><span>新对局</span>
            </button>
        </div>
        <div class="players">
            <article
                v-for="(p, index) in game.players"
                :key="index"
                class="player-card"
                :class="{ active: game.active === index && game.phase !== 'finished' }"
                :aria-label="`${p.name}，总分 ${p.score}${
                    game.active === index && game.phase !== 'finished' ? '，当前回合' : ''
                }`">
                <div class="player-head">
                    <div class="avatar" :class="{ second: index === 1 }">
                        <AppIcon
                            class="avatar-icon"
                            :name="index === 1 && game.mode === 'ai' ? 'bot' : 'user'"
                            :size="21" />
                    </div>
                    <div class="player-id">
                        <h2 class="player-name">
                            {{ p.name
                            }}<span v-if="index === 1 && game.mode === 'ai'" class="ai-tag">AI</span>
                        </h2>
                        <span class="player-role">{{
                            index === 1 && game.mode === "ai"
                                ? difficultyLabels[game.difficulty] + "对手"
                                : "PLAYER 0" + (index + 1)
                        }}</span>
                    </div>
                    <span
                        v-if="game.active === index && game.phase !== 'finished'"
                        class="turn-badge"
                        ><i class="turn-dot"></i>当前回合</span
                    ><span v-else class="turn-state">{{
                        game.phase === "finished" ? "对局结束" : "等待中"
                    }}</span>
                </div>
                <div class="player-score" aria-live="polite" aria-atomic="true">
                    {{ format(p.score)
                    }}<span class="player-target">/ {{ format(targetScore) }}</span>
                </div>
                <div
                    class="progress-track"
                    role="progressbar"
                    :aria-label="`${p.name}的目标进度`"
                    :aria-valuenow="Math.min(p.score, targetScore)"
                    :aria-valuemin="0"
                    :aria-valuemax="targetScore">
                    <div
                        class="progress-fill"
                        :class="{ second: index === 1 }"
                        :style="{ width: progress(p.score) }"></div>
                </div>
            </article>
        </div>
    </div>
</template>

<style scoped>
/* 记分板顶部：模式切换与新对局入口两端对齐。 */
.scoreboard-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 19px;
}

/* 窄屏记分板顶部：收紧下边距与间距。 */
@media (max-width: 520px) {
    .scoreboard-head {
        gap: 10px;
        margin-bottom: 15px;
    }
}

/* 模式切换组：深色胶囊容器包裹两个按钮。 */
.mode-group {
    display: inline-flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid #ffffff0a;
    border-radius: 8px;
    background: #1a241c;
}

/* 窄屏模式切换组：收紧间距与内边距。 */
@media (max-width: 520px) {
    .mode-group {
        gap: 2px;
        padding: 3px;
    }
}

/* 模式按钮：默认透明底、灰色文字。 */
.mode-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 9px 15px;
    border: 1px solid transparent;
    border-radius: 5px;
    background: transparent;
    color: #8d9a8c;
    font-size: clamp(12px, 1vw, 13px);
}

/* 未选中模式按钮悬停：轻微提亮底色与文字。 */
.mode-tab:not(.active):hover {
    background: #ffffff04;
    color: #d6e0cd;
}

/* 当前模式按钮：深绿底、绿色描边与阴影。 */
.mode-tab.active {
    /* 当前模式使用更明确的深绿填充，避免只靠文字颜色区分。 */
    border-color: #a0c57d18;
    background: #34402b;
    color: var(--color-lime);
    box-shadow: 0 1px 3px #0002;
}

/* 窄屏模式按钮：收紧图标间距与左右内边距。 */
@media (max-width: 520px) {
    .mode-tab {
        gap: 6px;
        padding: 9px 11px;
    }
}

/* 极窄屏模式按钮：进一步压缩左右内边距。 */
@media (max-width: 374px) {
    .mode-tab {
        padding: 9px;
    }
}

/* 窄屏模式按钮图标：缩小到 14px。 */
@media (max-width: 520px) {
    .mode-tab-icon {
        width: 14px;
        height: 14px;
    }
}

/* AI 小徽标：跟在“单人对战”后面。 */
.ai-badge {
    padding: 2px 3px;
    border-radius: 3px;
    background: #bfe79213;
    color: #b7d28f;
    font-size: clamp(9px, 0.75vw, 10px);
    letter-spacing: 0.5px;
    line-height: 1.2;
}

/* 新对局按钮：无边框文字按钮。 */
.new-game-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 36px;
    padding: 8px 12px;
    border: 1px solid #a3c07f54;
    border-radius: 7px;
    background: #49613b28;
    color: #c4d5b3;
    font-size: 12px;
}

/* 新对局按钮悬停：提高边框、底色与文字对比。 */
.new-game-btn:hover {
    border-color: #a3c07f90;
    background: #77935935;
    color: #e2efd1;
}

/* 手机端新对局按钮：固定 12px。 */
@media (max-width: 700px) {
    .new-game-btn {
        font-size: 12px;
    }
}

/* 窄屏新对局按钮：保证触控高度并收紧图标间距。 */
@media (max-width: 520px) {
    .new-game-btn {
        gap: 5px;
        min-height: 40px;
    }
}

/* 极窄屏只保留图标，避免和模式切换按钮挤在一起。 */
@media (max-width: 374px) {
    .new-game-btn {
        padding: 8px;
    }

    .new-game-btn span {
        display: none;
    }
}

/* 玩家卡片区：双列等宽。 */
.players {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}

/* 窄屏玩家卡片区：收紧间距。 */
@media (max-width: 520px) {
    .players {
        gap: 11px;
        margin-bottom: 16px;
    }
}

/* 玩家卡片：默认深绿渐变底与极淡描边。 */
.player-card {
    position: relative;
    min-width: 0;
    padding: 18px 21px 17px;
    overflow: hidden;
    border: 1px solid #e0efcc13;
    border-radius: 10px;
    background: linear-gradient(115deg, #202a22, #1b241e);
}

/* 当前行动玩家卡片：更亮的描边与渐变底。 */
.player-card.active {
    border-color: #b3d18c61;
    background: linear-gradient(110deg, #293725, #202c21);
}

/* 当前行动玩家卡片顶部高光：中间亮、两端透明。 */
.player-card.active::before {
    position: absolute;
    top: 0;
    right: 18%;
    left: 18%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #bce29266, transparent);
    content: "";
}

/* 窄屏当前行动玩家：右上角保留一个绿色行动圆点。 */
@media (max-width: 520px) {
    .player-card.active::after {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-lime);
        box-shadow:
            0 0 0 4px #c5e99515,
            0 0 12px #c5e99555;
        content: "";
    }
}

/* 中屏玩家卡片：收紧左右内边距。 */
@media (max-width: 1180px) {
    .player-card {
        padding-right: 16px;
        padding-left: 16px;
    }
}

/* 平板玩家卡片：四周使用统一内边距。 */
@media (max-width: 1000px) {
    .player-card {
        padding: 20px;
    }
}

/* 窄屏玩家卡片：缩小圆角与内边距。 */
@media (max-width: 520px) {
    .player-card {
        padding: 15px 13px;
        border-radius: 9px;
    }
}

/* 玩家卡片头部：头像、名字与回合状态横向排列。 */
.player-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* 窄屏玩家头部：收紧间距。 */
@media (max-width: 520px) {
    .player-head {
        gap: 8px;
    }
}

/* 玩家头像：浅绿色圆角方块。 */
.avatar {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 35px;
    height: 35px;
    border-radius: 9px;
    background: #c5e99512;
    color: #b9d697;
}

/* 第二位玩家头像：暖金色调，与 AI/对手区分。 */
.avatar.second {
    background: #dab48a10;
    color: #d4bf93;
}

/* 窄屏玩家头像：缩小尺寸与圆角。 */
@media (max-width: 520px) {
    .avatar {
        width: 30px;
        height: 30px;
        border-radius: 8px;
    }
}

/* 窄屏当前玩家头像：加一圈细描边强调行动方。 */
@media (max-width: 520px) {
    .player-card.active .avatar {
        box-shadow: 0 0 0 1px #c5e99530;
    }
}

/* 窄屏玩家头像图标：缩小到 18px。 */
@media (max-width: 520px) {
    .avatar-icon {
        width: 18px;
        height: 18px;
    }
}

/* 玩家身份区：允许长名字收缩。 */
.player-id {
    min-width: 0;
}

/* 玩家名字：超长时省略并保持单行。 */
.player-name {
    display: flex;
    align-items: center;
    gap: 7px;
    max-width: 170px;
    overflow: hidden;
    font-size: clamp(14px, 1.15vw, 16px);
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 中屏玩家名字：限制更窄，避免挤压回合标签。 */
@media (max-width: 1180px) {
    .player-name {
        max-width: 110px;
    }
}

/* 平板玩家名字：单列后可以放宽。 */
@media (max-width: 1000px) {
    .player-name {
        max-width: 190px;
    }
}

/* 窄屏玩家名字：限制宽度并收紧 AI 徽标间距。 */
@media (max-width: 520px) {
    .player-name {
        gap: 5px;
        max-width: 100px;
    }
}

/* 极窄屏玩家名字：进一步限制宽度。 */
@media (max-width: 374px) {
    .player-name {
        max-width: 80px;
    }
}

/* AI 标签：跟在 AI 玩家名字后。 */
.ai-tag {
    padding: 2px 4px;
    border: 1px solid #cbb78a3a;
    border-radius: 3px;
    color: #cdb68b;
    font-size: clamp(8px, 0.65vw, 9px);
    font-weight: 500;
    letter-spacing: 0.3px;
}

/* 手机端 AI 标签：固定 8px。 */
@media (max-width: 700px) {
    .ai-tag {
        font-size: 8px;
    }
}

/* 玩家角色：难度对手或 PLAYER 编号。 */
.player-role {
    display: block;
    margin-top: 5px;
    color: #9db096;
    font-size: clamp(9px, 0.75vw, 10px);
    letter-spacing: 1.2px;
}

/* 手机端玩家角色：固定 10px。 */
@media (max-width: 700px) {
    .player-role {
        font-size: 10px;
    }
}

/* 窄屏玩家角色：收紧字距。 */
@media (max-width: 520px) {
    .player-role {
        letter-spacing: 0.8px;
    }
}

/* 当前回合徽标：推到行尾。 */
.turn-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    padding: 4px 6px;
    border: 1px solid #c1df8a1a;
    border-radius: 4px;
    background: #c5e99509;
    color: #c2dc9f;
    font-size: clamp(9px, 0.8vw, 10px);
    white-space: nowrap;
}

/* 中屏当前回合徽标：收紧内边距。 */
@media (max-width: 1180px) {
    .turn-badge {
        padding: 4px;
    }
}

/* 平板当前回合徽标：恢复左右内边距。 */
@media (max-width: 1000px) {
    .turn-badge {
        padding: 5px 7px;
    }
}

/* 手机端当前回合徽标：固定 10px。 */
@media (max-width: 700px) {
    .turn-badge {
        font-size: 10px;
    }
}

/* 窄屏隐藏当前回合徽标，优先保证名字可读。 */
@media (max-width: 520px) {
    .turn-badge {
        display: none;
    }
}

/* 回合徽标前的圆点：品牌绿。 */
.turn-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-lime);
}

/* 非行动玩家状态：等待中或对局结束。 */
.turn-state {
    margin-left: auto;
    color: #9db096;
    font-size: clamp(9px, 0.8vw, 10px);
    white-space: nowrap;
}

/* 手机端等待状态：固定 10px。 */
@media (max-width: 700px) {
    .turn-state {
        font-size: 10px;
    }
}

/* 窄屏隐藏等待状态。 */
@media (max-width: 520px) {
    .turn-state {
        display: none;
    }
}

/* 玩家总分：大号等宽数字，目标分数用更小的单位跟在后面。 */
.player-score {
    display: flex;
    align-items: baseline;
    gap: 11px;
    margin: 15px 0 14px;
    font-family: var(--font-numeric);
    font-size: 37px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    letter-spacing: -0.8px;
    line-height: 1.2;
}

/* 窄屏玩家总分：收紧间距并缩小字号。 */
@media (max-width: 520px) {
    .player-score {
        gap: 7px;
        margin: 16px 0 12px;
        font-size: 32px;
    }
}

/* 极窄屏玩家总分：再缩小一号。 */
@media (max-width: 374px) {
    .player-score {
        font-size: 28px;
    }
}

/* 目标分数：更小、更灰的对照数值。 */
.player-target {
    color: #9db096;
    font-size: clamp(11px, 0.9vw, 12px);
    font-weight: 400;
    letter-spacing: 0.3px;
}

/* 进度条轨道：极细的深色底。 */
.progress-track {
    height: 3px;
    overflow: hidden;
    border-radius: 3px;
    background: #d6e6be12;
}

/* 进度条填充：宽度由内联 style 控制，变化时平滑过渡。 */
.progress-fill {
    height: 100%;
    background: var(--color-lime);
    transition: width 0.8s ease-out;
}

/* 第二位玩家进度：改用暖金色。 */
.progress-fill.second {
    background: #d7bd85;
}
</style>
