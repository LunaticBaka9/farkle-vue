<script setup>
// App.vue 在 KingdomMode 发起挑战后挂载本页，并通过 opponent prop 提供挑战者资料。
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useFarkleStore } from "../../stores/farkle.js";
import AppIcon from "../framework/AppIcon.vue";
import Die from "../framework/Die.vue";
// 与商店共享装备目录和存档读取方法，避免牌桌维护第二份商品映射。
import { KINGDOM_EQUIPMENT } from "../../game/kingdom/items.js";
import { restoreKingdomState } from "../../game/kingdom/kingdomStorage.js";

const props = defineProps({ opponent: { type: Object, default: null } });
const emit = defineEmits(["leaveBattle"]);
const farkle = useFarkleStore();
const {
    game,
    selected,
    rolling,
    rollingFaces,
    modal,
    targetScore,
    chosenScore,
    pendingScore,
    validSelection,
    canRollNow,
    canBankNow,
    nextDiceCount,
    showHandoff,
    headline,
    selectionText,
    round,
    isAi,
} = storeToRefs(farkle);
const { format, progress, difficultyLabels, toggleDie, suggest, doRoll, doBank, nextTurn, openSetup } = farkle;

// 对战页面挂载时读取玩家收藏，并以商店目录作为装备名称和图标的数据源。
const inventory = ref(restoreKingdomState().ownedIds);
const equippedItems = computed(() =>
    inventory.value
        .filter((id) => KINGDOM_EQUIPMENT.item[id])
        .map((id) => KINGDOM_EQUIPMENT.item[id])
        .slice(0, 2),
);
const equippedDice = computed(() =>
    inventory.value
        .filter((id) => KINGDOM_EQUIPMENT.dice[id])
        .map((id) => ({ id, ...KINGDOM_EQUIPMENT.dice[id] }))
        .slice(0, 1),
);
const battleHeadline = computed(() => {
    const text = headline.value;
    if (props.opponent?.name && text.includes("NOVA")) {
        return text.replace("NOVA", props.opponent.name);
    }
    return text;
});
</script>

