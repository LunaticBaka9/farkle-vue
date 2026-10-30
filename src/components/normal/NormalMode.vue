<script setup>
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
    <div
        class="col-start-2 col-end-4 grid grid-cols-[minmax(0,1fr)_314px] items-start gap-x-7 gap-y-2 wide:grid-cols-[minmax(0,1fr)_320px] wide:gap-[30px] max-mid:grid-cols-[minmax(0,1fr)_284px] max-mid:gap-[22px] max-tab:col-start-1 max-tab:col-end-auto max-tab:grid-cols-1 max-tab:gap-y-3"
    >
        <PageHeading :target-score="targetScore" :format="format" />

        <section aria-label="Farkle 对局">
            <Scoreboard
                :game="game"
                :target-score="targetScore"
                :format="format"
                :difficulty-labels="difficultyLabels"
                :progress="progress"
                @select-mode="selectMode"
                @open-setup="openSetup()"
            />

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
                @open-activity="modal = 'activity'"
            />

            <ActivityList :history="game.history" :format="format" @open-details="modal = 'activity'" />
        </section>

        <ScoringSidebar :format="format" :entry-score="game.entryScore ?? ENTRY_SCORE" @open-rules="modal = 'rules'" />
    </div>
</template>
