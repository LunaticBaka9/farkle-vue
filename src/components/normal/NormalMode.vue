<script setup>
// 常规模式由 App.vue 动态挂载；本层把 Pinia 对局状态传给牌桌、记分板和侧栏。
import { storeToRefs } from "pinia";
import { useFarkleStore } from "../../stores/farkle.js";
import PageHeading from "../framework/PageHeading.vue";
import Scoreboard from "./Scoreboard.vue";
import GameTable from "./GameTable.vue";
import ActivityList from "../framework/ActivityList.vue";
import ScoringSidebar from "../framework/ScoringSidebar.vue";

const farkle = useFarkleStore();
// refs 保持 store 中的对局、动画和表单状态响应式；actions 是直接调用的 store 方法集合。
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
    nextRisk,
    entryMissing,
    showHandoff,
    headline,
    selectionText,
    round,
    isAi,
} = storeToRefs(farkle);

const {
    format,
    progress,
    difficultyLabels,
    toggleDie,
    suggest,
    doRoll,
    doBank,
    nextTurn,
    openSetup,
    selectMode,
    ENTRY_SCORE,
} = farkle;
</script>

<template>
    <div class="normal-layout">
        <PageHeading :target-score="targetScore" :format="format" />

        <section aria-label="Farkle 对局">
            <Scoreboard
                :game="game"
                :target-score="targetScore"
                :format="format"
                :difficulty-labels="difficultyLabels"
                :progress="progress"
                @select-mode="selectMode"
                @open-setup="openSetup()" />

            <GameTable
                :game="game"
                :format="format"
                :round="round"
                :selected="selected"
                :rolling="rolling"
                :rolling-faces="rollingFaces"
                :is-ai="isAi"
                :headline="headline"
                :selection-text="selectionText"
                :chosen-score="chosenScore"
                :pending-score="pendingScore"
                :valid-selection="validSelection"
                :can-roll-now="canRollNow"
                :can-bank-now="canBankNow"
                :next-dice-count="nextDiceCount"
                :next-risk="nextRisk"
                :entry-missing="entryMissing"
                :show-handoff="showHandoff"
                :entry-score="game.entryScore ?? ENTRY_SCORE"
                @toggle-die="toggleDie"
                @suggest="suggest"
                @roll="doRoll()"
                @bank="doBank()"
                @next-turn="nextTurn"
                @open-setup="openSetup()"
                @open-winner="modal = 'winner'"
                @open-activity="modal = 'activity'" />

            <ActivityList :history="game.history" :format="format" @open-details="modal = 'activity'" />
        </section>

        <ScoringSidebar :format="format" :entry-score="game.entryScore ?? ENTRY_SCORE" @open-rules="modal = 'rules'" />
    </div>
</template>

<style scoped>
/* 普通模式主布局：左侧对局区、右侧计分侧栏，标题横跨两列。 */
.normal-layout {
    display: grid;
    grid-column: 2 / 4;
    grid-template-columns: minmax(0, 1fr) 314px;
    align-items: start;
    column-gap: 28px;
    row-gap: 8px;
}

/* 超大屏：加宽右侧侧栏与列间距。 */
@media (min-width: 1400px) {
    .normal-layout {
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 30px;
    }
}

/* 中屏：收窄右侧侧栏与列间距。 */
@media (max-width: 1180px) {
    .normal-layout {
        grid-template-columns: minmax(0, 1fr) 284px;
        gap: 22px;
    }
}

/* 平板及以下：改为单列，对局区与侧栏上下排列。 */
@media (max-width: 1000px) {
    .normal-layout {
        grid-column: 1 / -1;
        grid-template-columns: minmax(0, 1fr);
        row-gap: 12px;
    }
}
</style>
