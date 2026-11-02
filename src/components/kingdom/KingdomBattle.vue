<script setup>
// App.vue 在 KingdomMode 发起挑战后挂载本页，并通过 opponent prop 提供挑战者资料。
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useFarkleStore } from "../../stores/farkle.js";
import AppIcon from "../framework/AppIcon.vue";
import Die from "../framework/Die.vue";
// 与商店共享装备目录和存档读取方法，避免牌桌维护第二份商品映射。
import { KINGDOM_EQUIPMENT } from "../../game/items.js";
import { restoreKingdomState } from "../../game/kingdomStorage.js";

const props = defineProps({ opponent: { type: Object, default: null } });
const emit = defineEmits(["leaveBattle"]);
const farkle = useFarkleStore();
const {
    game,
    selected,
    rolling,
    rollingFaces,
    modal,
    targetScore,
    chosenScore,
    pendingScore,
    validSelection,
    canRollNow,
    canBankNow,
    nextDiceCount,
    showHandoff,
    headline,
    selectionText,
    round,
    isAi,
} = storeToRefs(farkle);
const { format, progress, difficultyLabels, toggleDie, suggest, doRoll, doBank, nextTurn, openSetup } = farkle;

// 对战页面挂载时读取玩家收藏，并以商店目录作为装备名称和图标的数据源。
const inventory = ref(restoreKingdomState().ownedIds);
const equippedItems = computed(() =>
    inventory.value
        .filter((id) => KINGDOM_EQUIPMENT.item[id])
        .map((id) => KINGDOM_EQUIPMENT.item[id])
        .slice(0, 2),
);
const equippedDice = computed(() =>
    inventory.value
        .filter((id) => KINGDOM_EQUIPMENT.dice[id])
        .map((id) => ({ id, ...KINGDOM_EQUIPMENT.dice[id] }))
        .slice(0, 1),
);
const battleHeadline = computed(() => {
    const text = headline.value;
    if (props.opponent?.name && text.includes("NOVA")) {
        return text.replace("NOVA", props.opponent.name);
    }
    return text;
});
</script>

