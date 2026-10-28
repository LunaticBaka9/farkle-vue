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
import { useFarkleGame } from "./composables/useFarkleGame.js";

// 对局状态、计算属性和动作统一来自此组合式函数。

// 解构响应式状态和方法后，模板只负责展示与绑定，不维护重复业务副本。
const {
    ENTRY_SCORE,
    format,
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
    setupNames,
    targetScore,
    targetInputValid,
    chosenScore,
    pendingScore,
    validSelection,
    canRollNow,
    canBankNow,
    nextDiceCount,
    nextRisk,
    entryMissing,
    showHandoff,
    progress,
    difficultyLabels,
    headline,
    selectionText,
    winnerLabel,
    round,
    isAi,
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
} = useFarkleGame();
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
                        :entry-score="ENTRY_SCORE"
                        @toggle-die="toggleDie"
                        @suggest="suggest"
                        @roll="doRoll()"
                        @bank="doBank()"
                        @next-turn="nextTurn"
                        @open-setup="openSetup()"
                        @open-winner="modal = 'winner'"
                    />

                    <ActivityList :history="game.history" :format="format" />
                </section>
                <ScoringSidebar :format="format" @open-rules="modal = 'rules'" />
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
            :setup-names="setupNames"
            :target-input-valid="targetInputValid"
            @close="closeDialog"
            @new-game="newGame"
            @open-setup="openSetup()"
            @update:setup-mode="setupMode = $event"
            @update:setup-difficulty="setupDifficulty = $event"
            @update:setup-target-score="setupTargetScore = $event"
            @update:setup-names="setupNames = $event"
        />
    </div>
</template>
