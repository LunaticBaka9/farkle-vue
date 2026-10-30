<!-- 页面顶部品牌、音效开关和玩法规则入口。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
defineProps({ sound: Boolean });
defineEmits(["toggleSound", "openRules"]);
</script>

<template>
    <header
        class="flex h-[94px] items-center justify-between border-b border-line max-mob:h-20 max-nar:h-[72px]"
    >
        <a
            class="inline-flex items-center text-[32px] font-extrabold tracking-[-1.6px] max-nar:text-[29px]"
            href="./"
            aria-label="Farkle 首页"
        >
            <span
                class="mr-3 grid size-[37px] place-items-center rounded-[10px] bg-lime text-[#20331d] -rotate-12 max-nar:mr-[10px] max-nar:size-8 max-nar:rounded-[9px]"
                ><AppIcon class="max-nar:size-[23px]" name="dice" :size="27" /></span
            >farkle<span class="text-lime">.</span>
        </a>
        <span class="ml-[45px] text-[clamp(9px,0.8vw,11px)] font-medium tracking-[2.6px] text-[#718075] max-mid:ml-0 max-mid:text-[8px] max-mob:hidden"
            >A LITTLE LUCK. A LOT OF NERVE.</span
        >
        <nav class="flex items-center gap-[21px] max-nar:gap-[14px]" aria-label="游戏工具">
            <button
                class="inline-flex items-center gap-2 border-0 bg-transparent py-[7px] text-[clamp(12px,1vw,13px)] text-[#a0ac9f] hover:text-lime max-mob:text-[12px] max-nar:min-h-[38px] max-nar:gap-1.5"
                :aria-label="sound ? '关闭音效' : '开启音效'"
                :aria-pressed="sound"
                @click="$emit('toggleSound')"
            >
                <AppIcon :name="sound ? 'sound' : 'mute'" :size="18" /><span
                    class="text-[clamp(11px,0.9vw,12px)] text-[#7f8c80] max-mob:text-[11px] max-nar:hidden"
                    >{{ sound ? "音效开启" : "音效关闭" }}</span
                ></button
            ><span class="h-[17px] w-px bg-[#ffffff17]"></span>
            <button
                class="inline-flex items-center gap-2 border-0 bg-transparent py-[7px] text-[clamp(12px,1vw,13px)] text-[#a0ac9f] hover:text-lime max-mob:text-[12px] max-nar:min-h-[38px] max-nar:gap-1.5"
                @click="$emit('openRules')"
            >
                <AppIcon name="book" :size="17" />玩法规则</button
            >
        </nav>
    </header>
</template>
