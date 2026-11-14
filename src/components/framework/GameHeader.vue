<!-- 页面顶部品牌、音效开关和玩法规则入口。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
// sound 表示顶部音效开关的当前状态；toggleSound/openRules 由父组件统一处理对应动作。
defineProps({ sound: Boolean });
defineEmits(["toggleSound", "openRules"]);
</script>

<template>
    <header class="site-header">
        <a class="brand" href="./" aria-label="Farkle 首页">
            <span class="brand-mark"><AppIcon class="brand-icon" name="dice" :size="27" /></span>farkle<span
                class="brand-dot"
                >.</span
            >
        </a>
        <span class="tagline">A LITTLE LUCK. A LOT OF NERVE.</span>
        <nav class="tools" aria-label="游戏工具">
            <button
                class="tool-btn"
                :aria-label="sound ? '关闭音效' : '开启音效'"
                :aria-pressed="sound"
                @click="$emit('toggleSound')">
                <AppIcon :name="sound ? 'sound' : 'mute'" :size="18" /><span class="tool-label">{{
                    sound ? "音效开启" : "音效关闭"
                }}</span>
            </button>
            <span class="tools-divider"></span>
            <button class="tool-btn" @click="$emit('openRules')">
                <AppIcon name="book" :size="17" />玩法规则
            </button>
        </nav>
    </header>
</template>

<style scoped>
/* 顶部栏：品牌居左、标语居中、工具居右，底部细线分隔内容。 */
.site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 94px;
    border-bottom: 1px solid var(--color-line);
}

/* 手机端顶部栏：略降高度。 */
@media (max-width: 700px) {
    .site-header {
        height: 80px;
    }
}

/* 窄屏顶部栏：进一步压缩高度。 */
@media (max-width: 520px) {
    .site-header {
        height: 72px;
    }
}

/* 品牌链接：大号粗体字，绿色骰子方块跟随。 */
.brand {
    display: inline-flex;
    align-items: center;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1.6px;
}

/* 窄屏品牌文字：略减字号。 */
@media (max-width: 520px) {
    .brand {
        font-size: 29px;
    }
}

/* 品牌骰子方块：绿色圆角底，向左轻微倾斜。 */
.brand-mark {
    display: grid;
    place-items: center;
    width: 37px;
    height: 37px;
    margin-right: 12px;
    border-radius: 10px;
    background: var(--color-lime);
    color: #20331d;
    transform: rotate(-12deg);
}

/* 窄屏品牌骰子方块：缩小并收紧右边距。 */
@media (max-width: 520px) {
    .brand-mark {
        width: 32px;
        height: 32px;
        margin-right: 10px;
        border-radius: 9px;
    }
}

/* 窄屏品牌图标：同步缩小骰子图形。 */
@media (max-width: 520px) {
    .brand-icon {
        width: 23px;
        height: 23px;
    }
}

/* 品牌末尾句点：使用品牌绿。 */
.brand-dot {
    color: var(--color-lime);
}

/* 品牌标语：低调的小号大写文字。 */
.tagline {
    margin-left: 45px;
    color: #8a9a83;
    font-size: clamp(9px, 0.8vw, 11px);
    font-weight: 500;
    letter-spacing: 2.6px;
}

/* 中屏标语：去掉左边距并缩小字号，避免挤压导航。 */
@media (max-width: 1180px) {
    .tagline {
        margin-left: 0;
        font-size: 8px;
    }
}

/* 手机端隐藏标语，把空间留给工具按钮。 */
@media (max-width: 700px) {
    .tagline {
        display: none;
    }
}

/* 工具区：音效与规则按钮横向排列。 */
.tools {
    display: flex;
    align-items: center;
    gap: 21px;
}

/* 窄屏工具区：收紧按钮间距。 */
@media (max-width: 520px) {
    .tools {
        gap: 14px;
    }
}

/* 工具按钮：无边框透明底，悬停时文字变绿。 */
.tool-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 7px 0;
    border: 0;
    background: transparent;
    color: #a0ac9f;
    font-size: clamp(12px, 1vw, 13px);
}

/* 工具按钮悬停：图标与文字一起变为品牌绿。 */
.tool-btn:hover {
    color: var(--color-lime);
}

/* 手机端工具按钮：固定 12px。 */
@media (max-width: 700px) {
    .tool-btn {
        font-size: 12px;
    }
}

/* 窄屏工具按钮：保证 44px 点击高度并收紧图标间距。 */
@media (max-width: 520px) {
    .tool-btn {
        gap: 6px;
        min-height: 44px;
    }
}

/* 音效状态文字：比按钮主体更灰、更小。 */
.tool-label {
    color: #7f8c80;
    font-size: clamp(11px, 0.9vw, 12px);
}

/* 手机端音效文字：固定 11px。 */
@media (max-width: 700px) {
    .tool-label {
        font-size: 11px;
    }
}

/* 窄屏隐藏音效状态文字，仅保留图标。 */
@media (max-width: 520px) {
    .tool-label {
        display: none;
    }
}

/* 工具按钮之间的竖直分隔线。 */
.tools-divider {
    width: 1px;
    height: 17px;
    background: #ffffff17;
}
</style>
