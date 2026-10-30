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
        class="relative grid shrink-0 grid-cols-3 grid-rows-3 border border-[#fffbed] bg-[linear-gradient(135deg,#fcfbee_0%,#e6e2d0_100%)] transition-[transform,background,box-shadow] duration-200"
        :class="[
            small
                ? 'size-[23px] gap-px rounded-[4px] p-1 shadow-[0_2px_0_#777f62] [&>span]:size-[3px] [&>span]:shadow-none'
                : 'size-[65px] gap-1 rounded-[11px] p-3 shadow-[0_5px_0_#b4baa3,0_7px_0_#556c4e,0_12px_16px_#03140855,inset_0_1px_2px_#fff] wide:size-[69px] wide:p-[13px] max-mid:size-14 max-mid:gap-[3px] max-mid:rounded-[9px] max-mid:p-[10px] max-tab:size-[68px] max-tab:gap-1 max-tab:rounded-[11px] max-tab:p-[13px] max-mob:size-[59px] max-mob:gap-[3px] max-mob:p-[11px] max-nar:size-11 max-nar:gap-0.5 max-nar:rounded-lg max-nar:p-2 max-tiny:size-[39px] max-tiny:p-[7px]',
            small
                ? ''
                : selected
                  ? '-translate-y-[9px] rotate-0 border-[#e3f9c7] bg-[linear-gradient(135deg,#dbf5b8,#bce28b)] shadow-[0_5px_0_#82a363,0_7px_0_#4c693d,0_0_0_3px_#c5e99526,0_14px_17px_#05180966] enabled:hover:-translate-y-[11px]'
                  : 'rotate-[var(--die-rotation)] enabled:hover:-translate-y-1.5 enabled:hover:rotate-0 enabled:hover:shadow-[0_5px_0_#b4baa3,0_7px_0_#556c4e,0_16px_20px_#03140866]',
            rolling ? 'animate-tumble [animation-delay:var(--die-delay)]' : '',
        ]"
        :disabled="decorative ? undefined : disabled"
        :style="{ '--die-rotation': `${[-7, 5, -3, 7, -5, 3][index % 6]}deg`, '--die-delay': `${index * 45}ms` }"
        :aria-label="decorative ? undefined : `${value} 点骰子${selected ? '，已选择' : ''}`"
        :aria-pressed="decorative ? undefined : selected"
        :aria-hidden="decorative ? true : undefined"
        @click="!decorative && $emit('select')"
    >
        <span
            v-for="n in 9"
            :key="n"
            class="block size-2 justify-self-center self-center rounded-full bg-[#26372a] shadow-[inset_0_1px_2px_#13251b80] max-mid:size-[7px] max-tab:size-2 max-nar:size-1.5 max-tiny:size-[5px]"
            :class="pips[value].includes(n) ? 'opacity-100' : 'opacity-0'"
        ></span>
        <span
            v-if="selected && !small"
            class="absolute -right-2 -top-[9px] grid size-5 place-items-center rounded-full border-2 border-[#305031] bg-[#d1f0a4] text-[#2c4520] max-nar:-right-1.5 max-nar:-top-2 max-nar:size-[17px]"
            ><AppIcon name="check" :size="12"
        /></span>
    </component>
</template>