<template>
    <div class="battle-layout">
        <section class="battle-heading">
            <div>
                <span class="battle-eyebrow">
                    <span class="battle-dot"></span>
                    KINGDOM CHALLENGE
                </span>
                <h1 class="battle-title">天国对战桌</h1>
                <p class="battle-opponent">{{ opponent?.name || "天国骑士" }} · {{ opponent?.title || "传奇对手" }}</p>
            </div>
            <button type="button" class="battle-leave" @click="emit('leaveBattle')">返回天国</button>
        </section>

        <section aria-label="天国模式对局">
            <div class="battle-players">
                <article
                    v-for="(player, index) in game.players"
                    :key="player.name"
                    class="battle-player"
                    :class="{ active: game.active === index && game.phase !== 'finished' }">
                    <div class="battle-player-head">
                        <span class="battle-avatar"
                            ><AppIcon :name="index === 1 ? props.opponent?.icon || 'bot' : 'user'" :size="19"
                        /></span>
                        <div>
                            <h2 class="battle-player-name">{{ player.name }}</h2>
                            <span class="battle-player-role">{{
                                index === 1 ? difficultyLabels[game.difficulty] + "对手" : "挑战者"
                            }}</span>
                        </div>
                    </div>
                    <div class="battle-score">
                        {{ format(player.score)
                        }}<span class="battle-target">/ {{ format(targetScore) }}</span>
                    </div>
                    <div class="battle-progress">
                        <div class="battle-progress-fill" :style="{ width: progress(player.score) }"></div>
                    </div>
                </article>
            </div>

            <section class="battle-table" aria-label="天国骰子牌桌">
                <div class="battle-meta">
                    <span>第 {{ String(round).padStart(2, "0") }} 轮</span
                    ><span class="battle-wager">{{
                        opponent?.wager ? `挑战金 ${opponent.wager}` : "KINGDOM TABLE"
                    }}</span>
                </div>
                <div class="battle-score-block">
                    <span class="battle-kicker">{{
                        game.phase === "farkle" ? "FARKLE" : "本回合累计"
                    }}</span>
                    <div class="battle-turn-score">
                        {{ game.phase === "farkle" ? "FARKLE!" : format(game.turnScore) }}
                    </div>
                    <p class="battle-headline" aria-live="polite">{{ battleHeadline }}</p>
                </div>
                <div class="battle-dice-row">
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
                            @select="toggleDie(die.id)"
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
                <div class="battle-selection">
                    {{ selectionText
                    }}<span v-if="chosenScore" class="battle-chosen">+{{ format(chosenScore) }} 分</span>
                    <button
                        v-if="game.phase === 'selecting' && !isAi && !rolling"
                        class="battle-suggest"
                        @click="suggest">
                        帮我选
                    </button>
                </div>
                <div v-if="showHandoff" class="battle-handoff">
                    <button
                        v-if="game.mode !== 'ai'"
                        class="battle-btn battle-btn-primary battle-handoff-btn"
                        @click="nextTurn">
                        交给下一位
                    </button>
                    <span v-else class="battle-thinking">正在交接回合</span>
                </div>
                <div v-else-if="game.phase === 'finished'" class="battle-finished">
                    <button class="battle-btn battle-btn-primary" @click="openSetup">再来一局</button>
                    <button class="battle-btn battle-btn-secondary" @click="modal = 'winner'">查看结果</button>
                </div>
                <div v-else class="battle-actions">
                    <button
                        class="battle-btn battle-btn-primary battle-roll-btn"
                        :disabled="!canRollNow"
                        @click="doRoll()">
                        <AppIcon name="dice" :size="19" />{{
                            rolling
                                ? "掷骰中…"
                                : isAi
                                  ? "对手思考中…"
                                  : game.phase === "ready"
                                    ? "掷出骰子"
                                    : "继续掷骰"
                        }}
                    </button>
                    <button
                        class="battle-btn battle-btn-secondary battle-bank-btn"
                        :disabled="!canBankNow"
                        @click="doBank()">
                        <AppIcon name="bank" :size="17" />收分<strong v-if="canBankNow" class="battle-bank-points"
                            >+{{ format(pendingScore) }}</strong
                        >
                    </button>
                </div>

            </section>
        </section>

        <aside class="battle-rail" aria-label="对战信息与装备">
            <section class="battle-rail-card">
                <div class="battle-rail-head">
                    <span class="battle-rail-eyebrow">CHALLENGER</span>
                    <span class="battle-rail-status">挑战中</span>
                </div>
                <div class="battle-rail-identity">
                    <span class="battle-rail-avatar"
                        ><AppIcon :name="props.opponent?.icon || 'bot'" :size="22"
                    /></span>
                    <div>
                        <strong class="battle-rail-name">{{ opponent?.name || "天国骑士" }}</strong>
                        <small class="battle-rail-title">{{ opponent?.title || "传奇对手" }}</small>
                    </div>
                </div>
                <dl class="battle-rail-stats">
                    <div>
                        <dt>目标分数</dt>
                        <dd>{{ format(targetScore) }}</dd>
                    </div>
                    <div>
                        <dt>挑战金</dt>
                        <dd>{{ opponent?.wager ? `${opponent.wager} 金币` : "无" }}</dd>
                    </div>
                </dl>
            </section>

            <section class="battle-rail-card battle-equipment">
                <div class="battle-equip-title">
                    <span>随身装备</span><span class="battle-equip-sub">TABLE EQUIPMENT</span>
                </div>
                <div class="battle-equip-grid">
                    <div class="battle-equip-box">
                        <span class="battle-equip-label">背包</span>
                        <template v-if="equippedItems.length"
                            ><span
                                v-for="item in equippedItems"
                                :key="item.name"
                                class="battle-equip-item"
                                ><AppIcon :name="item.icon" :size="14" />{{ item.name }}</span
                            ></template
                        >
                        <span v-else class="battle-equip-empty">暂无物品</span>
                    </div>
                    <div class="battle-equip-box">
                        <span class="battle-equip-label">骰子</span>
                        <template v-if="equippedDice.length"
                            ><span
                                v-for="dice in equippedDice"
                                :key="dice.id"
                                class="battle-equip-item dice"
                                ><AppIcon :name="dice.icon" :size="15" />{{ dice.name }}</span
                            ></template
                        >
                        <span v-else class="battle-equip-empty">标准骰子</span>
                    </div>
                </div>
            </section>
        </aside>
    </div>
