<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import { createDialogStyles } from "./dialogStyles.js";

// GameDialogs 在 activity 状态下挂载此只读视图；game/history 来自 Pinia store。
const props = defineProps({ game: Object, format: Function, theme: String });
const emit = defineEmits(["close"]);
const styles = computed(() => createDialogStyles(props.theme));
</script>

<template>
    <section class="max-w-[620px] p-[44px_48px_38px] max-mob:p-[38px_22px_24px]">
        <div :class="styles.eyebrow">THE COMPLETE STORY</div>
        <h2 id="activity-title" :class="[styles.h2, 'mt-2']">本局动态详情</h2>
        <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#96a68a] max-mob:text-[12px]">
            按时间顺序回顾当前对局的全部收分与 Farkle 动态。
        </p>
        <ol v-if="game.history.length" class="my-6 grid list-none gap-[10px] p-0">
            <li
                v-for="event in game.history"
                :key="event.id"
                class="flex min-h-[58px] items-center gap-[10px] border-b border-line pb-[10px] max-mob:flex-wrap max-mob:items-start">
                <span
                    class="grid size-[18px] shrink-0 place-items-center rounded-full"
                    :class="event.type === 'bank' ? 'bg-[#c5e99510] text-[#bdda96]' : 'bg-[#c0947315] text-[#d4a783]'">
                    <AppIcon :name="event.type === 'bank' ? 'check' : 'close'" :size="12" />
                </span>
                <div class="min-w-0 flex-1">
                    <strong class="mr-[7px] text-[#d4dfca]">{{ event.name }}</strong>
                    <span
                        class="text-[clamp(12px,1vw,13px)] text-[#93a28a] max-mob:mt-1 max-mob:block max-mob:text-[13px]">
                        {{ event.type === "bank" ? "落袋为安" : "遭遇 Farkle" }}
                    </span>
                    <small
                        class="ml-2 inline-block text-[clamp(10px,0.85vw,11px)] text-[#75846e] max-mob:ml-0 max-mob:mt-1 max-mob:block max-mob:text-[11px]">
                        第 {{ Math.ceil(event.turn / 2) }} 轮
                    </small>
                    <small
                        v-if="event.final"
                        :class="[
                            styles.finalTagBase,
                            'text-[#d8c18b] max-mob:ml-0 max-mob:mt-1 max-mob:block max-mob:text-[11px]',
                        ]">
                        触发最终回合
                    </small>
                </div>
                <b class="ml-auto whitespace-nowrap max-mob:ml-[28px] max-mob:mt-1">
                    {{
                        event.type === "bank"
                            ? "+" + format(event.points)
                            : event.points
                              ? "失去 " + format(event.points)
                              : "本回合归零"
                    }}
                    <small v-if="event.type === 'bank'">分</small>
                </b>
            </li>
        </ol>
        <div
            v-else
            class="my-6 grid min-h-[180px] place-content-center justify-items-center gap-3 rounded-xl border border-dashed border-line text-[#75846e]">
            <AppIcon name="history" :size="28" />
            <p>当前对局还没有收分或 Farkle 动态。</p>
        </div>
        <button
            :class="[styles.button, styles.primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']"
            @click="emit('close')">
            返回对局<AppIcon name="arrow" :size="17" />
        </button>
    </section>
</template>
