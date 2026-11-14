<!-- 游戏牌桌、骰子选择、保留区、掷骰与收分操作。 -->
<script setup>
import AppIcon from "../framework/AppIcon.vue";
import Die from "../framework/Die.vue";
// props 汇总牌桌所需的对局状态、选骰状态、计分预览和可执行动作约束。
defineProps({
    game: Object,
    format: Function,
    round: Number,
    selected: Array,
    rolling: Boolean,
    rollingFaces: Array,
    isAi: Boolean,
    headline: String,
    selectionText: String,
    chosenScore: Number,
    pendingScore: Number,
    validSelection: Boolean,
    canRollNow: Boolean,
    canBankNow: Boolean,
    nextDiceCount: Number,
    nextRisk: Number,
    entryMissing: Boolean,
    showHandoff: Boolean,
    entryScore: Number,
});
defineEmits(["toggleDie", "suggest", "roll", "bank", "nextTurn", "openSetup", "openWinner", "openActivity"]);
</script>
<template>
    <section
        class="game-table"
        :class="{ farkle: game.phase === 'farkle', final: game.finalStarter !== null }"
        aria-label="骰子牌桌">
        <div class="table-corner tl"></div>
        <div class="table-corner tr"></div>
        <div class="table-corner bl"></div>
        <div class="table-corner br"></div>
        <!-- 内容层：统一抬到牌桌纹理之上，替代原来的子元素选择器。 -->
        <div class="table-content">
            <div class="table-meta">
                <span class="round-tag"
                    ><span class="round-dot"></span
                    >{{
                        game.finalStarter !== null
                            ? "最后一回合 · FINAL ROUND"
                            : `第 ${String(round).padStart(2, "0")} 轮`
                    }}</span
                ><span class="table-caption">SIX DICE. INFINITE POSSIBILITIES.</span>
            </div>
            <div v-if="game.finalStarter !== null && game.phase !== 'finished'" class="final-notice">
                <AppIcon name="trophy" :size="13" />{{
                    game.players[game.finalStarter].name
                }}已达目标，对手还有最后一次机会。
            </div>
            <div class="table-score">
                <div class="score-kicker">
                    {{
                        game.phase === "farkle"
                            ? "这一掷，运气暂时离场"
                            : game.phase === "finished"
                              ? "THANKS FOR PLAYING"
                              : "本回合累计"
                    }}
                </div>
                <div class="score-main" :class="{ farkle: game.phase === 'farkle' }">
                    {{ game.phase === "farkle" ? "FARKLE!" : format(game.turnScore)
                    }}<span v-if="game.phase !== 'farkle'" class="pts">pts</span>
                </div>
                <p class="headline" role="status" aria-live="polite">{{ headline }}</p>
            </div>
            <div
                class="dice-row"
                :class="{
                    dimmed: game.phase === 'ready' || showHandoff,
                    faded: game.phase === 'farkle',
                }">
                <template v-if="rolling"
                    ><Die
                        v-for="(value, index) in rollingFaces"
                        :key="index"
                        :value="value"
                        :index="index"
                        rolling
                        disabled
                /></template>
                <template v-else-if="game.dice.length"
                    ><Die
                        v-for="(die, index) in game.dice"
                        :key="die.id"
                        :value="die.value"
                        :index="index"
                        :selected="selected.includes(die.id)"
                        :disabled="isAi || game.phase !== 'selecting'"
                        @select="$emit('toggleDie', die.id)"
                /></template>
                <template v-else
                    ><Die
                        v-for="(value, index) in [1, 5, 3, 6, 2, 4]"
                        :key="index"
                        :value="value"
                        :index="index"
                        decorative
                /></template>
            </div>
            <div class="selection-row" :class="{ warning: selected.length && !chosenScore }">
                <span>{{ selectionText }}</span
                ><span v-if="chosenScore" class="selection-score">+{{ format(chosenScore) }} 分</span
                ><button
                    v-if="game.phase === 'selecting' && !isAi && !rolling"
                    class="suggest-btn"
                    @click="$emit('suggest')">
                    <AppIcon name="spark" :size="12" />帮我选
                </button>
            </div>
            <div class="kept-row">
                <span class="kept-label"><AppIcon name="shield" :size="13" />已保留</span>
                <div v-if="game.kept.length" class="kept-list">
                    <span
                        v-for="(group, index) in game.kept"
                        :key="index"
                        class="kept-group"
                        :title="`第 ${group.roll} 次投掷，${group.score} 分`"
                        ><Die
                            v-for="(value, i) in group.values"
                            :key="i"
                            :value="value"
                            :index="i"
                            class="kept-die"
                            small
                            decorative
                    /></span>
                </div>
                <span v-else class="kept-empty">等待你的第一个得分组合</span
                ><span class="kept-note">组合仅限同一次投掷</span>
            </div>
            <div v-if="showHandoff" class="handoff-row">
                <div v-if="game.mode === 'ai'" class="ai-thinking">
                    <span class="thinking-dots"><i></i><i></i><i></i></span>
                    正在交接回合
                </div>
                <button v-else class="table-btn primary handoff-btn" @click="$emit('nextTurn')">
                    {{
                        game.finalStarter !== null && game.active !== game.finalStarter
                            ? "查看最终结果"
                            : `交给${game.players[1 - game.active].name}`
                    }}<AppIcon name="arrow" :size="18" />
                </button>
            </div>
            <div v-else-if="game.phase === 'finished'" class="finished-actions">
                <button class="table-btn primary" @click="$emit('openSetup')">
                    <AppIcon name="restart" :size="18" />再来一局</button
                ><button class="table-btn secondary" @click="$emit('openWinner')">
                    查看结果<AppIcon name="trophy" :size="17" />
                </button>
                <button class="table-btn secondary" @click="$emit('openActivity')">
                    查看动态详情<AppIcon name="history" :size="17" />
                </button>
            </div>
            <div v-else class="table-actions">
                <button
                    class="table-btn primary roll-btn"
                    :disabled="!canRollNow"
                    @click="$emit('roll')">
                    <AppIcon name="dice" :size="21" /><span>{{
                        rolling ? "掷骰中…" : isAi ? "NOVA 思考中…" : game.phase === "ready" ? "掷出骰子" : "继续掷骰"
                    }}</span
                    ><span
                        v-if="game.phase === 'selecting' && !rolling && !isAi"
                        class="roll-count"
                        >{{ nextDiceCount }} 颗</span
                    ><AppIcon name="arrow" :size="17" /></button
                ><button
                    class="table-btn secondary bank-btn"
                    :disabled="!canBankNow"
                    :title="
                        entryMissing ? `首次收分需在同一回合累计至少 ${format(entryScore)} 分` : '把本回合得分加入总分'
                    "
                    :aria-describedby="!canBankNow ? 'table-hint' : undefined"
                    @click="$emit('bank')">
                    <AppIcon name="bank" :size="18" /><span>收分 · 结束回合</span
                    ><strong v-if="canBankNow" class="bank-points">+{{ format(pendingScore) }}</strong>
                </button>
            </div>
            <div id="table-hint" class="table-hint">
                <template v-if="validSelection && !showHandoff && !rolling"
                    ><AppIcon name="info" :size="12" /><span>{{
                        entryMissing
                            ? `首次收分还差 ${entryScore - pendingScore} 分，需继续掷骰。`
                            : `下次掷 ${nextDiceCount} 颗，爆骰概率约 ${nextRisk}%。冒险还是收手？`
                    }}</span></template
                ><template v-else
                    ><AppIcon name="info" :size="12" /><span>{{
                        entryMissing
                            ? `首次收分需在同一回合累计至少 ${format(entryScore)} 分，先选择可计分骰子。`
                            : "没有得分组合即爆骰，本回合未收分得分全部归零。"
                    }}</span></template
                >
            </div>
        </div>
    </section>