</template>

<style scoped>
/* 对战页主布局：左侧对战区、右侧装备侧栏，标题横跨两列。 */
.battle-layout {
    display: grid;
    grid-column: 2 / 4;
    grid-template-columns: minmax(0, 1fr) 314px;
    align-items: start;
    column-gap: 28px;
    row-gap: 8px;
}

/* 超大屏对战布局：加宽右侧栏与列间距。 */
@media (min-width: 1400px) {
    .battle-layout {
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 30px;
    }
}

/* 中屏对战布局：收窄右侧栏与列间距。 */
@media (max-width: 1180px) {
    .battle-layout {
        grid-template-columns: minmax(0, 1fr) 284px;
        gap: 22px;
    }
}

/* 平板及以下对战布局：改为单列。 */
@media (max-width: 1000px) {
    .battle-layout {
        grid-column: 1 / -1;
        grid-template-columns: minmax(0, 1fr);
        row-gap: 12px;
    }
}

/* 对战页标题区：横跨整行，底部用金色细线与牌桌分隔。 */
.battle-heading {
    display: flex;
    grid-column: 1 / -1;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    padding-bottom: 22px;
    border-bottom: 1px solid #b99b6122;
}

/* 对战页眉题：金色光点加英文小字。 */
.battle-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #c4b27d;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 2px;
}

/* 眉题光点：金色并带光晕。 */
.battle-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #d8c58b;
    box-shadow: 0 0 9px #d8c58b55;
}

/* 对战页标题：暖白色大字。 */
.battle-title {
    margin-top: 9px;
    color: #f1ebd7;
    font-size: clamp(27px, 2.65vw, 38px);
    font-weight: 650;
    line-height: 1.4;
}

/* 对手名称与称号：暖灰色小字。 */
.battle-opponent {
    margin-top: 8px;
    color: #9b947a;
    font-size: 14px;
}

/* 返回天国按钮：暗金描边与深色底。 */
.battle-leave {
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid #b99b6155;
    border-radius: 8px;
    background: #211d12;
    color: #d8cca8;
    font-size: 12px;
}

/* 返回天国按钮悬停：边框提亮。 */
.battle-leave:hover {
    border-color: #d8c58b;
}

/* 双方玩家卡片区：双列等宽。 */
.battle-players {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 19px;
}

/* 玩家卡片：默认暗棕底与金色描边。 */
.battle-player {
    padding: 16px 18px;
    border: 1px solid #b99b6128;
    border-radius: 10px;
    background: #211e16;
}

/* 当前行动玩家卡片：更亮的描边与暖棕底。 */
.battle-player.active {
    border-color: #d6bd7866;
    background: #332b19;
}

/* 玩家卡片头部：头像与身份横向排列。 */
.battle-player-head {
    display: flex;
    align-items: center;
    gap: 9px;
}

/* 玩家头像：暗金圆形底。 */
.battle-avatar {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 1px solid #b99b6150;
    border-radius: 50%;
    background: #b99b6112;
    color: #e1d09b;
}

/* 玩家名字：暖白半粗体。 */
.battle-player-name {
    color: #eee6ce;
    font-size: 14px;
    font-weight: 600;
}

/* 玩家角色：难度对手或“挑战者”。 */
.battle-player-role {
    color: #978b69;
    font-size: 9px;
    letter-spacing: 1px;
}

/* 玩家总分：大号等宽数字。 */
.battle-score {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 16px;
    color: #f1ebd7;
    font-family: var(--font-numeric);
    font-size: 33px;
}

/* 目标分数：更小、更灰的对照值。 */
.battle-target {
    color: #958b70;
    font-size: 10px;
}

