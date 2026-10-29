<!-- 单颗骰子的外观、点数、选中状态与交互按钮。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
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
        :class="{ selected, rolling, 'die-small': small, decorative }"
        :disabled="decorative ? undefined : disabled"
        :style="{ '--die-rotation': `${[-7, 5, -3, 7, -5, 3][index % 6]}deg`, '--die-delay': `${index * 45}ms` }"
        :aria-label="decorative ? undefined : `${value} 点骰子${selected ? '，已选择' : ''}`"
        :aria-pressed="decorative ? undefined : selected"
        :aria-hidden="decorative ? true : undefined"
        @click="!decorative && $emit('select')"
    >
        <span v-for="n in 9" :key="n" class="pip" :class="{ visible: pips[value].includes(n) }"></span>
        <span v-if="selected && !small" class="die-check"><AppIcon name="check" :size="12" /></span>
    </component>
</template>
