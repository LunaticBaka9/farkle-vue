<!-- 计分速查、Hot Dice 提示、首次收分门槛和格言。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
import Die from "./Die.vue";
defineProps({ format: Function, entryScore: Number });
defineEmits(["openRules"]);
</script>
<template>
    <aside
        class="flex flex-col gap-[18px] max-tab:mt-3 max-tab:grid max-tab:grid-cols-2 max-tab:grid-rows-[auto_1fr] max-tab:gap-5 max-nar:mt-[9px] max-nar:flex max-nar:gap-4"
        aria-label="计分与玩法提示"
    >
        <section
            class="overflow-hidden rounded-[10px] border border-[#d5e4bf17] bg-[linear-gradient(120deg,#202a21,#1a231d)] px-[22px] pt-[23px] max-tab:row-span-3 max-mid:px-[19px] max-nar:px-[21px] max-nar:pt-[22px]"
        >
            <div class="flex items-center justify-between gap-[10px]">
                <h2 class="flex items-center gap-[9px] text-[clamp(14px,1.15vw,16px)] font-medium max-mob:text-[14px] max-nar:gap-2">
                    <AppIcon name="dice" :size="17" />计分速查
                </h2>
                <span class="rounded-[3px] border border-[#b5d28720] bg-[#b1ce8608] px-[5px] py-1 text-[6px] tracking-[1px] text-[#a4bb89] max-tab:inline-block"
                    >QUICK GUIDE</span
                >
            </div>
            <p class="mb-[17px] mt-[13px] text-[clamp(11px,0.95vw,12px)] leading-[1.7] text-[#819178] max-mob:text-[12px] max-nar:mb-[15px]">
                记住这些组合，让每一掷更有把握。
            </p>
            <div
                class="[&>div]:flex [&>div]:items-center [&>div]:gap-[11px] [&>div]:py-[9px] [&>div]:text-[clamp(12px,1vw,13px)] [&>div]:text-[#c4cdbb] max-mob:[&>div]:text-[12px] max-nar:[&>div]:py-[10px]"
            >
                <div>
                    <Die :value="1" decorative small /><span>单个 1</span
                    ><strong class="ml-auto font-numeric text-[clamp(14px,1.2vw,16px)] font-medium text-[#dfebd1] max-mob:text-[14px]"
                        >100<small class="ml-[5px] text-[clamp(10px,0.85vw,11px)] font-normal text-[#849574] max-mob:text-[11px]">分</small></strong
                    >
                </div>
                <div>
                    <Die :value="5" decorative small /><span>单个 5</span
                    ><strong class="ml-auto font-numeric text-[clamp(14px,1.2vw,16px)] font-medium text-[#dfebd1] max-mob:text-[14px]"
                        >50<small class="ml-[5px] text-[clamp(10px,0.85vw,11px)] font-normal text-[#849574] max-mob:text-[11px]">分</small></strong
                    >
                </div>
            </div>
            <div class="mb-[9px] mt-[13px] h-px bg-[#cbdcaa14]"></div>
            <div
                class="flex min-h-[35px] items-center justify-between gap-2 text-[clamp(12px,1vw,13px)] text-[#b7c3ac] max-mob:text-[12px] max-nar:min-h-9"
            >
                <span>三个 1</span
                ><strong class="whitespace-nowrap font-numeric text-[12px] font-medium text-[#d2dfc4]"
                    >300<small class="ml-[5px] text-[clamp(10px,0.85vw,11px)] font-normal text-[#849574] max-mob:text-[11px]">分</small></strong
                >
            </div>
            <div
                class="flex min-h-[35px] items-center justify-between gap-2 text-[clamp(12px,1vw,13px)] text-[#b7c3ac] max-mob:text-[12px] max-nar:min-h-9"
            >
                <span>三个 2 — 6</span><strong class="whitespace-nowrap font-numeric text-[12px] font-medium text-[#d2dfc4]">点数 × 100</strong>
            </div>
            <div
                class="flex min-h-[35px] items-center justify-between gap-2 text-[clamp(12px,1vw,13px)] text-[#b7c3ac] max-mob:text-[12px] max-nar:min-h-9"
            >
                <span>四 / 五 / 六同</span
                ><strong class="whitespace-nowrap font-numeric text-[10px] font-medium text-[#d2dfc4] max-mid:text-[9px] max-tab:text-[11px]"
                    >1,000 / 2,000 / 3,000</strong
                >
            </div>
            <div class="mb-[9px] mt-[13px] h-px bg-[#cbdcaa14]"></div>
            <div
                class="flex min-h-[35px] items-center justify-between gap-2 text-[clamp(12px,1vw,13px)] text-[#b7c3ac] max-mob:text-[12px] max-nar:min-h-9"
            >
                <span>1–6 顺子</span
                ><strong class="whitespace-nowrap font-numeric text-[12px] font-medium text-[#d2dfc4]"
                    >1,500<small class="ml-[5px] text-[clamp(10px,0.85vw,11px)] font-normal text-[#849574] max-mob:text-[11px]">分</small></strong
                >
            </div>
            <div
                class="flex min-h-[35px] items-center justify-between gap-2 text-[clamp(12px,1vw,13px)] text-[#b7c3ac] max-mob:text-[12px] max-nar:min-h-9"
            >
                <span
                    >三对<span class="ml-[6px] font-numeric text-[clamp(10px,0.85vw,11px)] text-[#77886d] max-mob:hidden max-mob:text-[11px] max-nar:inline"
                        >2 + 2 + 2</span
                    ></span
                ><strong class="whitespace-nowrap font-numeric text-[12px] font-medium text-[#d2dfc4]"
                    >1,500<small class="ml-[5px] text-[clamp(10px,0.85vw,11px)] font-normal text-[#849574] max-mob:text-[11px]">分</small></strong
                >
            </div>
            <div
                class="flex min-h-[35px] items-center justify-between gap-2 text-[clamp(12px,1vw,13px)] text-[#b7c3ac] max-mob:text-[12px] max-nar:min-h-9"
            >
                <span>四同 + 一对</span
                ><strong class="whitespace-nowrap font-numeric text-[12px] font-medium text-[#d2dfc4]"
                    >1,500<small class="ml-[5px] text-[clamp(10px,0.85vw,11px)] font-normal text-[#849574] max-mob:text-[11px]">分</small></strong
                >
            </div>
            <div
                class="flex min-h-[35px] items-center justify-between gap-2 text-[clamp(12px,1vw,13px)] text-[#b7c3ac] max-mob:text-[12px] max-nar:min-h-9"
            >
                <span>两组三同</span
                ><strong class="whitespace-nowrap font-numeric text-[12px] font-medium text-[#d2dfc4]"
                    >2,500<small class="ml-[5px] text-[clamp(10px,0.85vw,11px)] font-normal text-[#849574] max-mob:text-[11px]">分</small></strong
                >
            </div>
            <button
                class="-mx-[22px] mt-[21px] flex w-[calc(100%+44px)] items-center justify-between border-0 border-t border-[#cbdcaa14] bg-[#c5e99503] px-[22px] py-4 text-[clamp(10px,0.85vw,11px)] text-[#b5cd98] hover:bg-[#c5e9950a] hover:text-[#d8edbd] max-mid:-mx-[19px] max-mid:w-[calc(100%+38px)] max-mid:px-[19px] max-mob:text-[11px] max-nar:-mx-[21px] max-nar:w-[calc(100%+42px)] max-nar:px-[21px]"
                @click="$emit('openRules')"
            >
                查看完整规则与示例<AppIcon name="diagonal" :size="15" />
            </button>
        </section>
        <section
            class="flex items-start gap-3 rounded-[10px] border border-[#b6b87c39] bg-[linear-gradient(110deg,#30352280,#262f2080)] px-[19px] py-[21px] max-tab:self-start max-mob:gap-[9px] max-mob:px-[15px] max-mob:py-5 max-nar:w-full max-nar:gap-[13px] max-nar:p-[21px]"
        >
            <div class="pt-[3px] text-[#d4d394]"><AppIcon class="max-mob:w-5 max-nar:w-[25px]" name="flame" :size="25" /></div>
            <div>
                <span class="text-[clamp(8px,0.7vw,9px)] tracking-[1.4px] text-[#afba81] max-mob:text-[9px] max-mob:tracking-[0.6px] max-nar:tracking-[1.2px]"
                    >WHEN THE DICE ARE HOT</span
                >
                <h3 class="mb-[10px] mt-[9px] text-[clamp(14px,1.15vw,16px)] font-medium text-[#dce3c1] max-mob:my-[10px] max-mob:text-[14px]">
                    六骰全中，好运加码。
                </h3>
                <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.95] text-[#9ca98a] max-mob:text-[12px]">
                    六颗骰子全部计分？保留累计得分，重新掷出全部六颗骰子。冒险继续。
                </p>
                <span class="mt-4 flex items-center gap-1.5 text-[clamp(9px,0.75vw,10px)] tracking-[0.3px] text-[#b5c793] max-mob:text-[9px]"
                    ><span class="size-1 rounded-full bg-lime shadow-[0_0_9px_#c5e99520]"></span> HOT DICE · 火热再掷</span
                >
            </div>
        </section>
        <div class="mt-px flex items-start gap-[9px] px-[9px] text-[#7f9271] max-tab:self-start max-nar:mb-2 max-nar:mt-0">
            <AppIcon class="mt-[3px]" name="shield" :size="16" />
            <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.9] max-mob:text-[12px]">
                <template v-if="entryScore > 0">
                    首次收分，至少累计 <strong class="font-medium text-[#acbd94]">{{ format(entryScore) }} 分</strong>。<br />之后每回合随时可以见好就收。
                </template>
                <template v-else>首次收分无最低门槛。<br />选择有效计分骰子即可落袋为安。</template>
            </p>
        </div>
    </aside>
</template>
