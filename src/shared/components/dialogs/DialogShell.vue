<!-- 通用弹窗外壳：所有原生 dialog 的打开/关闭、遮罩点击和关闭按钮集中在这里。 -->
<script setup>
import { nextTick, ref, watch } from "vue";
import AppIcon from "../AppIcon.vue";

const props = defineProps({
    open: Boolean,
    theme: { type: String, default: "classic" },
    labelledby: String,
});
const emit = defineEmits(["close"]);
const dialog = ref(null);

// open 由调用方控制；这里只负责与浏览器原生 dialog API 同步。
watch(
    () => props.open,
    async (open) => {
        await nextTick();
        if (!dialog.value) return;
        if (open && !dialog.value.open) dialog.value.showModal();
        else if (!open && dialog.value.open) dialog.value.close();
    },
    { immediate: true },
);

function closeFromBackdrop(event) {
    if (event.target === dialog.value) emit("close");
}
</script>

<template>
    <dialog
        ref="dialog"
        class="game-dialog"
        :class="{ kingdom: theme === 'kingdom' }"
        :aria-labelledby="labelledby"
        @cancel.prevent="emit('close')"
        @click="closeFromBackdrop">
        <button class="dlg-close" aria-label="关闭弹窗" @click="emit('close')">
            <AppIcon name="close" :size="20" />
        </button>
        <slot />
    </dialog>
</template>
