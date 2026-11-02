// 页面模式状态：由 App.vue 调用，负责模式恢复、切换副作用和页面主题标记。
import { computed, onBeforeUnmount, ref, watch } from "vue";

const PAGE_MODE_STORAGE_KEY = "farkle.pageMode.v1";
const PAGE_MODES = ["classic", "kingdom", "adventure"];

function restorePageMode() {
    try {
        const storedMode = localStorage.getItem(PAGE_MODE_STORAGE_KEY);
        return PAGE_MODES.includes(storedMode) ? storedMode : "classic";
    } catch {
        return "classic";
    }
}

export function usePageMode() {
    const activeMode = ref(restorePageMode());
    const displayMode = computed(() => (activeMode.value === "kingdom-battle" ? "kingdom" : activeMode.value));

    // ModeSwitcher 发出新模式后，此监听器更新页面主题并保存可恢复的主模式。
    watch(
        activeMode,
        (mode) => {
            const effectiveMode = mode === "kingdom-battle" ? "kingdom" : mode;
            document.documentElement.dataset.mode = effectiveMode;
            document.body.dataset.mode = effectiveMode;
            try {
                if (PAGE_MODES.includes(mode)) localStorage.setItem(PAGE_MODE_STORAGE_KEY, mode);
            } catch {
                // 禁止浏览器存储时仍可在当前页面切换模式。
            }
        },
        { immediate: true },
    );

    // App.vue 卸载时清理全局主题标记，避免残留给后续挂载的应用。
    onBeforeUnmount(() => {
        delete document.documentElement.dataset.mode;
        delete document.body.dataset.mode;
    });

    return { activeMode, displayMode };
}
