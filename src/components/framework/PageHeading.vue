<!-- 页面主标题、产品标语和当前获胜目标展示。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
// targetScore 展示当前获胜目标；format 提供统一的分数数字格式化函数。
defineProps({ targetScore: Number, format: Function });
</script>
<template>
    <section class="col-span-full mb-0 max-mob:mb-7 flex items-center justify-between gap-6 max-nar:items-start max-nar:gap-3">
        <div>
            <div
                class="flex items-center gap-2 text-[clamp(8px,0.7vw,9px)] font-semibold tracking-[2px] text-[#acbf97] max-mob:text-[8px] max-nar:gap-1.5 max-nar:tracking-[1.4px]"
            >
                <span class="inline-block size-[5px] shrink-0 rounded-full bg-lime shadow-[0_0_9px_#c5e99520] max-nar:size-1"></span>
                ROLL THE DICE. OWN THE MOMENT.
            </div>
            <h1
                class="mb-[7px] mt-[10px] text-[clamp(27px,2.65vw,38px)] font-[650] leading-[1.5] tracking-[-0.9px] max-mob:text-[30px] max-nar:mt-3 max-nar:whitespace-nowrap max-nar:text-[26px] max-nar:tracking-[-0.7px] max-tiny:whitespace-normal max-tiny:text-[24px]"
            >
                再掷一次，<span class="text-[#c6d1be]">好运在手。</span>
            </h1>
            <!-- 副标题使用响应式字号，避免大屏字体过小或窄屏文字拥挤。 -->
            <p
                class="text-[clamp(14px,1vw,16px)] leading-[1.8] tracking-[0.2px] text-[#839180] max-mob:text-[clamp(12px,1.8vw,14px)] max-nar:max-w-[235px] max-nar:text-[12px] max-nar:leading-[1.7] max-tiny:max-w-full"
            >
                是落袋为安，还是放手一搏？让每一次选择，都值得心跳。
            </p>
        </div>
        <div
            class="flex items-center gap-[13px] rounded-[10px] border border-[#afbe9c24] bg-[#bbc79d05] px-[19px] py-[13px] max-mob:gap-[9px] max-mob:p-3 max-nar:mt-6 max-nar:gap-1.5 max-nar:p-[9px] max-tiny:hidden"
        >
            <span class="flex items-center text-[#b9d193]"
                ><AppIcon class="max-mob:w-5 max-nar:h-[19px] max-nar:w-[15px]" name="trophy" :size="24"
            /></span>
            <div>
                <small class="mb-[3px] block text-[clamp(10px,0.9vw,11px)] tracking-[0.8px] text-[#82917c] max-nar:mb-1 max-nar:text-[7px]">本局目标</small
                ><strong class="font-numeric text-[23px] tracking-[0.6px] max-mob:text-[20px] max-nar:text-[15px] max-nar:tracking-normal"
                    >{{ format(targetScore) }}<span class="ml-[7px] text-[9px] font-normal text-[#82917b] max-nar:hidden">分</span></strong
                >
            </div>
        </div>
    </section>
</template>
