<!-- 页面底部品牌、说明和局数规格展示。 -->
<script setup>
// targetScore 控制页脚显示的本局目标分数；format 负责统一千分位等数字文本格式。
defineProps({ targetScore: Number, format: Function });
</script>
<template>
    <footer
        class="mt-9.5 flex items-center justify-between gap-5 border-t border-line pb-7 pt-6 max-tab:mt-7.5 max-nar:mt-6 max-nar:gap-3 max-nar:py-5.25"
    >
        <span class="text-[18px] font-bold tracking-[-0.7px] text-[#a3b293] max-nar:text-[17px]"
            >farkle
            <span class="text-[#bad18e]">.</span>
            <small
                class="ml-3.5 align-middle text-[10px] font-normal tracking-[1.4px] text-[#6b7b60] max-mob:ml-2.5 max-mob:text-[5px] max-nar:hidden"
                >ROLL. RISK. REPEAT.</small
            >
        </span>
        <span class="text-[12px] tracking-[0.6px] text-[#68775f] max-mob:hidden">为每一个「再来一次」的瞬间而作。</span>
        <span class="text-[12px] tracking-[1.7px] text-[#68775f] max-mob:text-[5px] max-mob:tracking-[1px]"
            >6 DICE <i class="mx-1.75 not-italic text-[#a5ba8350] max-mob:mx-1">/</i> 2 PLAYERS
            <i class="mx-1.75 not-italic text-[#a5ba8350] max-mob:mx-1">/</i> {{ format(targetScore) }} POINTS</span
        >
    </footer>
</template>
