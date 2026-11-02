<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import { createDialogStyles } from "./dialogStyles.js";

// GameDialogs 根据 modal 状态挂载本视图；按钮事件交回 App 的弹窗与玩家进度流程。
const props = defineProps({ modal: String, theme: String });
const emit = defineEmits(["close", "resetKingdomState"]);
const styles = computed(() => createDialogStyles(props.theme));
const kingdomItems = [
    { name: "皇家十字印记", detail: "中世纪对局中的稀有护符", icon: "shield" },
    { name: "古堡金币袋", detail: "可在天国模式中携带入场", icon: "bank" },
    { name: "幸运火花", detail: "正在等待下一次奇遇", icon: "spark" },
];
const kingdomDice = [
    { name: "皇家骰子", detail: "庄重典雅，适合挑战古堡对手", icon: "dice" },
    { name: "骑士骰子", detail: "坚毅可靠，象征战场上的勇气", icon: "shield" },
    { name: "幸运骰子", detail: "闪烁微光，为关键一掷带来好运", icon: "spark" },
];
</script>

<template>
    <section v-if="modal === 'kingdom-backpack'" class="pt-[5px]">
        <div :class="[styles.eyebrow, 'text-[#b99b61]']">KINGDOM INVENTORY</div>
        <h2 id="kingdom-backpack-title" :class="[styles.h2, 'mt-[17px]']">天国背包</h2>
        <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#a99f86] max-mob:text-[12px]">
            查看你在天国骰子旅途中的随身物品。
        </p>
        <div class="mt-[24px] grid gap-[10px]">
            <div
                v-for="item in kingdomItems"
                :key="item.name"
                class="flex items-center gap-[14px] rounded-lg border border-[#b99b6138] bg-[#b99b6108] px-[16px] py-[15px]">
                <span
                    class="grid size-[42px] shrink-0 place-items-center rounded-md border border-[#b99b6138] bg-[#b99b610a] text-[#d0bd8a]">
                    <AppIcon :name="item.icon" :size="21" />
                </span>
                <span class="min-w-0">
                    <strong class="block text-[14px] font-medium text-[#e3dbc8]">{{ item.name }}</strong>
                    <small class="mt-1 block text-[12px] leading-[1.6] text-[#948b76]">{{ item.detail }}</small>
                </span>
            </div>
        </div>
        <button
            :class="[styles.button, styles.primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']"
            @click="emit('close')">
            收起背包<AppIcon name="close" :size="17" />
        </button>
    </section>

    <section v-else-if="modal === 'kingdom-dice-list'" class="pt-[5px]">
        <div :class="[styles.eyebrow, 'text-[#b99b61]']">COLLECTION OF KINGDOM</div>
        <h2 id="kingdom-dice-list-title" :class="[styles.h2, 'mt-[17px]']">天国骰子列表</h2>
        <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#a99f86] max-mob:text-[12px]">
            当前收藏的主题骰子会在天国模式中使用。
        </p>
        <div class="mt-[24px] grid gap-[10px]">
            <div
                v-for="(dice, index) in kingdomDice"
                :key="dice.name"
                class="flex items-center gap-[14px] rounded-lg border border-[#b99b6138] bg-[#b99b6108] px-[16px] py-[15px]">
                <span
                    class="grid size-[42px] shrink-0 place-items-center rounded-md border border-[#b99b6138] bg-[#b99b610a] text-[#d0bd8a]">
                    <AppIcon :name="dice.icon" :size="21" />
                </span>
                <span class="min-w-0 flex-1">
                    <strong class="block text-[14px] font-medium text-[#e3dbc8]">{{ dice.name }}</strong>
                    <small class="mt-1 block text-[12px] leading-[1.6] text-[#948b76]">{{ dice.detail }}</small>
                </span>
                <small class="text-[10px] tracking-[1px] text-[#b99b61]">0{{ index + 1 }}</small>
            </div>
        </div>
        <button
            :class="[styles.button, styles.primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']"
            @click="emit('close')">
            返回天国<AppIcon name="arrow" :size="17" />
        </button>
    </section>

    <section v-else-if="modal === 'kingdom-reset'" class="pt-[5px]">
        <div :class="styles.eyebrow">KINGDOM PLAYER RECORD</div>
        <h2 id="kingdom-reset-title" :class="[styles.h2, 'mt-[17px]']">重置天国状态？</h2>
        <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#a99f86] max-mob:text-[12px]">
            金币与收藏将恢复为初始状态：1,250 金币，以及皇家骰子、皇家十字印记和古堡金币袋。此操作无法撤销。
        </p>
        <div class="mt-[25px] grid grid-cols-2 gap-[10px] max-nar:grid-cols-1">
            <button type="button" :class="[styles.button, styles.secondary, 'justify-center']" @click="emit('close')">
                保留当前状态
            </button>
            <button
                type="button"
                :class="[styles.button, styles.primary, 'justify-center']"
                @click="emit('resetKingdomState')">
                <AppIcon name="restart" :size="17" />重置状态
            </button>
        </div>
    </section>
</template>