/* 进度条轨道：极细的暗金底。 */
.battle-progress {
    height: 3px;
    margin-top: 12px;
    overflow: hidden;
    border-radius: 9999px;
    background: #d9c88c18;
}

/* 进度条填充：宽度由内联 style 控制并平滑过渡。 */
.battle-progress-fill {
    height: 100%;
    background: #d4c184;
    transition: width 0.7s;
}

/* 对战牌桌：暖棕径向渐变底与暗金描边。 */
.battle-table {
    position: relative;
    padding: 20px 30px 18px;
    overflow: hidden;
    border: 1px solid #c7ad706e;
    border-radius: 14px;
    background: radial-gradient(ellipse at 50% 28%, #50432b, #302918 70%, #211d13);
    box-shadow:
        inset 0 0 70px #08070466,
        0 16px 30px #0003;
}

/* 窄屏对战牌桌：收紧左右内边距。 */
@media (max-width: 520px) {
    .battle-table {
        padding-right: 15px;
        padding-left: 15px;
    }
}

/* 牌桌顶部信息：轮次与挑战金两端对齐。 */
.battle-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #c8b985;
    font-size: 10px;
    letter-spacing: 1.5px;
}

/* 挑战金文字：比轮次更暗。 */
.battle-wager {
    color: #c8b985;
}

/* 本回合得分区：上方留白并居中。 */
.battle-score-block {
    padding-top: 24px;
    text-align: center;
}

/* 得分区小标题：金色宽字距。 */
.battle-kicker {
    color: #c8b985;
    font-size: 11px;
    letter-spacing: 2px;
}

/* 本回合大号得分：米白色等宽数字。 */
.battle-turn-score {
    margin-top: 8px;
    color: #f5edcf;
    font-family: var(--font-numeric);
    font-size: 52px;
    line-height: 1.2;
}

/* 得分区状态文案：暖灰色小字，预留固定高度避免跳动。 */
.battle-headline {
    min-height: 18px;
    margin-top: 8px;
    color: #c8b985;
    font-size: 12px;
}

/* 骰子行：六颗骰子居中并预留固定高度。 */
.battle-dice-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    min-height: 118px;
    padding: 22px 0;
}

/* 窄屏骰子行：缩小高度与间距。 */
@media (max-width: 520px) {
    .battle-dice-row {
        gap: 10px;
        min-height: 100px;
    }
}

/* 选骰提示行：居中文字，底部留出间距。 */
.battle-selection {
    min-height: 28px;
    margin-bottom: 14px;
    color: #c8b985;
    font-size: 12px;
    text-align: center;
}

/* 当前所选组合得分：金色加粗。 */
.battle-chosen {
    margin-left: 8px;
    color: #dfcf91;
    font-weight: 600;
}

/* “帮我选”按钮：金色下划线式文字按钮。 */
.battle-suggest {
    margin-left: 8px;
    border: 0;
    border-bottom: 1px solid #d8c58b55;
    background: transparent;
    color: #dfcf91;
    font-size: 11px;
}

/* 交接回合区：居中显示按钮或提示。 */
.battle-handoff {
    display: grid;
    place-items: center;
    min-height: 49px;
}

/* 交接按钮：占满整行。 */
.battle-handoff-btn {
    width: 100%;
}

/* AI 交接提示：暖金色小字。 */
.battle-thinking {
    color: #c8b985;
    font-size: 12px;
}

