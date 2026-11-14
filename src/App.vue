<!-- 根组件只负责组合页面级组件，不实现规则、动画、存档或 AI 决策。 -->
<script setup>
import GameHeader from "./components/framework/GameHeader.vue";
import GameDialogs from "./components/framework/GameDialogs.vue";
import GameFooter from "./components/framework/GameFooter.vue";
import AppIcon from "./components/framework/AppIcon.vue";
import ModeSwitcher from "./components/framework/ModeSwitcher.vue";
import NormalMode from "./components/normal/NormalMode.vue";
import KingdomMode from "./components/kingdom/KingdomMode.vue";
import KingdomBattle from "./components/kingdom/KingdomBattle.vue";
import AdventureMode from "./components/adventure/AdventureMode.vue";
import { storeToRefs } from "pinia";
import { useFarkleStore } from "./stores/farkle.js";
import { computed } from "vue";
import { usePageMode } from "./composables/usePageMode.js";
import { useKingdomNavigation } from "./composables/useKingdomNavigation.js";

// 页面模式持久化与天国挑战事务由各自 composable 提供，App 只组合页面组件和事件。
const { activeMode, displayMode } = usePageMode();
// modeComponents 将页面模式 ID 映射到对应 Vue 组件；activeModeComponent 根据当前选择动态切换。
const modeComponents = {
    classic: NormalMode,
    kingdom: KingdomMode,
    "kingdom-battle": KingdomBattle,
    adventure: AdventureMode,
};
const activeModeComponent = computed(() => modeComponents[activeMode.value]);

// Store 是全应用唯一数据源；storeToRefs 保持状态在模板和组件间响应式同步。
const farkle = useFarkleStore();
const {
    game,
    sound,
    modal,
    toast,
    toastTone,
    setupMode,
    setupDifficulty,
    setupTargetScore,
    setupEntryScore,
    setupNames,
    targetScore,
    targetInputValid,
    entryInputValid,
    winnerLabel,
} = storeToRefs(farkle);

const { format, toggleSound, openSetup, closeDialog } = farkle;
const {
    opponent: kingdomOpponent,
    resetToken: kingdomResetToken,
    startChallenge: startKingdomChallenge,
    startNewGame,
    leaveBattle: leaveKingdomBattle,
    confirmPlayerReset: confirmKingdomReset,
} = useKingdomNavigation(farkle, activeMode);
</script>

<template>
    <div class="page" :data-mode="activeMode">
        <GameHeader :sound="sound" @toggle-sound="toggleSound" @open-rules="modal = 'rules'" />

        <!-- 主内容区：标题、对局主栏与计分提示侧栏。 -->
        <main class="main">
            <div class="layout">
                <ModeSwitcher :model-value="displayMode" @update:model-value="activeMode = $event" />
                <component
                    :is="activeModeComponent"
                    :opponent="kingdomOpponent"
                    :reset-token="kingdomResetToken"
                    @open-backpack="modal = 'kingdom-backpack'"
                    @open-dice-list="modal = 'kingdom-dice-list'"
                    @reset-player-state="modal = 'kingdom-reset'"
                    @challenge-opponent="startKingdomChallenge"
                    @leave-battle="leaveKingdomBattle" />
            </div>
        </main>

        <!-- 页脚展示只读对局信息。 -->
        <GameFooter :target-score="targetScore" :format="format" />

        <!-- Toast 只提供短暂反馈，不修改对局状态。 -->
        <Transition
            enter-active-class="toast-enter-active"
            enter-from-class="toast-enter-from"
            leave-active-class="toast-leave-active"
            leave-to-class="toast-leave-to">
            <div
                v-if="toast"
                class="app-toast"
                :class="`toast-${toastTone}`"
                :role="toastTone === 'error' ? 'alert' : 'status'">
                <AppIcon
                    :name="toastTone === 'error' ? 'close' : toastTone === 'info' ? 'info' : 'check'"
                    :size="15" />{{ toast }}
            </div>
        </Transition>

        <!-- 弹窗统一接收 modal 状态，并通过事件回传关闭或创建对局。 -->
        <GameDialogs
            :modal="modal"
            :theme="displayMode"
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
            @new-game="startNewGame"
            @open-setup="openSetup()"
            @open-activity="modal = 'activity'"
            @reset-kingdom-state="confirmKingdomReset"
            @update:setup-mode="setupMode = $event"
            @update:setup-difficulty="setupDifficulty = $event"
            @update:setup-target-score="setupTargetScore = $event"
            @update:setup-entry-score="setupEntryScore = $event"
            @update:setup-names="setupNames = $event" />
    </div>
