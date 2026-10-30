<!-- 展示最近收分和 Farkle 事件的对局动态列表。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
// history 为按时间倒序保存的对局动态；format 用于统一格式化分数。
defineProps({ history: Array, format: Function });
defineEmits(["openDetails"]);
</script>
<template>
    <section class="pt-6.5 max-nar:pt-5.5" aria-label="对局记录">
        <div class="flex items-center justify-between gap-2.5">
            <h2
                class="flex items-center gap-2.25 text-[clamp(14px,1.15vw,16px)] font-medium max-mob:text-[14px] max-nar:gap-2"
            >
                <AppIcon class="text-[#adbf98]" name="history" :size="17" />对局动态
            </h2>
            <button
                class="inline-flex items-center gap-1.25 border-0 bg-transparent py-1 text-[clamp(11px,0.95vw,12px)] tracking-normal text-lime hover:text-[#d8f0b7] max-mob:text-[12px]"
                type="button"
                @click="$emit('openDetails')"
            >
                查看详情<AppIcon name="chevron" :size="13" />
            </button>
        </div>
        <div v-if="!history.length" class="flex items-center gap-3 pb-2.5 pt-6.25 text-[#75846e] max-nar:pt-5.75">
            <span class="text-[17px] text-[#819874]">✦</span>
            <p class="whitespace-nowrap text-[clamp(12px,1vw,13px)] max-mob:text-[12px]">
                故事还没开始。第一掷，交给你。
            </p>
            <span class="ml-2 h-px flex-1 bg-[linear-gradient(90deg,#a9c18615,transparent)]"></span>
        </div>
        <ol v-else class="mt-4 grid list-none gap-3.25 p-0">
            <li
                v-for="(event, index) in history.slice(0, 5)"
                :key="event.id"
                class="flex items-center gap-2 text-[clamp(12px,1vw,13px)] text-[#93a28a] max-mob:flex-wrap max-mob:text-[12px] max-nar:gap-1.5"
            >
                <span
                    class="grid size-4.5 shrink-0 place-items-center rounded-full"
                    :class="event.type === 'bank' ? 'bg-[#c5e99510] text-[#bdda96]' : 'bg-[#c0947315] text-[#d4a783]'"
                >
                    <AppIcon :name="event.type === 'bank' ? 'check' : 'close'" :size="11" />
                </span>
                <span class="min-w-0 flex-1 max-mob:min-w-[calc(100%-24px)]">
                    <strong class="mr-1.75 wrap-break-word font-medium text-[#c6d4bc] max-nar:mr-1.25">{{
                        event.name
                    }}</strong
                    >{{ event.type === "bank" ? "落袋为安" : "遭遇 Farkle"
                    }}<small
                        v-if="event.final"
                        class="ml-1.75 inline-block rounded-[3px] border border-[#b8a26b26] px-1 py-0.5 text-[clamp(9px,0.75vw,10px)] text-[#d8c18b] max-nar:ml-1 max-nar:text-[6px]"
                        >触发最终回合</small
                    ></span
                >
                <b
                    class="whitespace-nowrap font-medium"
                    :class="
                        event.type === 'bank'
                            ? 'text-[clamp(11px,0.95vw,12px)] text-[#c0d8a0] max-mob:text-[12px]'
                            : 'text-[clamp(10px,0.85vw,11px)] text-[#b4967b] max-mob:text-[10px]'
                    "
                    >{{
                        event.type === "bank"
                            ? "+" + format(event.points)
                            : event.points
                              ? "失去 " + format(event.points)
                              : "本回合归零"
                    }}<small
                        v-if="event.type === 'bank'"
                        class="ml-0.75 text-[clamp(9px,0.75vw,10px)] text-[#839773] max-mob:text-[10px]"
                        >分</small
                    ></b
                ><time
                    class="ml-2 min-w-[31px] shrink-0 text-right text-[clamp(9px,0.75vw,10px)] text-[#6e7c66] max-mob:ml-6 max-mob:w-[calc(100%-24px)] max-mob:text-left max-mob:text-[10px] max-nar:ml-1"
                    >{{ index === 0 ? "刚刚" : `第 ${Math.ceil(event.turn / 2)} 轮` }}</time
                >
            </li>
        </ol>
    </section>
</template>