/* 对局结束操作区：双列按钮。 */
.battle-finished {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

/* 手机端结束操作区：改为单列。 */
@media (max-width: 700px) {
    .battle-finished {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 掷骰/收分操作区：主按钮略宽。 */
.battle-actions {
    display: grid;
    grid-template-columns: 1.08fr 1fr;
    gap: 10px;
}

/* 对战按钮骨架：居中内容并保持统一高度。 */
.battle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 49px;
    border-width: 1px;
    border-style: solid;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
}

/* 对战主按钮：金色底与深棕文字。 */
.battle-btn-primary {
    border-color: #dfd29d;
    background: #d6c484;
    color: #3a321f;
}

/* 对战主按钮禁用：整体半透明。 */
.battle-btn-primary:disabled {
    opacity: 0.5;
}

/* 对战次按钮：深棕底与米色文字。 */
.battle-btn-secondary {
    border-color: #b99b6155;
    background: #493f27;
    color: #e7ddb9;
}

/* 对战次按钮禁用：更低的透明度。 */
.battle-btn-secondary:disabled {
    opacity: 0.45;
}

/* 收分预览：沿用按钮文字颜色并加粗。 */
.battle-bank-points {
    font-weight: bolder;
}

/* 右侧信息栏：对手摘要与随身装备上下排列。 */
.battle-rail {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* 平板及以下：右侧栏改为两列摘要，放在牌桌下方。 */
@media (max-width: 1000px) {
    .battle-rail {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* 手机端：右侧栏恢复单列。 */
@media (max-width: 700px) {
    .battle-rail {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 信息栏卡片：深棕底、金色细边与顶部内高光。 */
.battle-rail-card {
    padding: 16px;
    border: 1px solid #b99b6138;
    border-radius: 10px;
    background: #211e16;
    box-shadow: inset 0 1px 0 #dfcf9a12;
}

/* 信息栏卡片标题行：英文眉题与挑战状态两端对齐。 */
.battle-rail-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

/* 信息栏英文眉题：小号金色宽字距。 */
.battle-rail-eyebrow {
    color: #b7aa83;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
}

/* 挑战状态徽标：圆角金色描边。 */
.battle-rail-status {
    padding: 3px 8px;
    border: 1px solid #b99b6155;
    border-radius: 9999px;
    color: #d8c58b;
    font-size: 9px;
}

/* 对手身份行：头像与名字横向排列。 */
.battle-rail-identity {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
}

/* 对手头像：暗金圆形底。 */
.battle-rail-avatar {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 38px;
    height: 38px;
    border: 1px solid #b99b6150;
    border-radius: 50%;
    background: #b99b6112;
    color: #e1d09b;
}

/* 对手名字：暖白色半粗体。 */
.battle-rail-name {
    display: block;
    color: #eee6ce;
    font-size: 15px;
    font-weight: 600;
}

/* 对手称号：暖灰色小字。 */
.battle-rail-title {
    display: block;
    margin-top: 3px;
    color: #a89b7a;
    font-size: 10px;
    letter-spacing: 0.6px;
}

/* 对局数据：目标分数与挑战金。 */
.battle-rail-stats {
    display: grid;
    gap: 8px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #b99b6120;
}

/* 单条对局数据：标签与数值两端对齐。 */
.battle-rail-stats > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}

/* 对局数据标签。 */
.battle-rail-stats dt {
    color: #a89b7a;
    font-size: 10px;
}

/* 对局数据数值：金色等宽数字。 */
.battle-rail-stats dd {
    color: #e7ddb9;
    font-family: var(--font-numeric);
    font-size: 12px;
}

/* 装备区标题行：中文标题与英文副标题两端对齐。 */
.battle-equip-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #c4b27d;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
}

/* 装备区英文副标题：更暗、更紧凑。 */
.battle-equip-sub {
    color: #a9966c;
    letter-spacing: 0.5px;
}

/* 装备栏网格：右侧栏内上下排列，避免横向挤压。 */
.battle-equip-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
}

/* 装备栏容器：暗色底与金色细边。 */
.battle-equip-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 52px;
    padding: 10px 12px;
    border: 1px solid #b99b6138;
    border-radius: 8px;
    background: #17150f66;
}

/* 装备栏标签：更小、更暗的说明字。 */
.battle-equip-label {
    color: #b7aa83;
    font-size: 10px;
}

/* 已装备物品：浅金底的小胶囊。 */
.battle-equip-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 8px;
    border-radius: 6px;
    background: #b99b6117;
    color: #dfd4ad;
    font-size: 11px;
}

/* 骰子装备：略宽的间距与更小的上下内边距。 */
.battle-equip-item.dice {
    gap: 7px;
    padding: 6px 8px;
}

/* 空装备提示：暗金色小字。 */
.battle-equip-empty {
    color: #b7aa83;
    font-size: 11px;
}
</style>