</template>

<style scoped>
/* 页面外壳：限制最大宽度并居中，左右留白随屏幕宽度递减。 */
.page {
    width: 100%;
    max-width: 90rem;
    margin-right: auto;
    margin-left: auto;
    padding-right: 64px;
    padding-left: 64px;
    background-color: var(--page-bg);
    background-image: var(--page-glow);
}

/* 超大屏页面：左右留白增加到 70px。 */
@media (min-width: 1400px) {
    .page {
        padding-right: 70px;
        padding-left: 70px;
    }
}

/* 中屏页面：左右留白收窄到 36px。 */
@media (max-width: 1180px) {
    .page {
        padding-right: 36px;
        padding-left: 36px;
    }
}

/* 平板页面：左右留白收窄到 30px。 */
@media (max-width: 1000px) {
    .page {
        padding-right: 30px;
        padding-left: 30px;
    }
}

/* 手机页面：左右留白收窄到 23px。 */
@media (max-width: 700px) {
    .page {
        padding-right: 23px;
        padding-left: 23px;
    }
}

/* 窄屏页面：左右留白收窄到 17px。 */
@media (max-width: 520px) {
    .page {
        padding-right: 17px;
        padding-left: 17px;
    }
}

/* 极窄屏页面：左右留白收窄到 12px。 */
@media (max-width: 374px) {
    .page {
        padding-right: 12px;
        padding-left: 12px;
    }
}

/* 主内容区：与页头保持固定上间距。 */
.main {
    padding-top: 39px;
}

/* 手机端主内容区：略减上间距。 */
@media (max-width: 700px) {
    .main {
        padding-top: 29px;
    }
}

/* 主布局：左侧模式导航、中间对局区、右侧提示侧栏。 */
.layout {
    display: grid;
    grid-template-columns: 82px minmax(0, 1fr) 314px;
    align-items: start;
    gap: 28px;
}

/* 超大屏主布局：加宽右侧栏与列间距。 */
@media (min-width: 1400px) {
    .layout {
        grid-template-columns: 82px minmax(0, 1fr) 320px;
        gap: 30px;
    }
}

/* 中屏主布局：收窄右侧栏与列间距。 */
@media (max-width: 1180px) {
    .layout {
        grid-template-columns: 82px minmax(0, 1fr) 284px;
        gap: 22px;
    }
}

/* 平板主布局：改为单列，模式导航移到内容上方。 */
@media (max-width: 1000px) {
    .layout {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 页面 toast：固定在视口底部中央，作为短暂操作反馈。 */
.app-toast {
    position: fixed;
    bottom: calc(28px + env(safe-area-inset-bottom, 0px));
    left: 50%;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 9px;
    width: max-content;
    max-width: calc(100vw - 32px);
    padding: 13px 19px;
    border: 1px solid #c5e99555;
    border-radius: 9px;
    background: #253223f5;
    color: #d4e8bb;
    font-size: clamp(12px, 1vw, 13px);
    line-height: 1.7;
    box-shadow: 0 8px 30px #0005;
    transform: translateX(-50%);
    /* Toast 只做反馈，不拦截下方按钮的点击。 */
    pointer-events: none;
}

/* 信息类 toast：偏冷的深色底，和成功提示区分。 */
.app-toast.toast-info {
    border-color: #a9c2d155;
    background: #1e2726f5;
    color: #d3e2dd;
}

/* 错误类 toast：暖棕底与浅橙文字，并使用 alert 语义。 */
.app-toast.toast-error {
    border-color: #e6a38555;
    background: #2a201bf5;
    color: #f0cbb5;
}

/* 手机端 toast：固定 12px，并避开底部安全区。 */
@media (max-width: 700px) {
    .app-toast {
        bottom: calc(20px + env(safe-area-inset-bottom, 0px));
        font-size: 12px;
    }
}

/* Toast 进出场过渡：只动画透明度与底部位置。 */
.toast-enter-active,
.toast-leave-active {
    transition-property: opacity, bottom;
    transition-duration: 0.2s;
}

/* Toast 进入前与离场后：透明并下沉 8px。 */
.toast-enter-from,
.toast-leave-to {
    bottom: 20px;
    opacity: 0;
}
</style>
