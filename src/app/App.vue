<!-- 应用外壳：只组合路由页面、公共头尾、弹窗和模式切换确认。 -->
<script setup>
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import GameHeader from "../shared/components/GameHeader.vue";
import GameFooter from "../shared/components/GameFooter.vue";
import ModeSwitcher from "../shared/components/ModeSwitcher.vue";
import AppIcon from "../shared/components/AppIcon.vue";
import GameDialogs from "../shared/components/dialogs/GameDialogs.vue";
import SwitchModeDialog from "./components/SwitchModeDialog.vue";
import { useUiStore } from "../shared/stores/uiStore.js";
import { useKingdomStore } from "../modules/kingdom/stores/kingdomStore.js";
import { format } from "../shared/utils/format.js";
import { ENTRY_SCORE } from "../shared/game/scoring.js";
import { stopActiveSession } from "../shared/session/moduleSession.js";
import { switchRequest } from "../shared/session/switchRequest.js";
import { useActiveGameSession } from "./composables/useActiveGameSession.js";
import { useRouteTheme } from "./composables/useRouteTheme.js";
import { useSwitchNavigation } from "./composables/useSwitchNavigation.js";

const route = useRoute();
const router = useRouter();
const ui = useUiStore();
const kingdom = useKingdomStore();
const { toast, toastTone } = storeToRefs(ui);

const publicMode = computed(() => route.meta.publicMode ?? "classic");
const theme = computed(() => route.meta.theme ?? "classic");

const { activeSession, game, winnerLabel, footerTargetScore } = useActiveGameSession(route);
const { targetLabel, requestModeChange, confirmSwitch, cancelSwitch, installNavigationGuard } =
    useSwitchNavigation({ route, router, ui, kingdom });
const { cleanupTheme } = useRouteTheme({ theme, publicMode });

let removeGuard = null;

function handleNewGame() {
    activeSession.value?.newGame();
}

// 设置弹窗默认带入当前活动对局的参数。
function openSetup() {
    const current = activeSession.value;
    if (!current) return;
    ui.openSetup({
        mode: current.game.mode,
        difficulty: current.game.difficulty,
        targetScore: current.game.targetScore,
        entryScore: current.game.entryScore ?? ENTRY_SCORE,
        names: [current.game.players[0]?.name || "", current.game.players[1]?.name || ""],
    });
}

onMounted(() => {
    removeGuard = installNavigationGuard();
});
onBeforeUnmount(() => {
    removeGuard?.();
    stopActiveSession();
    ui.disposeAudio();
    cleanupTheme();
});
</script>

<template>
    <div class="page" :data-mode="theme">
        <GameHeader :sound="ui.sound" @toggle-sound="ui.toggleSound" @open-rules="ui.modal = 'rules'" />

        <main class="main">
            <div class="layout">
                <ModeSwitcher :model-value="publicMode" @update:model-value="requestModeChange" />
                <RouterView />
            </div>
        </main>

        <GameFooter :target-score="footerTargetScore" :format="format" />

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

        <GameDialogs
            :modal="ui.modal"
            :theme="theme"
            :game="game"
            :format="format"
            :winner-label="winnerLabel"
            :setup-mode="ui.setupMode"
            :setup-difficulty="ui.setupDifficulty"
            :setup-target-score="ui.setupTargetScore"
            :setup-entry-score="ui.setupEntryScore"
            :setup-names="ui.setupNames"
            :target-input-valid="ui.targetInputValid"
            :entry-input-valid="ui.entryInputValid"
            @close="ui.closeDialog"
            @new-game="handleNewGame"
            @open-setup="openSetup"
            @open-activity="ui.modal = 'activity'"
            @update:setup-mode="ui.setupMode = $event"
            @update:setup-difficulty="ui.setupDifficulty = $event"
            @update:setup-target-score="ui.setupTargetScore = $event"
            @update:setup-entry-score="ui.setupEntryScore = $event"
            @update:setup-names="ui.setupNames = $event" />

        <SwitchModeDialog
            :open="switchRequest.open"
            :theme="theme"
            :target-label="targetLabel"
            :message="switchRequest.message"
            @confirm="confirmSwitch"
            @cancel="cancelSwitch" />
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