</template>

<style scoped>
/* 牌桌本体：圆角深绿桌面、内阴影与外投影；纹理由下方伪元素叠加。 */
.game-table {
    position: relative;
    padding: 21px 30px 20px;
    overflow: hidden;
    border: 1px solid #52754f7a;
    border-radius: 12px;
    background: radial-gradient(ellipse at 50% 35%, #274d37 0, #203f2e 42%, #1b3427 100%);
    box-shadow:
        inset 0 0 70px #0a211820,
        0 12px 24px #00000008;
}

/* 最终回合牌桌：边框改为暖金色。 */
.game-table.final {
    border-color: #c7b47e80;
}

/* 爆骰状态牌桌：暖棕渐变、陶土色边框与轻微红色光晕。 */
.game-table.farkle {
    border-color: #be87676b;
    background: radial-gradient(ellipse at 50% 35%, #443b2c, #2d3425);
    box-shadow:
        inset 0 0 70px #be876735,
        0 0 30px #be87671f,
        0 12px 24px #00000008;
}

/* 牌桌内圈描边：与桌沿形成内外两层边线。 */
.game-table::before {
    position: absolute;
    inset: 8px;
    border: 1px solid #b8d68e09;
    border-radius: 7px;
    content: "";
    pointer-events: none;
}

/* 牌桌噪点纹理：原 table-noise 工具类迁移到这里，仅铺在牌桌表面。 */
.game-table::after {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.3' filter='url(%23n)'/%3E%3C/svg%3E");
    content: "";
    mix-blend-mode: soft-light;
    opacity: 0.16;
    pointer-events: none;
}

/* 超大屏牌桌：略增内边距，让牌桌更舒展。 */
@media (min-width: 1400px) {
    .game-table {
        padding: 23px 32px 21px;
    }
}

/* 中屏牌桌：收紧左右内边距。 */
@media (max-width: 1180px) {
    .game-table {
        padding-right: 23px;
        padding-left: 23px;
    }
}

/* 平板牌桌：恢复较宽的左右内边距并加大上下留白。 */
@media (max-width: 1000px) {
    .game-table {
        padding: 23px 29px;
    }
}

/* 窄屏牌桌：缩小圆角与内边距，适配小屏。 */
@media (max-width: 520px) {
    .game-table {
        padding: 19px 15px 20px;
        border-radius: 10px;
    }
}

/* 极窄屏牌桌：再收紧左右内边距，给骰子行留出空间。 */
@media (max-width: 374px) {
    .game-table {
        padding-right: 12px;
        padding-left: 12px;
    }
}

/* 四角装饰线的公共定位。 */
.table-corner {
    position: absolute;
    z-index: 2;
    width: 9px;
    height: 9px;
    border-color: #b8d38b66;
    border-style: solid;
}

/* 左上角装饰线。 */
.table-corner.tl {
    top: 8px;
    left: 8px;
    border-top-width: 1px;
    border-left-width: 1px;
    border-top-left-radius: 2px;
}

/* 右上角装饰线。 */
.table-corner.tr {
    top: 8px;
    right: 8px;
    border-top-width: 1px;
    border-right-width: 1px;
    border-top-right-radius: 2px;
}

/* 左下角装饰线。 */
.table-corner.bl {
    bottom: 8px;
    left: 8px;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-bottom-left-radius: 2px;
}

/* 右下角装饰线。 */
.table-corner.br {
    right: 8px;
    bottom: 8px;
    border-right-width: 1px;
    border-bottom-width: 1px;
    border-bottom-right-radius: 2px;
}

/* 牌桌内容层：抬到噪点纹理之上，保证文字与骰子清晰。 */
.table-content {
    position: relative;
    z-index: 1;
}

/* 牌桌顶部信息：轮次与英文标语两端对齐。 */
.table-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #b4cba9;
    font-size: clamp(10px, 0.85vw, 11px);
    letter-spacing: 1.6px;
}

/* 手机端顶部信息：固定 10px。 */
@media (max-width: 700px) {
    .table-meta {
        font-size: 10px;
    }
}

/* 窄屏顶部信息：收紧字距。 */
@media (max-width: 520px) {
    .table-meta {
        letter-spacing: 1px;
    }
}

/* 轮次标签：圆点与文字横向排列。 */
.round-tag {
    display: flex;
    align-items: center;
    gap: 7px;
}

/* 窄屏轮次标签：收紧圆点间距。 */
@media (max-width: 520px) {
    .round-tag {
        gap: 5px;
    }
}

/* 轮次前的圆点：品牌绿并带光晕。 */
.round-dot {
    display: inline-block;
    flex-shrink: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-lime);
    box-shadow: 0 0 9px #c5e99520;
}

