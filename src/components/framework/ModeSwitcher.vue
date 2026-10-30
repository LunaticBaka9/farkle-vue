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
    <nav
        class="sticky top-[18px] flex min-w-[82px] flex-col gap-[7px] pt-0.5 max-tab:static max-tab:grid max-tab:w-full max-tab:min-w-0 max-tab:grid-cols-3 max-tab:gap-2 max-tab:p-0 max-nar:gap-1.5"
        aria-label="游戏模式"
    >
        <span class="pb-[7px] text-center text-[7px] font-bold tracking-[2px] text-[#728171] max-tab:hidden">MODE</span>
        <button
            v-for="mode in modes"
            :key="mode.id"
            type="button"
            class="flex min-h-[74px] flex-col items-center justify-center gap-[7px] rounded-[10px] border px-1 py-2 max-tab:min-h-[58px] max-tab:flex-row max-tab:gap-[9px] max-nar:min-h-[52px] max-nar:gap-1.5 max-nar:rounded-lg max-nar:px-[3px] max-nar:py-[7px]"
            :class="
                modelValue === mode.id
                    ? 'border-[#c5e995] bg-[linear-gradient(145deg,#c5e99522,#c5e99509)] text-lime shadow-[0_8px_24px_#00000024]'
                    : 'border-[#d5e4bf14] bg-[#1a231dc9] text-[#899884] hover:border-[#c5e99555] hover:bg-[#202b22] hover:text-[#d5e3c8]'
            "
            :aria-current="modelValue === mode.id ? 'page' : undefined"
            :aria-label="`${mode.label}模式`"
            @click="$emit('update:modelValue', mode.id)"
        >
            <span class="grid h-[22px] place-items-center"
                ><AppIcon class="max-nar:size-[17px]" :name="mode.icon" :size="20"
            /></span>
            <span class="flex flex-col items-center leading-none max-tab:items-start">
                <strong class="text-[11px] font-semibold max-nar:text-[10px]">{{ mode.label }}</strong>
                <small class="mt-[5px] text-[6px] tracking-[0.8px] opacity-[0.72] max-nar:text-[5px] max-nar:tracking-[0.5px]">{{
                    mode.subtitle
                }}</small>
            </span>
        </button>
    </nav>
</template>
