<!-- 根组件只负责组合页面级组件，不实现规则、动画、存档或 AI 决策。 -->
<script setup>
import GameHeader from "./components/GameHeader.vue";
import PageHeading from "./components/PageHeading.vue";
import Scoreboard from "./components/Scoreboard.vue";
import GameTable from "./components/GameTable.vue";
import ActivityList from "./components/ActivityList.vue";
import ScoringSidebar from "./components/ScoringSidebar.vue";
import GameDialogs from "./components/GameDialogs.vue";
import GameFooter from "./components/GameFooter.vue";
import AppIcon from "./components/AppIcon.vue";
import { storeToRefs } from "pinia";
import { useFarkleStore } from "./stores/farkle.js";

// Store 是全应用唯一数据源；storeToRefs 保持状态在模板和组件间响应式同步。
const farkle = useFarkleStore();
const {
    game,
    selected,
    rolling,
    rollingFaces,
    sound,
    modal,
    toast,
    setupMode,
    setupDifficulty,
    setupTargetScore,
    setupEntryScore,
    setupNames,
    targetScore,
    targetInputValid,
    entryInputValid,
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
    winnerLabel,
    round,
    isAi,
} = storeToRefs(farkle);

const {
    format,
    progress,
    difficultyLabels,
    toggleSound,
    toggleDie,
    suggest,
    doRoll,
    doBank,
    nextTurn,
    openSetup,
    selectMode,
    newGame,
    closeDialog,
    ENTRY_SCORE,
} = farkle;
</script>

<template>
    <div class="site-shell">
        <GameHeader :sound="sound" @toggle-sound="toggleSound" @open-rules="modal = 'rules'" />

        <!-- 主内容区：标题、对局主栏与计分提示侧栏。 -->
    <main class="main-content">
            <PageHeading :target-score="targetScore" :format="format" />
            <div class="game-layout">
                <section class="main-column" aria-label="Farkle 对局">
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

                    <ActivityList
                        :history="game.history"
                        :format="format"
                        @open-details="modal = 'activity'"
                    />
                </section>
                <ScoringSidebar :format="format" :entry-score="game.entryScore ?? ENTRY_SCORE" @open-rules="modal = 'rules'" />
            </div>
        </main>

        <!-- 页脚展示只读对局信息。 -->
    <GameFooter :target-score="targetScore" :format="format" />

        <!-- Toast 只提供短暂反馈，不修改对局状态。 -->
    <Transition name="toast">
            <div v-if="toast" class="toast-message" role="status"><AppIcon name="check" :size="15" />{{ toast }}</div>
        </Transition>

        <!-- 弹窗统一接收 modal 状态，并通过事件回传关闭或创建对局。 -->
    <GameDialogs
            :modal="modal"
            :game="game"
            :format="format"
            :winner-label="winnerLabel"
            :setup-mode="setupMode"
            :setup-difficulty="setupDifficulty"
            :setup-target-score="setupTargetScore"
            :setup-entry-score="setupEntryScore"
            :setup-names="setupNames"
            :target-input-valid="targetInputValid"
            :entry-input-valid="entryInputValid"
            @close="closeDialog"
            @new-game="newGame"
            @open-setup="openSetup()"
            @open-activity="modal = 'activity'"
            @update:setup-mode="setupMode = $event"
            @update:setup-difficulty="setupDifficulty = $event"
            @update:setup-target-score="setupTargetScore = $event"
            @update:setup-entry-score="setupEntryScore = $event"
            @update:setup-names="setupNames = $event"
        />
    </div>
</template>