/* 窄屏轮次圆点：缩小到 4px。 */
@media (max-width: 520px) {
    .round-dot {
        width: 4px;
        height: 4px;
    }
}

/* 牌桌英文标语：比轮次更小更暗。 */
.table-caption {
    color: #a9c29d;
    font-size: clamp(8px, 0.75vw, 9px);
    letter-spacing: 1.5px;
}

/* 手机端英文标语：反而略增字号，保持可读。 */
@media (max-width: 700px) {
    .table-caption {
        font-size: 10px;
    }
}

/* 窄屏英文标语：收紧字距。 */
@media (max-width: 520px) {
    .table-caption {
        letter-spacing: 0.8px;
    }
}

/* 最终回合提示：金色文字居中对齐，负下边距抵消下方留白。 */
.final-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 15px;
    margin-bottom: -14px;
    color: #e3d6a6;
    font-size: clamp(10px, 0.85vw, 11px);
    line-height: 1.6;
    text-align: center;
}

/* 手机端最终回合提示：固定 10px。 */
@media (max-width: 700px) {
    .final-notice {
        font-size: 10px;
    }
}

/* 本回合得分区：默认上内边距，让大数字居中展示。 */
.table-score {
    padding-top: 30px;
    text-align: center;
}

/* 超大屏得分区：略增上内边距。 */
@media (min-width: 1400px) {
    .table-score {
        padding-top: 33px;
    }
}

