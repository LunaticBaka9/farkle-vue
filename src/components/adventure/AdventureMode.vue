<script setup>
import AppIcon from "../framework/AppIcon.vue";
</script>

<template>
    <section
        class="relative col-start-2 col-end-4 min-h-[620px] overflow-hidden rounded-[14px] border border-[#87905d4a] bg-[#263023] bg-[linear-gradient(145deg,#26321cdd,transparent_55%),radial-gradient(circle_at_30%_75%,#7d8a4e38,transparent_26%),repeating-linear-gradient(0deg,#6c754018_0_1px,transparent_1px_24px)] text-[#dce4bd] max-tab:col-start-1 max-tab:col-end-auto max-tab:min-h-[560px] max-nar:min-h-[500px] max-nar:rounded-[10px]"
        aria-label="冒险模式"
    >
        <div
            class="relative z-[2] px-[44px] pb-[30px] pt-[42px] [text-shadow:0_2px_18px_#000] max-nar:px-6 max-nar:pb-6 max-nar:pt-[30px]"
        >
            <span class="mb-3 block text-[8px] font-bold tracking-[4px] text-[#abb77d]">ADVENTURE MAP</span>
            <h1 class="mb-[10px] font-display text-[38px] tracking-[2px] max-nar:text-[30px]">冒险模式</h1>
            <p class="text-[13px] leading-[1.8] opacity-[0.78] max-nar:text-[12px]">探索地图、遭遇事件，逐步展开另类 RPG 对局。</p>
        </div>
        <div
            class="absolute inset-[175px_42px_42px] rounded-[9px] border border-[#9da66e42] bg-[radial-gradient(ellipse_at_30%_40%,#b0a86b18_0_8%,transparent_9%),radial-gradient(ellipse_at_72%_65%,#75845422_0_12%,transparent_13%)] max-nar:inset-[145px_24px_24px]"
            aria-hidden="true"
        >
            <span
                class="absolute left-[18%] top-[52%] h-px w-[42%] origin-left -rotate-[18deg] border-t-2 border-dashed border-[#aab28066]"
            ></span>
            <span
                class="absolute left-[57%] top-[42%] h-px w-[31%] origin-left rotate-[28deg] border-t-2 border-dashed border-[#aab28066]"
            ></span>
            <span
                class="absolute left-[16%] top-[48%] size-[18px] rounded-full border-[3px] border-[#b2b77b] bg-[#38422e] shadow-[0_0_0_5px_#aeb47a18]"
            ></span>
            <span
                class="absolute left-[56%] top-[34%] size-[18px] rounded-full border-[3px] border-[#b2b77b] bg-[#38422e] shadow-[0_0_0_5px_#aeb47a18]"
            ></span>
            <span
                class="absolute bottom-[24%] right-[18%] size-[18px] rounded-full border-[3px] border-[#b2b77b] bg-[#38422e] shadow-[0_0_0_5px_#aeb47a18]"
            ></span>
            <AppIcon class="absolute bottom-5 right-6 text-[#a7ad7b66]" name="map" :size="54" />
        </div>
    </section>
</template>
