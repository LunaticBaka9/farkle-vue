<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import { createDialogStyles } from "./dialogStyles.js";

// GameDialogs 在 winner 状态下挂载此结果视图；分数与胜者来自 Pinia game 状态。
const props = defineProps({ game: Object, format: Function, winnerLabel: String, theme: String });
const emit = defineEmits(["close", "openSetup", "openActivity"]);
const styles = computed(() => createDialogStyles(props.theme));
</script>

<template>
    <section class="pt-[5px] text-center">
        <div
            class="mx-auto mb-[25px] grid size-[90px] place-items-center rounded-full border border-[#c5e9953a] bg-[radial-gradient(#c5e99516,#c5e99502)] text-lime shadow-[0_0_40px_#c5e99508]">
            <AppIcon name="trophy" :size="45" />
        </div>
        <div class="flex items-center justify-center gap-2 text-[7px] font-semibold tracking-[2px] text-[#acbf97]">
            WHAT A GAME. WHAT A JOURNEY.
        </div>
        <h2 id="winner-title" :class="[styles.h2, 'mt-[17px] break-words max-nar:text-[26px]']">{{ winnerLabel }}</h2>
        <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#96a68a] max-mob:text-[12px]">
            {{ game.winner === "tie" ? "旗鼓相当的对手，值得再来一局。" : "每一次果断收手，每一次勇敢再掷，都算数。" }}
        </p>
        <div class="mt-[26px] grid grid-cols-2 rounded-lg border border-[#cadfa424] bg-[#0a140c33] py-[23px]">
            <div
                v-for="(player, index) in game.players"
                :key="index"
                class="flex min-w-0 flex-col items-center gap-[10px]"
                :class="index > 0 ? 'border-l border-[#b1c58c21]' : ''">
                <span class="break-words px-2 text-[clamp(12px,1vw,13px)] text-[#a5b691] max-mob:text-[12px]">{{
                    player.name
                }}</span>
                <strong
                    class="font-numeric text-[32px] font-normal tracking-[-0.5px] max-nar:text-[30px]"
                    :class="game.winner === index ? 'text-lime' : 'text-[#cedbc0]'">
                    {{ format(player.score) }}
                </strong>
                <small
                    class="text-[clamp(9px,0.75vw,10px)] tracking-[2px] max-mob:text-[9px]"
                    :class="game.winner === index ? 'text-lime' : 'text-[#839474]'">
                    {{ game.winner === index ? "WINNER" : "POINTS" }}
                </small>
            </div>
        </div>
        <button
            :class="[styles.button, styles.primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']"
            @click="emit('openSetup')">
            再来一局<AppIcon name="restart" :size="17" />
        </button>
        <button
            :class="[styles.button, styles.secondary, 'mt-[9px] w-full justify-center']"
            @click="emit('openActivity')">
            查看动态详情<AppIcon name="history" :size="17" />
        </button>
        <button
            class="mt-[18px] inline-flex items-center justify-center gap-[7px] border-0 bg-transparent py-[7px] text-[clamp(11px,0.95vw,12px)] text-[#8d9b88] hover:text-lime max-mob:text-[12px]"
            @click="emit('close')">
            回到牌桌查看记录
        </button>
    </section>
</template>
