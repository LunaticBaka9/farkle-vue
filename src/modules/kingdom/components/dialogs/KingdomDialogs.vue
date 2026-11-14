<!-- 天国专属弹窗：背包、骰子列表和状态重置；由天国大厅视图挂载。 -->
<script setup>
import { computed } from "vue";
import DialogShell from "../../../../shared/components/dialogs/DialogShell.vue";
import KingdomDialogContent from "./KingdomDialogContent.vue";

const props = defineProps({
    modal: String,
    theme: { type: String, default: "kingdom" },
});
const emit = defineEmits(["close", "resetKingdomState"]);

const KINGDOM_MODALS = ["kingdom-backpack", "kingdom-dice-list", "kingdom-reset"];
const open = computed(() => KINGDOM_MODALS.includes(props.modal));
const titleId = computed(
    () =>
        ({
            "kingdom-backpack": "kingdom-backpack-title",
            "kingdom-dice-list": "kingdom-dice-list-title",
            "kingdom-reset": "kingdom-reset-title",
        })[props.modal] || "kingdom-backpack-title",
);
</script>

<template>
    <DialogShell :open="open" :theme="theme" :labelledby="titleId" @close="emit('close')">
        <KingdomDialogContent :modal="modal" :theme="theme" @close="emit('close')" @reset-kingdom-state="emit('resetKingdomState')" />
    </DialogShell>
</template>