/* 平板得分区：恢复 29px 上内边距。 */
@media (max-width: 1000px) {
    .table-score {
        padding-top: 29px;
    }
}

/* 窄屏得分区：保持 29px 上内边距。 */
@media (max-width: 520px) {
    .table-score {
        padding-top: 29px;
    }
}

/* 得分区小标题：说明当前是本回合累计还是爆骰。 */
.score-kicker {
    color: #a5bb9c;
    font-size: clamp(12px, 1vw, 13px);
    letter-spacing: 2px;
}

/* 窄屏得分区小标题：缩小到 9px。 */
@media (max-width: 520px) {
    .score-kicker {
        font-size: 9px;
    }
}

/* 大号本回合得分：默认米白、紧凑字距的等宽数字。 */
.score-main {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
    color: #f0f3df;
    font-family: var(--font-numeric);
    font-size: 59px;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
    letter-spacing: -2px;
    line-height: 1.2;
}

/* 窄屏大号得分：缩小一号。 */
@media (max-width: 520px) {
    .score-main {
        font-size: 53px;
    }
}

/* 爆骰状态得分：改用暖橙色、加粗并增加字距。 */
.score-main.farkle {
    padding: 5px 0;
    color: #efc198;
    font-size: 47px;
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 0 24px #efc19840;
}

/* 窄屏爆骰文字：收紧上下留白并略减字号。 */
@media (max-width: 520px) {
    .score-main.farkle {
        padding: 7px 0;
        font-size: 41px;
    }
}

/* 得分后的 pts 单位：小号、低对比。 */
.pts {
    color: #b4cba9;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.6px;
}

/* 得分区状态文案：为不同阶段提供一句操作提示。 */
.headline {
    min-height: 17px;
    margin-top: 9px;
    color: #b4cba9;
    font-size: 13px;
    line-height: 1.7;
}

/* 手机端状态文案：保持 12px 以上，避免状态说明过小。 */
@media (max-width: 700px) {
    .headline {
        font-size: 12.5px;
    }
}

/* 窄屏状态文案：增加最小高度并加大行高，换行时不跳动。 */
@media (max-width: 520px) {
    .headline {
        min-height: 29px;
        margin-top: 8px;
        padding: 0 5px;
        line-height: 1.8;
    }
}

/* 骰子行：六颗骰子居中排列，并预留固定最小高度。 */
.dice-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 19px;
    min-height: 136px;
    padding-top: 29px;
    padding-bottom: 22px;
}

/* 超大屏骰子行：加大骰子间距。 */
@media (min-width: 1400px) {
    .dice-row {
        gap: 23px;
    }
}

/* 中屏骰子行：收紧骰子间距。 */
@media (max-width: 1180px) {
    .dice-row {
        gap: 15px;
    }
}

/* 平板骰子行：加高最小高度并放大间距。 */
@media (max-width: 1000px) {
    .dice-row {
        gap: 24px;
        min-height: 143px;
    }
}

/* 窄屏骰子行：缩小高度、间距与上下留白。 */
@media (max-width: 520px) {
    .dice-row {
        gap: 11px;
        min-height: 112px;
        padding-top: 24px;
        padding-bottom: 19px;
    }
}

/* 极窄屏骰子行：进一步收紧间距，保证 320px 宽度下六颗骰子不溢出。 */
@media (max-width: 374px) {
    .dice-row {
        gap: 6px;
    }
}

