<!-- 根组件只负责组合页面级组件，不实现规则、动画、存档或 AI 决策。 -->
<script setup>
import GameHeader from "./components/framework/GameHeader.vue";
import GameDialogs from "./components/framework/GameDialogs.vue";
import GameFooter from "./components/framework/GameFooter.vue";
import AppIcon from "./components/framework/AppIcon.vue";
import ModeSwitcher from "./components/framework/ModeSwitcher.vue";
import NormalMode from "./components/normal/NormalMode.vue";
import KingdomMode from "./components/kingdom/KingdomMode.vue";
import AdventureMode from "./components/adventure/AdventureMode.vue";
import { storeToRefs } from "pinia";
import { useFarkleStore } from "./stores/farkle.js";
import { computed, onBeforeUnmount, ref, watch } from "vue";

const PAGE_MODE_STORAGE_KEY = "farkle.pageMode.v1";
// pageModes 限定页面模式的合法取值，避免 localStorage 中的损坏数据切换到不存在的组件。
const pageModes = ["classic", "kingdom", "adventure"];

function restorePageMode() {
    try {
        const storedMode = localStorage.getItem(PAGE_MODE_STORAGE_KEY);
        return pageModes.includes(storedMode) ? storedMode : "classic";
    } catch {
        return "classic";
    }
}

const activeMode = ref(restorePageMode());
// modeComponents 将页面模式 ID 映射到对应 Vue 组件；activeModeComponent 根据当前选择动态切换。
const modeComponents = {
    classic: NormalMode,
    kingdom: KingdomMode,
    adventure: AdventureMode,
};
const activeModeComponent = computed(() => modeComponents[activeMode.value]);

watch(
    activeMode,
    (mode) => {
        document.documentElement.dataset.mode = mode;
        document.body.dataset.mode = mode;
        try {
            localStorage.setItem(PAGE_MODE_STORAGE_KEY, mode);
        } catch {
            /* playable without storage */
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    delete document.documentElement.dataset.mode;
    delete document.body.dataset.mode;
});

// Store 是全应用唯一数据源；storeToRefs 保持状态在模板和组件间响应式同步。
const farkle = useFarkleStore();
const {
    game,
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
    winnerLabel,
} = storeToRefs(farkle);

const { format, toggleSound, openSetup, newGame, closeDialog } = farkle;

function startKingdomChallenge(opponent) {
    activeMode.value = "classic";
    setupMode.value = "ai";
    setupDifficulty.value = opponent.difficulty;
    setupTargetScore.value = opponent.target;
    modal.value = "setup";
}
</script>

<template>
    <div
        class="mx-auto max-w-360 px-16 wide:px-[70px] data-[mode=kingdom]:bg-[#15130e] data-[mode=kingdom]:bg-[radial-gradient(ellipse_at_48%_-18%,#6b4a2560,transparent_63%)] data-[mode=adventure]:bg-[#111911] data-[mode=adventure]:bg-[radial-gradient(ellipse_at_48%_-18%,#596d445c,transparent_63%)] max-mid:px-9 max-tab:px-[30px] max-mob:px-[23px] max-nar:px-[17px] max-tiny:px-3"
        :data-mode="activeMode"
    >
        <GameHeader :sound="sound" @toggle-sound="toggleSound" @open-rules="modal = 'rules'" />

        <!-- 主内容区：标题、对局主栏与计分提示侧栏。 -->
        <main class="pt-[39px] max-mob:pt-[29px]">
            <div
                class="grid grid-cols-[82px_minmax(0,1fr)_314px] items-start gap-7 wide:grid-cols-[82px_minmax(0,1fr)_320px] wide:gap-[30px] max-mid:grid-cols-[82px_minmax(0,1fr)_284px] max-mid:gap-[22px] max-tab:grid-cols-1"
            >
                <ModeSwitcher v-model="activeMode" />
                <component
                    :is="activeModeComponent"
                    @open-backpack="modal = 'kingdom-backpack'"
                    @open-dice-list="modal = 'kingdom-dice-list'"
                    @challenge-opponent="startKingdomChallenge"
                />
            </div>
        </main>

        <!-- 页脚展示只读对局信息。 -->
        <GameFooter :target-score="targetScore" :format="format" />

        <!-- Toast 只提供短暂反馈，不修改对局状态。 -->
        <Transition
            enter-active-class="transition-[opacity,bottom] duration-200"
            enter-from-class="!bottom-5 opacity-0"
            leave-active-class="transition-[opacity,bottom] duration-200"
            leave-to-class="!bottom-5 opacity-0"
        >
            <div
                v-if="toast"
                class="fixed bottom-7 left-1/2 z-10 flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-[9px] rounded-[9px] border border-[#c5e99555] bg-[#253223f5] px-[19px] py-[13px] text-[clamp(12px,1vw,13px)] leading-[1.7] text-[#d4e8bb] max-mob:text-[12px] shadow-[0_8px_30px_#0005]"
                role="status"
            >
                <AppIcon name="check" :size="15" />{{ toast }}
            </div>
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
