<!-- 调用来源：App.vue；依据 modal 选择内容组件，并把子组件事件回传给 App。 -->
<script setup>
import { nextTick, ref, watch } from "vue";
import AppIcon from "./AppIcon.vue";
import RulesDialogContent from "./RulesDialogContent.vue";
import SetupDialogContent from "./SetupDialogContent.vue";
import KingdomDialogContent from "./KingdomDialogContent.vue";
import ActivityDialogContent from "./ActivityDialogContent.vue";
import WinnerDialogContent from "./WinnerDialogContent.vue";

const props = defineProps({
    modal: String,
    theme: { type: String, default: "classic" },
    game: Object,
    format: Function,
    winnerLabel: String,
    setupMode: String,
    setupDifficulty: String,
    setupTargetScore: Number,
    setupEntryScore: Number,
    setupNames: Array,
    targetInputValid: Boolean,
    entryInputValid: Boolean,
});
// 用户操作从内容组件 emit 到此处，再由本组件转发给 App.vue 状态所有者。
const emit = defineEmits([
    "close",
    "newGame",
    "openSetup",
    "update:setupMode",
    "update:setupDifficulty",
    "update:setupTargetScore",
    "update:setupEntryScore",
    "update:setupNames",
    "openActivity",
    "resetKingdomState",
]);

const dialog = ref(null);
// modal 由 App.vue 管理；这里仅调用浏览器原生 dialog API 同步显示状态。
watch(
    () => props.modal,
    async (value) => {
        await nextTick();
        if (!dialog.value) return;
        if (value && !dialog.value.open) dialog.value.showModal();
        else if (!value && dialog.value.open) dialog.value.close();
    },
    { immediate: true },
);

const titleId = () =>
    ({
        rules: "rules-title",
        setup: "setup-title",
        activity: "activity-title",
        "kingdom-backpack": "kingdom-backpack-title",
        "kingdom-reset": "kingdom-reset-title",
        "kingdom-dice-list": "kingdom-dice-list-title",
        winner: "winner-title",
    })[props.modal] ?? "winner-title";

function closeFromBackdrop(event) {
    if (event.target === dialog.value) emit("close");
}
</script>

<template>
    <dialog
        ref="dialog"
        class="game-dialog"
        :class="{ kingdom: theme === 'kingdom' }"
        :aria-labelledby="titleId()"
        @cancel.prevent="emit('close')"
        @click="closeFromBackdrop">
        <button class="dlg-close" aria-label="关闭弹窗" @click="emit('close')">
            <AppIcon name="close" :size="20" />
        </button>
        <!-- 各内容视图只消费 props，动作通过事件交回弹窗容器。 -->
        <RulesDialogContent
            v-if="modal === 'rules'"
            :game="game"
            :format="format"
            :theme="theme"
            @close="emit('close')" />
        <SetupDialogContent
            v-else-if="modal === 'setup'"
            :setup-mode="setupMode"
            :setup-difficulty="setupDifficulty"
            :setup-target-score="setupTargetScore"
            :setup-entry-score="setupEntryScore"
            :setup-names="setupNames"
            :target-input-valid="targetInputValid"
            :entry-input-valid="entryInputValid"
            :format="format"
            :theme="theme"
            @new-game="emit('newGame')"
            @update:setup-mode="emit('update:setupMode', $event)"
            @update:setup-difficulty="emit('update:setupDifficulty', $event)"
            @update:setup-target-score="emit('update:setupTargetScore', $event)"
            @update:setup-entry-score="emit('update:setupEntryScore', $event)"
            @update:setup-names="emit('update:setupNames', $event)" />
        <KingdomDialogContent
            v-else-if="['kingdom-backpack', 'kingdom-dice-list', 'kingdom-reset'].includes(modal)"
            :modal="modal"
            :theme="theme"
            @close="emit('close')"
            @reset-kingdom-state="emit('resetKingdomState')" />
        <ActivityDialogContent
            v-else-if="modal === 'activity'"
            :game="game"
            :format="format"
            :theme="theme"
            @close="emit('close')" />
        <WinnerDialogContent
            v-else-if="modal === 'winner'"
            :game="game"
            :format="format"
            :winner-label="winnerLabel"
            :theme="theme"
            @close="emit('close')"
            @open-setup="emit('openSetup')"
            @open-activity="emit('openActivity')" />
    </dialog>
</template>

