<script setup>
// 天国页面标题、当前金币、背包入口和骰子收藏入口。
defineProps({
    coins: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(["openBackpack", "openDiceList"]);
</script>

<template>
    <header class="relative">
        <div class="pr-[352px] max-mid:pr-[330px] max-tab:pr-0">
            <span
                class="mb-3 flex items-center gap-2 text-[clamp(8px,0.7vw,9px)] font-semibold tracking-[2px] text-[#acbf97] max-mob:text-[8px] max-nar:gap-1.5 max-nar:tracking-[1.4px]"
            >
                <span
                    class="inline-block size-[5px] shrink-0 rounded-full bg-lime shadow-[0_0_9px_#c5e99520] max-nar:size-1"
                ></span>
                KINGDOM DICE
            </span>
            <h1
                class="mb-[7px] text-[clamp(27px,2.65vw,38px)] font-[650] leading-[1.5] tracking-[-0.9px] max-mob:text-[30px] max-nar:mt-3 max-nar:whitespace-nowrap max-nar:text-[26px] max-nar:tracking-[-0.7px] max-tiny:whitespace-normal max-tiny:text-[24px]"
            >
                天国骰子
            </h1>
            <p
                class="text-[clamp(14px,1vw,16px)] leading-[1.8] tracking-[0.2px] text-[#839180] max-mob:text-[clamp(12px,1.8vw,14px)] max-nar:max-w-[235px] max-nar:text-[12px] max-nar:leading-[1.7] max-tiny:max-w-full"
            >
                使用来自中世纪的奇妙骰子来和人对决吧
            </p>
        </div>

        <div
            class="absolute right-0 top-[-12px] flex items-start gap-[32px] max-tab:static max-tab:mt-5 max-tab:flex-col max-tab:items-stretch"
            aria-label="天国模式功能"
        >
            <div
                class="flex h-[42px] items-center justify-end gap-[9px] rounded-lg border border-[#b99b6138] bg-[linear-gradient(90deg,#15130e99,#3a301b99)] px-[16px] shadow-[inset_0_1px_0_#d8c9901a,0_5px_14px_#0004] max-tab:order-[-1] max-tab:h-[42px] max-tab:w-full max-tab:justify-between max-tab:self-stretch"
            >
                <span
                    class="grid size-[24px] place-items-center rounded-full border border-[#dbc886] bg-[linear-gradient(145deg,#f0d98f,#9f8142)] text-[12px] font-bold text-[#4a3b1b] shadow-[0_0_12px_#d7bd6240]"
                >◎</span>
                <span class="text-[7px] font-bold tracking-[2px] text-[#9d9273] max-tab:mr-auto">COINS</span>
                <strong class="font-numeric text-[18px] text-[#eedb9a]">{{ coins.toLocaleString("zh-CN") }}</strong>
            </div>
            <div
                class="flex items-center gap-[32px] max-tab:grid max-tab:w-full max-tab:grid-cols-2 max-tab:gap-2 max-nar:gap-1.5"
            >
                <button
                    type="button"
                    class="relative min-h-[42px] min-w-[158px] overflow-hidden border border-[#d1c49f] bg-[linear-gradient(145deg,#2a2517_0%,#16140f_52%,#302916_100%)] px-[22px] py-[9px] text-[15px] leading-none text-[#f5edd8] shadow-[inset_0_1px_0_#fff7c44d,inset_0_-4px_8px_#080702b3,inset_0_0_18px_#b99b6110,0_6px_16px_#05050580,0_0_0_3px_#c2b27d12] transition-[transform,background,border-color,box-shadow] duration-200 before:absolute before:inset-[5px] before:border before:border-[#d6c79255] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(115deg,#ffffff0a_0%,transparent_35%,#d7c69009_62%,transparent_100%)] hover:-translate-y-[2px] hover:border-[#eadcaa] hover:bg-[linear-gradient(145deg,#39311d,#181610_52%,#40351f)] hover:shadow-[inset_0_1px_0_#fff7c466,inset_0_-4px_8px_#08070299,inset_0_0_22px_#b99b6120,0_9px_22px_#05050599,0_0_0_3px_#c2b27d20] active:translate-y-[1px] active:shadow-[inset_0_2px_10px_#05040299,0_3px_8px_#05050580] max-tab:min-w-0 max-tab:px-3 max-tab:py-[14px] max-tab:text-[16px] max-nar:min-h-[52px] max-nar:px-2 max-nar:py-2 max-nar:text-[15px]"
                    @click="emit('openBackpack')"
                >
                    <span class="relative z-10 [text-shadow:0_2px_2px_#000,0_0_12px_#d5b97833]">背包</span>
                </button>
                <button
                    type="button"
                    class="relative min-h-[42px] min-w-[158px] overflow-hidden border border-[#d1c49f] bg-[linear-gradient(145deg,#2a2517_0%,#16140f_52%,#302916_100%)] px-[22px] py-[9px] text-[15px] leading-none text-[#f5edd8] shadow-[inset_0_1px_0_#fff7c44d,inset_0_-4px_8px_#080702b3,inset_0_0_18px_#b99b6110,0_6px_16px_#05050580,0_0_0_3px_#c2b27d12] transition-[transform,background,border-color,box-shadow] duration-200 before:absolute before:inset-[5px] before:border before:border-[#d6c79255] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(115deg,#ffffff0a_0%,transparent_35%,#d7c69009_62%,transparent_100%)] hover:-translate-y-[2px] hover:border-[#eadcaa] hover:bg-[linear-gradient(145deg,#39311d,#181610_52%,#40351f)] hover:shadow-[inset_0_1px_0_#fff7c466,inset_0_-4px_8px_#08070299,inset_0_0_22px_#b99b6120,0_9px_22px_#05050599,0_0_0_3px_#c2b27d20] active:translate-y-[1px] active:shadow-[inset_0_2px_10px_#05040299,0_3px_8px_#05050580] max-tab:min-w-0 max-tab:px-3 max-tab:py-[14px] max-tab:text-[16px] max-nar:min-h-[52px] max-nar:px-2 max-nar:py-2 max-nar:text-[15px]"
                    @click="emit('openDiceList')"
                >
                    <span class="relative z-10 [text-shadow:0_2px_2px_#000,0_0_12px_#d5b97833]">骰子列表</span>
                </button>
            </div>
        </div>
    </header>
</template>