/* 等待或交接回合时降低骰子饱和度。 */
.dice-row.dimmed > * {
    filter: saturate(0.7);
}

/* 装饰骰子（aria-hidden）在等待状态下略降不透明度。 */
.dice-row.dimmed > [aria-hidden] {
    opacity: 0.88;
}

/* 爆骰状态下整行骰子变暗。 */
.dice-row.faded > * {
    opacity: 0.65;
}

/* 选骰提示行：默认中性色，选中但未计分时变为暖橙色。 */
.selection-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 28px;
    color: #b4cba9;
    font-size: clamp(12px, 1vw, 13px);
}

/* 选骰警告：已选骰子但没有有效得分组合。 */
.selection-row.warning {
    color: #f3c59f;
}

/* 窄屏选骰提示：收紧间距。 */
@media (max-width: 520px) {
    .selection-row {
        gap: 7px;
    }
}

/* 当前所选组合的得分：浅绿加粗。 */
.selection-score {
    color: #d1efa5;
    font-weight: 600;
}

/* “帮我选”按钮：下划线式文字按钮。 */
.suggest-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 32px;
    padding: 5px 10px;
    border: 1px solid #c5df9a40;
    border-radius: 6px;
    background: #c5e99509;
    color: #c5df9a;
    font-size: 12px;
}

/* “帮我选”悬停：提高边框、底色与文字对比。 */
.suggest-btn:hover {
    border-color: #c5df9a70;
    background: #c5e99512;
    color: #e3ffc1;
}

/* 手机端“帮我选”：提高触控高度。 */
@media (max-width: 700px) {
    .suggest-btn {
        min-height: 36px;
        padding: 6px 10px;
        font-size: 12px;
    }
}

/* 已保留区：上下细线围出横向条带。 */
.kept-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    margin: 9px 0 20px;
    border-top: 1px solid #c1dd9a14;
    border-bottom: 1px solid #c1dd9a14;
}

/* 窄屏已保留区：收紧间距与最小高度。 */
@media (max-width: 520px) {
    .kept-row {
        gap: 9px;
        min-height: 45px;
        margin-top: 10px;
        margin-bottom: 18px;
    }
}

/* 已保留标签：盾牌图标与文字横向排列。 */
.kept-label {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 5px;
    color: #a9c29d;
    font-size: clamp(11px, 0.85vw, 12px);
}

/* 手机端已保留标签：固定 11px。 */
@media (max-width: 700px) {
    .kept-label {
        font-size: 11px;
    }
}

/* 窄屏已保留标签：收紧图标间距。 */
@media (max-width: 520px) {
    .kept-label {
        gap: 4px;
    }
}

/* 已保留骰子列表：允许换行，避免超出牌桌。 */
.kept-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 9px;
    padding: 7px 0;
}

/* 窄屏已保留骰子列表：收紧间距。 */
@media (max-width: 520px) {
    .kept-list {
        gap: 5px;
    }
}

/* 每组保留骰：略降不透明度，组间用竖线分隔。 */
.kept-group {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0.75;
}

/* 相邻保留组之间加一条浅绿色分隔线。 */
.kept-group + .kept-group {
    padding-left: 9px;
    border-left: 1px solid #adca8b30;
}

/* 窄屏保留组：收紧间距。 */
@media (max-width: 520px) {
    .kept-group {
        gap: 3px;
    }
}

/* 窄屏相邻保留组：收紧分隔线内边距。 */
@media (max-width: 520px) {
    .kept-group + .kept-group {
        padding-left: 5px;
    }
}

/* 窄屏已保留迷你骰：比速查表的迷你骰再小一号。 */
@media (max-width: 520px) {
    .kept-group .kept-die {
        width: 20px;
        height: 20px;
        padding: 3px;
    }
}

/* 没有保留骰时的提示文字。 */
.kept-empty {
    color: #9fb994;
    font-size: clamp(11px, 0.85vw, 12px);
}

/* 手机端空保留提示：固定 11px。 */
@media (max-width: 700px) {
    .kept-empty {
        font-size: 11px;
    }
}

/* 右侧组合规则提示：推到行尾并禁止换行。 */
.kept-note {
    margin-left: auto;
    color: #a2bb95;
    font-size: 10.5px;
    white-space: nowrap;
}

