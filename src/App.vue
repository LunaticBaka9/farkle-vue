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

const activeMode = ref("classic");
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
</script>

<template>
    <div class="site-shell" :data-mode="activeMode">
        <GameHeader :sound="sound" @toggle-sound="toggleSound" @open-rules="modal = 'rules'" />

        <!-- 主内容区：标题、对局主栏与计分提示侧栏。 -->
        <main class="main-content">
            <div class="game-layout">
                <ModeSwitcher v-model="activeMode" />
                <component :is="activeModeComponent" />
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
