<!-- 通用弹窗：规则、设置、胜负和动态；由 App 根据 uiStore.modal 控制。 -->
<script setup>
import { computed } from "vue";
import DialogShell from "./DialogShell.vue";
import RulesDialogContent from "./RulesDialogContent.vue";
import SetupDialogContent from "./SetupDialogContent.vue";
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
    showReturnLobby: Boolean,
});
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
    "returnLobby",
]);

const COMMON_MODALS = ["rules", "setup", "activity", "winner"];
const open = computed(() => COMMON_MODALS.includes(props.modal));
const titleId = computed(
    () =>
        ({ rules: "rules-title", setup: "setup-title", activity: "activity-title", winner: "winner-title" })[
            props.modal
        ] || "winner-title",
);
</script>

<template>
    <DialogShell :open="open" :theme="theme" :labelledby="titleId" @close="emit('close')">
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
            :show-return-lobby="showReturnLobby"
            @close="emit('close')"
            @open-setup="emit('openSetup')"
            @open-activity="emit('openActivity')"
            @return-lobby="emit('returnLobby')" />
    </DialogShell>
</template>