/* 手机端组合规则提示：固定 11px。 */
@media (max-width: 700px) {
    .kept-note {
        font-size: 11px;
    }
}

/* 极窄屏隐藏组合规则提示。 */
@media (max-width: 374px) {
    .kept-note {
        display: none;
    }
}

/* 交接回合区：固定最小高度，避免按钮出现时牌桌跳动。 */
.handoff-row {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
}

/* 交接按钮：占满整行并居中文字。 */
.handoff-row > button {
    width: 100%;
}

/* 交接按钮的图标与文字居中排列。 */
.handoff-btn {
    justify-content: center;
}

/* 窄屏交接按钮：图标与文字间距固定为 8px。 */
@media (max-width: 520px) {
    .handoff-btn {
        gap: 8px;
    }
}

/* AI 思考提示：点阵与文字横向排列。 */
.ai-thinking {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #b7c99f;
    font-size: clamp(12px, 1vw, 13px);
}

/* 手机端 AI 思考提示：固定 12px。 */
@media (max-width: 700px) {
    .ai-thinking {
        font-size: 12px;
    }
}

/* 思考点容器。 */
.thinking-dots {
    display: flex;
    gap: 4px;
}

/* 单个思考点：品牌绿小圆点，按 blink 关键帧呼吸。 */
.thinking-dots i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-lime);
    animation: blink 1s infinite alternate;
}

/* 第二个点稍晚开始呼吸。 */
.thinking-dots i:nth-child(2) {
    animation-delay: 0.2s;
}

/* 第三个点再晚一些，形成波浪节奏。 */
.thinking-dots i:nth-child(3) {
    animation-delay: 0.4s;
}

/* 牌桌按钮骨架：与弹窗按钮保持一致的尺寸与过渡。 */
.table-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 49px;
    padding: 14px 18px;
    border-width: 1px;
    border-style: solid;
    border-radius: 7px;
    font-size: clamp(12px, 1vw, 13px);
    font-weight: 600;
    transition-property: background, border-color, color, transform, box-shadow;
    transition-duration: 0.2s;
}

/* 手机端牌桌按钮：固定 12px。 */
@media (max-width: 700px) {
    .table-btn {
        font-size: 12px;
    }
}

/* 窄屏牌桌按钮：降低高度并收紧内边距。 */
@media (max-width: 520px) {
    .table-btn {
        gap: 6px;
        min-height: 47px;
        padding: 13px 12px;
    }
}

/* 牌桌主按钮：品牌绿底、深绿文字与向下投影。 */
.table-btn.primary {
    border-color: #d2edaf;
    background: var(--color-lime);
    color: #26351c;
    box-shadow: 0 3px 0 #8ba65e;
}

/* 牌桌主按钮悬停：上浮并扩大投影。 */
.table-btn.primary:enabled:hover {
    transform: translateY(-1px);
    background: #d3f1ac;
    box-shadow:
        0 4px 0 #8ba65e,
        0 8px 20px #07180722;
}

/* 牌桌主按钮按下：回落并收紧阴影。 */
.table-btn.primary:enabled:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #8ba65e;
}

/* 牌桌主按钮禁用：降低饱和度和不透明度。 */
.table-btn.primary:disabled {
    border-color: #8aa66a50;
    background: #638251;
    color: #bdd3ab;
    opacity: 0.65;
    box-shadow: 0 3px 0 #455f36;
}

/* 牌桌次按钮：半透明橄榄绿底与浅绿文字。 */
.table-btn.secondary {
    border-color: #a3c07f54;
    background: #49613b28;
    color: #c4d5b3;
}

/* 牌桌次按钮悬停：边框与底色提亮。 */
.table-btn.secondary:enabled:hover {
    border-color: #a3c07f90;
    background: #77935935;
}

/* 牌桌次按钮禁用：整体压暗。 */
.table-btn.secondary:disabled {
    border-color: #86a06d30;
    background: #94b47808;
    color: #829a72;
    opacity: 0.7;
}

/* 对局结束操作区：三列等宽按钮。 */
.finished-actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}

