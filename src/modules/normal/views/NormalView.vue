<script setup>
// 普通模式路由页面：只负责组合普通模式组件并管理本模块会话生命周期。
import { onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useNormalGameStore } from "../stores/normalGameStore.js";
import { useUiStore } from "../../../shared/stores/uiStore.js";
import { activateSession, deactivateSession } from "../../../shared/session/moduleSession.js";
import PageHeading from "../components/PageHeading.vue";
import Scoreboard from "../components/Scoreboard.vue";
import GameTable from "../components/GameTable.vue";
import ActivityList from "../components/ActivityList.vue";
import ScoringSidebar from "../components/ScoringSidebar.vue";

const farkle = useNormalGameStore();
const ui = useUiStore();
const {
    game,
    selected,
    rolling,
    rollingFaces,
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
    selectMode,
    startSession,
    stopSession,
    pauseSession,
    resumeSession,
    ENTRY_SCORE,
} = farkle;

// 设置弹窗的默认值来自当前普通对局，提交后仍由普通会话创建新局。
function openSetup() {
    ui.openSetup({
        mode: game.value.mode,
        difficulty: game.value.difficulty,
        targetScore: game.value.targetScore,
        entryScore: game.value.entryScore ?? ENTRY_SCORE,
        names: [game.value.players[0]?.name || "", game.value.players[1]?.name || ""],
    });
}

onMounted(() => {
    activateSession("normal-game", {
        start: startSession,
        stop: stopSession,
        pause: pauseSession,
        resume: resumeSession,
    });
});
onBeforeUnmount(() => deactivateSession("normal-game"));
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
                @open-setup="openSetup" />

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
                @open-setup="openSetup"
                @open-winner="ui.modal = 'winner'"
                @open-activity="ui.modal = 'activity'" />

            <ActivityList :history="game.history" :format="format" @open-details="ui.modal = 'activity'" />
        </section>

        <ScoringSidebar
            :format="format"
            :entry-score="game.entryScore ?? ENTRY_SCORE"
            @open-rules="ui.modal = 'rules'" />
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
