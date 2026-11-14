<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
    modelValue: {
        type: String,
        default: "classic",
    },
});

defineEmits(["update:modelValue"]);

// modes 是页面模式导航的完整配置：id 用于状态和主题切换，label/subtitle/icon 控制视觉展示。
const modes = [
    { id: "classic", label: "普通", subtitle: "CLASSIC", icon: "dice" },
    { id: "kingdom", label: "天国", subtitle: "KINGDOM", icon: "shield" },
    { id: "adventure", label: "冒险", subtitle: "ADVENTURE", icon: "map" },
];
</script>

<template>
    <nav class="mode-switcher" aria-label="游戏模式">
        <span class="mode-caption">MODE</span>
        <button
            v-for="mode in modes"
            :key="mode.id"
            type="button"
            class="mode-btn"
            :class="{ active: modelValue === mode.id }"
            :aria-current="modelValue === mode.id ? 'page' : undefined"
            :aria-label="`${mode.label}模式`"
            @click="$emit('update:modelValue', mode.id)">
            <span class="mode-icon"><AppIcon class="mode-icon-svg" :name="mode.icon" :size="20" /></span>
            <span class="mode-text">
                <strong class="mode-name">{{ mode.label }}</strong>
                <small class="mode-sub">{{ mode.subtitle }}</small>
            </span>
        </button>
    </nav>
</template>

<style scoped>
/* 模式导航：桌面端固定在页面左侧，平板及以下改为顶部三列。 */
.mode-switcher {
    position: sticky;
    top: 18px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 82px;
    padding-top: 2px;
}

/* 平板模式导航：取消固定，改为等宽三列横排。 */
@media (max-width: 1000px) {
    .mode-switcher {
        position: static;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        width: 100%;
        min-width: 0;
        padding: 0;
    }
}

/* 窄屏模式导航：收紧按钮间距。 */
@media (max-width: 520px) {
    .mode-switcher {
        gap: 6px;
    }
}

/* “MODE”小标题：只在桌面端显示。 */
.mode-caption {
    padding-bottom: 7px;
    color: #728171;
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 2px;
    text-align: center;
}

/* 平板隐藏“MODE”小标题。 */
@media (max-width: 1000px) {
    .mode-caption {
        display: none;
    }
}

/* 模式按钮：桌面端纵向排列图标与文字。 */
.mode-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 74px;
    padding: 8px 4px;
    border: 1px solid #d5e4bf14;
    border-radius: 10px;
    background: #1a231dc9;
    color: #899884;
}

/* 模式按钮悬停：描边、底色与文字一起提亮。 */
.mode-btn:hover {
    border-color: #c5e99555;
    background: #202b22;
    color: #d5e3c8;
}

/* 当前模式按钮：品牌绿描边、渐变底与绿色投影。 */
.mode-btn.active {
    border-color: #c5e995;
    background: linear-gradient(145deg, #c5e99522, #c5e99509);
    color: var(--color-lime);
    box-shadow: 0 8px 24px #00000024;
}

/* 平板模式按钮：改为横向排列，降低高度。 */
@media (max-width: 1000px) {
    .mode-btn {
        flex-direction: row;
        gap: 9px;
        min-height: 58px;
    }
}

/* 窄屏模式按钮：继续压缩高度、间距与内边距。 */
@media (max-width: 520px) {
    .mode-btn {
        gap: 6px;
        min-height: 52px;
        padding: 7px 3px;
        border-radius: 8px;
    }
}

/* 模式图标容器：固定 22px 高度，让三种模式图标中心对齐。 */
.mode-icon {
    display: grid;
    place-items: center;
    height: 22px;
}

/* 窄屏模式图标：缩小到 17px。 */
@media (max-width: 520px) {
    .mode-icon-svg {
        width: 17px;
        height: 17px;
    }
}

/* 模式文字块：纵向排列中文名与英文副标题。 */
.mode-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
}

/* 平板模式文字：左对齐，与横向图标形成一行。 */
@media (max-width: 1000px) {
    .mode-text {
        align-items: flex-start;
    }
}

/* 模式中文名：小号半粗体。 */
.mode-name {
    font-size: 11px;
    font-weight: 600;
}

/* 窄屏模式中文名：缩小到 10px。 */
@media (max-width: 520px) {
    .mode-name {
        font-size: 10px;
    }
}

/* 模式英文副标题：更小、更透明。 */
.mode-sub {
    margin-top: 5px;
    font-size: 6px;
    letter-spacing: 0.8px;
    opacity: 0.72;
}

/* 窄屏英文副标题：进一步缩小字号与字距。 */
@media (max-width: 520px) {
    .mode-sub {
        font-size: 5px;
        letter-spacing: 0.5px;
    }
}
</style>