/* 手机端结束操作区：改为单列，避免按钮文字挤压。 */
@media (max-width: 700px) {
    .finished-actions {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 结束操作按钮：统一居中内容。 */
.finished-actions .table-btn {
    justify-content: center;
}

/* 窄屏结束操作按钮：图标与文字间距固定为 8px。 */
@media (max-width: 520px) {
    .finished-actions .table-btn {
        gap: 8px;
    }
}

/* 掷骰/收分操作区：主按钮略宽于次按钮。 */
.table-actions {
    display: grid;
    grid-template-columns: 1.08fr 1fr;
    gap: 12px;
}

/* 平板掷骰/收分操作区：维持双列布局。 */
@media (max-width: 1000px) {
    .table-actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* 窄屏掷骰/收分操作区：略微调整两列比例并收紧间距。 */
@media (max-width: 520px) {
    .table-actions {
        grid-template-columns: 1.05fr 1fr;
        gap: 10px;
    }
}

/* 掷骰按钮：内容靠左排列，尾部箭头自动靠右。 */
.roll-btn {
    justify-content: flex-start;
    padding-left: 23px;
}

/* 中屏掷骰按钮：收紧左内边距。 */
@media (max-width: 1180px) {
    .roll-btn {
        padding-left: 17px;
    }
}

/* 窄屏掷骰按钮：收紧图标间距与左内边距。 */
@media (max-width: 520px) {
    .roll-btn {
        gap: 8px;
        padding-left: 14px;
    }
}

/* 极窄屏掷骰按钮：缩小字号。 */
@media (max-width: 374px) {
    .roll-btn {
        font-size: 9px;
    }
}

/* 掷骰按钮尾部箭头：推到最右侧。 */
.roll-btn > svg:last-child {
    margin-left: auto;
}

/* 窄屏掷骰按钮首尾图标：仅缩小宽度，保留图标原有高度。 */
@media (max-width: 520px) {
    .roll-btn > svg:first-child {
        width: 18px;
    }

    .roll-btn > svg:last-child {
        width: 15px;
    }
}

/* 剩余骰子数量：与按钮主文字用细线分隔。 */
.roll-count {
    margin-left: 1px;
    padding-left: 9px;
    border-left: 1px solid #3c571e30;
    font-size: clamp(11px, 0.95vw, 12px);
    font-weight: 500;
}

/* 手机端剩余骰子数量：固定 11px。 */
@media (max-width: 700px) {
    .roll-count {
        font-size: 11px;
    }
}

/* 窄屏剩余骰子数量：收紧左内边距。 */
@media (max-width: 520px) {
    .roll-count {
        padding-left: 6px;
    }
}

/* 极窄屏隐藏剩余骰子数量，保证按钮文字完整。 */
@media (max-width: 374px) {
    .roll-count {
        display: none;
    }
}

/* 收分按钮：内容居中。 */
.bank-btn {
    justify-content: center;
}

/* 中屏收分按钮：收紧间距与内边距。 */
@media (max-width: 1180px) {
    .bank-btn {
        gap: 7px;
        padding-right: 10px;
        padding-left: 10px;
        padding-top: 13px;
        padding-bottom: 13px;
    }
}

/* 窄屏收分按钮：允许换行并进一步收紧。 */
@media (max-width: 520px) {
    .bank-btn {
        flex-wrap: wrap;
        gap: 6px;
        padding: 13px 8px;
    }
}

/* 极窄屏收分按钮：缩小字号。 */
@media (max-width: 374px) {
    .bank-btn {
        font-size: 9px;
    }
}

/* 窄屏收分按钮图标：仅缩小宽度，保留图标原有高度。 */
@media (max-width: 520px) {
    .bank-btn > svg {
        width: 15px;
    }
}

/* 收分预览分数：用品牌绿突出本次可入账的分值。 */
.bank-points {
    color: var(--color-lime);
    font-size: clamp(11px, 0.95vw, 12px);
    font-weight: 600;
}

/* 手机端收分预览：固定 11px。 */
@media (max-width: 700px) {
    .bank-points {
        font-size: 11px;
    }
}

/* 底部风险提示：居中显示，弱化但保持可读。 */
.table-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 16px;
    margin-top: 18px;
    color: #a9c29d;
    font-size: 12px;
    line-height: 1.65;
}

/* 手机端风险提示：保持 11.5px，避免重要风险说明过小。 */
@media (max-width: 700px) {
    .table-hint {
        font-size: 11.5px;
    }
}

/* 窄屏风险提示：收紧上方间距。 */
@media (max-width: 520px) {
    .table-hint {
        gap: 5px;
        margin-top: 16px;
    }
}
</style>