<template>
    <div
        class="col-start-2 col-end-4 grid grid-cols-[minmax(0,1fr)_314px] items-start gap-x-7 gap-y-2 wide:grid-cols-[minmax(0,1fr)_320px] wide:gap-[30px] max-mid:grid-cols-[minmax(0,1fr)_284px] max-mid:gap-[22px] max-tab:col-start-1 max-tab:col-end-auto max-tab:grid-cols-1 max-tab:gap-y-3">
        <section class="col-span-full flex items-end justify-between gap-5 border-b border-[#b99b6122] pb-[22px]">
            <div>
                <span class="flex items-center gap-2 text-[8px] font-semibold tracking-[2px] text-[#c4b27d]">
                    <span class="size-[5px] rounded-full bg-[#d8c58b] shadow-[0_0_9px_#d8c58b55]"></span>
                    KINGDOM CHALLENGE
                </span>
                <h1 class="mt-[9px] text-[clamp(27px,2.65vw,38px)] font-[650] leading-[1.4] text-[#f1ebd7]">
                    天国对战桌
                </h1>
                <p class="mt-2 text-[14px] text-[#9b947a]">
                    {{ opponent?.name || "天国骑士" }} · {{ opponent?.title || "传奇对手" }}
                </p>
            </div>
            <button
                type="button"
                class="min-h-[42px] rounded-lg border border-[#b99b6155] bg-[#211d12] px-4 text-[12px] text-[#d8cca8] hover:border-[#d8c58b]"
                @click="emit('leaveBattle')">
                返回天国
            </button>
        </section>

        <section aria-label="天国模式对局">
            <div class="mb-[19px] grid grid-cols-2 gap-[14px]">
                <article
                    v-for="(player, index) in game.players"
                    :key="player.name"
                    class="rounded-[10px] px-[18px] py-[16px]"
                    :class="
                        game.active === index && game.phase !== 'finished'
                            ? 'border border-[#d6bd7866] bg-[#332b19]'
                            : 'border border-[#b99b6128] bg-[#211e16]'
                    ">
                    <div class="flex items-center gap-[9px]">
                        <span
                            class="grid size-[34px] place-items-center rounded-full border border-[#b99b6150] bg-[#b99b6112] text-[#e1d09b]"
                            ><AppIcon :name="index === 1 ? props.opponent?.icon || 'bot' : 'user'" :size="19"
                        /></span>
                        <div>
                            <h2 class="text-[14px] font-semibold text-[#eee6ce]">{{ player.name }}</h2>
                            <span class="text-[9px] tracking-[1px] text-[#978b69]">{{
                                index === 1 ? difficultyLabels[game.difficulty] + "对手" : "挑战者"
                            }}</span>
                        </div>
                    </div>
                    <div class="mt-4 flex items-baseline gap-2 font-numeric text-[33px] text-[#f1ebd7]">
                        {{ format(player.score)
                        }}<span class="text-[10px] text-[#958b70">/ {{ format(targetScore) }}</span>
                    </div>
                    <div class="mt-3 h-[3px] overflow-hidden rounded-full bg-[#d9c88c18]">
                        <div
                            class="h-full bg-[#d4c184] transition-[width] duration-700"
                            :style="{ width: progress(player.score) }"></div>
                    </div>
                </article>
            </div>

            <section
                class="relative overflow-hidden rounded-[14px] border border-[#c7ad706e] bg-[radial-gradient(ellipse_at_50%_28%,#50432b,#302918_70%,#211d13)] px-[30px] pb-[18px] pt-[20px] shadow-[inset_0_0_70px_#08070466,0_16px_30px_#0003] max-nar:px-[15px]"
                aria-label="天国骰子牌桌">
                <div class="flex items-center justify-between text-[10px] tracking-[1.5px] text-[#bcb184]">
                    <span>第 {{ String(round).padStart(2, "0") }} 轮</span
                    ><span class="text-[#918764]">{{
                        opponent?.wager ? `挑战金 ${opponent.wager}` : "KINGDOM TABLE"
                    }}</span>
                </div>
                <div class="pt-[24px] text-center">
                    <span class="text-[11px] tracking-[2px] text-[#bcb184]">{{
                        game.phase === "farkle" ? "FARKLE" : "本回合累计"
                    }}</span>
                    <div class="mt-2 font-numeric text-[52px] leading-[1.2] text-[#f5edcf]">
                        {{ game.phase === "farkle" ? "FARKLE!" : format(game.turnScore) }}
                    </div>
                    <p class="mt-2 min-h-[18px] text-[12px] text-[#aaa37f]" aria-live="polite">{{ battleHeadline }}</p>
                </div>
                <div
                    class="flex min-h-[118px] items-center justify-center gap-[18px] py-[22px] max-nar:min-h-[100px] max-nar:gap-[10px]">
                    <template v-if="rolling"
                        ><Die
                            v-for="(value, index) in rollingFaces"
                            :key="index"
                            :value="value"
                            :index="index"
                            rolling
                            disabled
                    /></template>
                    <template v-else-if="game.dice.length"
                        ><Die
                            v-for="(die, index) in game.dice"
                            :key="die.id"
                            :value="die.value"
                            :index="index"
                            :selected="selected.includes(die.id)"
                            :disabled="isAi || game.phase !== 'selecting'"
                            @select="toggleDie(die.id)"
                    /></template>
                    <template v-else
                        ><Die
                            v-for="(value, index) in [1, 5, 3, 6, 2, 4]"
                            :key="index"
                            :value="value"
                            :index="index"
                            decorative
                    /></template>
                </div>
                <div class="mb-[14px] min-h-[28px] text-center text-[12px] text-[#aaa37f]">
                    {{ selectionText
                    }}<span v-if="chosenScore" class="ml-2 font-semibold text-[#dfcf91]"
                        >+{{ format(chosenScore) }} 分</span
                    >
                    <button
                        v-if="game.phase === 'selecting' && !isAi && !rolling"
                        class="ml-2 border-0 border-b border-[#d8c58b55] bg-transparent text-[11px] text-[#dfcf91]"
                        @click="suggest">
                        帮我选
                    </button>
                </div>
                <div v-if="showHandoff" class="grid min-h-[49px] place-items-center">
                    <button
                        v-if="game.mode !== 'ai'"
                        class="min-h-[49px] w-full rounded-[7px] border border-[#dfd29d] bg-[#d6c484] text-[#3a321f]"
                        @click="nextTurn">
                        交给下一位
                    </button>
                    <span v-else class="text-[12px] text-[#c8b985]">正在交接回合</span>
                </div>
                <div v-else-if="game.phase === 'finished'" class="grid grid-cols-2 gap-[10px] max-mob:grid-cols-1">
                    <button
                        class="min-h-[49px] rounded-[7px] border border-[#dfd29d] bg-[#d6c484] text-[#3a321f]"
                        @click="openSetup">
                        再来一局
                    </button>
                    <button
                        class="min-h-[49px] rounded-[7px] border border-[#b99b6155] bg-[#493f27] text-[#e7ddb9]"
                        @click="modal = 'winner'">
                        查看结果
                    </button>
                </div>
                <div v-else class="grid grid-cols-[1.08fr_1fr] gap-[10px]">
                    <button
                        class="flex min-h-[49px] items-center justify-center gap-2 rounded-[7px] border border-[#dfd29d] bg-[#d6c484] text-[12px] font-semibold text-[#3a321f] disabled:opacity-50"
                        :disabled="!canRollNow"
                        @click="doRoll()">
                        <AppIcon name="dice" :size="19" />{{
                            rolling
                                ? "掷骰中…"
                                : isAi
                                  ? "对手思考中…"
                                  : game.phase === "ready"
                                    ? "掷出骰子"
                                    : "继续掷骰"
                        }}
                    </button>
                    <button
                        class="flex min-h-[49px] items-center justify-center gap-2 rounded-[7px] border border-[#b99b6155] bg-[#493f27] text-[12px] text-[#e7ddb9] disabled:opacity-45"
                        :disabled="!canBankNow"
                        @click="doBank()">
                        <AppIcon name="bank" :size="17" />收分<strong v-if="canBankNow" class="text-[#e4cf88"
                            >+{{ format(pendingScore) }}</strong
                        >
                    </button>
                </div>

                <div class="mt-[16px] border-t border-[#d7c58a22] pt-[13px]">
                    <div
                        class="mb-[10px] flex items-center justify-between text-[9px] font-semibold tracking-[1.5px] text-[#b7aa83]">
                        <span>随身装备</span><span class="tracking-[0.5px] text-[#897d5d]">TABLE EQUIPMENT</span>
                    </div>
                    <div class="grid grid-cols-[minmax(0,1fr)_minmax(180px,0.55fr)] gap-[10px] max-mob:grid-cols-1">
                        <div
                            class="flex min-h-[58px] items-center gap-[8px] rounded-[8px] border border-[#b99b6138] bg-[#17150f66] px-[12px]">
                            <span class="text-[10px] text-[#918861]">背包</span>
                            <template v-if="equippedItems.length"
                                ><span
                                    v-for="item in equippedItems"
                                    :key="item.name"
                                    class="flex items-center gap-[6px] rounded-[6px] bg-[#b99b6117] px-[8px] py-[7px] text-[11px] text-[#dfd4ad]"
                                    ><AppIcon :name="item.icon" :size="14" />{{ item.name }}</span
                                ></template
                            >
                            <span v-else class="text-[11px] text-[#918861]">暂无物品</span>
                        </div>
                        <div
                            class="flex min-h-[58px] items-center gap-[8px] rounded-[8px] border border-[#b99b6138] bg-[#17150f66] px-[12px]">
                            <span class="text-[10px] text-[#918861]">骰子</span>
                            <template v-if="equippedDice.length"
                                ><span
                                    v-for="dice in equippedDice"
                                    :key="dice.id"
                                    class="flex items-center gap-[7px] rounded-[6px] bg-[#b99b6117] px-[8px] py-[6px] text-[11px] text-[#dfd4ad]"
                                    ><AppIcon :name="dice.icon" :size="15" />{{ dice.name }}</span
                                ></template
                            >
                            <span v-else class="text-[11px] text-[#918861]">标准骰子</span>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    </div>
</template>
