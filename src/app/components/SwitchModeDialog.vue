<!-- 切换模式确认：点击模式按钮或离开对战路由时由 App 打开。 -->
<script setup>
import DialogShell from "../../shared/components/dialogs/DialogShell.vue";

defineProps({
    open: Boolean,
    theme: { type: String, default: "classic" },
    targetLabel: { type: String, default: "" },
    message: { type: String, default: "" },
});
const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <DialogShell :open="open" :theme="theme" labelledby="switch-mode-title" @close="emit('cancel')">
        <div class="switch-dialog">
            <div class="dlg-eyebrow">SWITCH MODE</div>
            <h2 id="switch-mode-title" class="dlg-h2 switch-title">切换到{{ targetLabel || "其他模式" }}？</h2>
            <p class="dlg-lede">{{ message }}</p>
            <div class="switch-actions">
                <button type="button" class="dlg-btn secondary switch-cancel" @click="emit('cancel')">
                    继续留在当前模式
                </button>
                <button type="button" class="dlg-btn primary switch-confirm" @click="emit('confirm')">切换模式</button>
            </div>
        </div>
    </DialogShell>
</template>

<style scoped>
/* 确认弹窗标题：与眉题拉开固定间距。 */
.switch-title {
    margin-top: 14px;
}

/* 操作区：双列按钮，窄屏改为单列。 */
.switch-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 25px;
}

/* 窄屏操作区：单列排列，避免文字拥挤。 */
@media (max-width: 520px) {
    .switch-actions {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 确认弹窗按钮：内容居中。 */
.switch-cancel,
.switch-confirm {
    justify-content: center;
}
</style>
