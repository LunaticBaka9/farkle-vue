<!-- 单颗骰子的外观、点数、选中状态与交互按钮。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
// props 同时描述普通尺寸、迷你尺寸、动画状态、禁用状态和装饰状态。
defineProps({
    value: { type: Number, default: 1 },
    selected: Boolean,
    rolling: Boolean,
    disabled: Boolean,
    decorative: Boolean,
    small: Boolean,
    index: { type: Number, default: 0 },
});
defineEmits(["select"]);
// pip 编号对应 3×3 网格的位置，组合出六面的点数布局。
const pips = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
</script>
<template>
    <!-- 装饰骰子不使用按钮交互；可操作骰子则保留键盘与读屏语义。 -->
    <component
        :is="decorative ? 'span' : 'button'"
        type="button"
        class="die"
        :class="{ small, selected, rolling }"
        :disabled="decorative ? undefined : disabled"
        :style="{ '--die-rotation': `${[-7, 5, -3, 7, -5, 3][index % 6]}deg`, '--die-delay': `${index * 45}ms` }"
        :aria-label="decorative ? undefined : `${value} 点骰子${selected ? '，已选择' : ''}`"
        :aria-pressed="decorative ? undefined : selected"
        :aria-hidden="decorative ? true : undefined"
        @click="!decorative && $emit('select')">
        <span v-for="n in 9" :key="n" class="pip" :class="{ visible: pips[value].includes(n) }"></span>
        <span v-if="selected && !small" class="die-check"><AppIcon name="check" :size="12" /></span>
    </component>
</template>

<style scoped>
/* 骰子本体：3×3 网格承载 9 个点位，浅色渐变模拟骨白骰面。 */
.die {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(3, 1fr);
    flex-shrink: 0;
    width: 65px;
    height: 65px;
    gap: 4px;
    padding: 12px;
    border: 1px solid #fffbed;
    border-radius: 11px;
    background: linear-gradient(135deg, #fcfbee 0%, #e6e2d0 100%);
    box-shadow:
        0 5px 0 #b4baa3,
        0 7px 0 #556c4e,
        0 12px 16px #03140855,
        inset 0 1px 2px #fff;
    transform: rotate(var(--die-rotation));
    transition-property: transform, background, box-shadow;
    transition-duration: 0.2s;
}

/* 超大屏：骰子略微放大，保持牌桌视觉分量。 */
@media (min-width: 1400px) {
    .die {
        width: 69px;
        height: 69px;
        padding: 13px;
    }
}

/* 中屏：收窄骰子、点距与内边距，给侧栏让出空间。 */
@media (max-width: 1180px) {
    .die {
        width: 56px;
        height: 56px;
        gap: 3px;
        padding: 10px;
        border-radius: 9px;
    }
}

/* 平板：骰子重新放大，避免牌桌显得空。 */
@media (max-width: 1000px) {
    .die {
        width: 68px;
        height: 68px;
        gap: 4px;
        padding: 13px;
        border-radius: 11px;
    }
}

/* 手机：略缩小骰子，六颗仍能单行排列。 */
@media (max-width: 700px) {
    .die {
        width: 59px;
        height: 59px;
        gap: 3px;
        padding: 11px;
    }
}

/* 窄屏：明显缩小骰子，并收紧圆角与间距。 */
@media (max-width: 520px) {
    .die {
        width: 44px;
        height: 44px;
        gap: 2px;
        padding: 8px;
        border-radius: 8px;
    }
}

/* 极窄屏：继续缩小骰子，保证六颗骰子不换行。 */
@media (max-width: 374px) {
    .die {
        width: 39px;
        height: 39px;
        padding: 7px;
    }
}

/* 迷你骰：用于速查表与“已保留”区域的装饰骰子。 */
.die.small {
    width: 23px;
    height: 23px;
    gap: 1px;
    padding: 4px;
    border-radius: 4px;
    box-shadow: 0 2px 0 #777f62;
    /* 迷你骰保持水平，不参与大骰子的随机倾斜。 */
    transform: none;
}

/* 迷你骰的点位同步缩小，并去掉立体阴影。 */
.die.small .pip {
    width: 3px;
    height: 3px;
    box-shadow: none;
}

/* 选中骰：按原 class 的设计意图使用绿色渐变；上移 9px、摆正角度并加绿色光晕。 */
.die.selected {
    border-color: #e3f9c7;
    background: linear-gradient(135deg, #dbf5b8, #bce28b);
    box-shadow:
        0 5px 0 #82a363,
        0 7px 0 #4c693d,
        0 0 0 3px #c5e99526,
        0 14px 17px #05180966;
    transform: translateY(-9px) rotate(0);
}

/* 未选中的可操作骰子悬停：抬起 6px、摆正并加深投影；装饰骰子不触发。 */
.die:not(.selected):enabled:hover {
    box-shadow:
        0 5px 0 #b4baa3,
        0 7px 0 #556c4e,
        0 16px 20px #03140866;
    transform: translateY(-6px) rotate(0);
}

/* 选中骰悬停：比普通悬停再高 2px，强调已选状态。 */
.die.selected:enabled:hover {
    transform: translateY(-11px) rotate(0);
}

/* 翻滚动画：使用全局 tumble 关键帧，延迟由内联 --die-delay 控制。 */
.die.rolling {
    animation: tumble 0.13s ease-in-out infinite alternate;
    animation-delay: var(--die-delay);
}

/* 点位：默认透明，按骰面数值点亮对应格子。 */
.pip {
    display: block;
    justify-self: center;
    align-self: center;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #26372a;
    box-shadow: inset 0 1px 2px #13251b80;
    opacity: 0;
}

/* 被当前骰面点亮的点位。 */
.pip.visible {
    opacity: 1;
}

/* 中屏点位：跟随骰子缩放。 */
@media (max-width: 1180px) {
    .pip {
        width: 7px;
        height: 7px;
    }
}

/* 平板点位：恢复 8px，与放大的骰子匹配。 */
@media (max-width: 1000px) {
    .pip {
        width: 8px;
        height: 8px;
    }
}

/* 窄屏点位：缩小到 6px。 */
@media (max-width: 520px) {
    .pip {
        width: 6px;
        height: 6px;
    }
}

/* 极窄屏点位：缩小到 5px。 */
@media (max-width: 374px) {
    .pip {
        width: 5px;
        height: 5px;
    }
}

/* 选中对勾：位于骰子右上角的小圆徽标。 */
.die-check {
    position: absolute;
    top: -9px;
    right: -8px;
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border: 2px solid #305031;
    border-radius: 50%;
    background: #d1f0a4;
    color: #2c4520;
}

/* 窄屏对勾：缩小并贴近骰子边缘。 */
@media (max-width: 520px) {
    .die-check {
        top: -8px;
        right: -6px;
        width: 17px;
        height: 17px;
    }
}
</style>
