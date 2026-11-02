<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import { RULES_SOURCE } from "../../game/scoring.js";
import { createDialogStyles } from "./dialogStyles.js";

// GameDialogs 在 rules 状态下挂载此内容；游戏设置由 game prop 提供，关闭动作向上 emit。
const props = defineProps({ game: Object, format: Function, theme: String });
const emit = defineEmits(["close"]);
const styles = computed(() => createDialogStyles(props.theme));
const firstBankRule = computed(() =>
    (props.game.entryScore ?? 500) === 0
        ? "首次收分不设最低门槛，只需选择有效计分骰子。"
        : `首次收分需在同一回合累计至少 ${props.format(props.game.entryScore ?? 500)} 分；之后没有最低门槛。`,
);
const steps = [
    {
        title: "掷骰，选出得分组合",
        detail: "每回合从六颗骰子开始。每次投掷后，选出至少一颗可计分骰子；不计分的 2、3、4、6 不能单独保留。组合必须来自同一次投掷。",
    },
    { title: "继续冒险，还是落袋为安？", detail: "继续掷剩余骰子，或点击「收分」将本回合得分加入总分。" },
    {
        title: "小心 Farkle，也期待 Hot Dice",
        detail: "新掷的骰子完全没有计分组合，即爆骰：本回合未收分得分归零。若六颗骰子全部计分，则可以保留本回合得分，重新掷全部六颗。",
    },
    {
        title: "最后一次机会，最后一搏",
        detail: "有人达到本局目标分数后，对手还有最后一回合。最终总分较高者获胜；同分则平局。",
    },
];
</script>

<template>
    <section>
        <div :class="styles.eyebrow">A QUICK GUIDE TO GOOD TIMES</div>
        <h2 id="rules-title" :class="[styles.h2, 'mt-4.25']">六颗骰子，一场冒险。</h2>
        <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#96a68a] max-mob:text-[12px]">
            两位玩家轮流掷骰，争取先达到本局自定义获胜分数。
        </p>
        <ol class="my-6.75 grid list-none gap-5.25 p-0 max-nar:gap-4.75">
            <li v-for="(step, index) in steps" :key="step.title" class="flex gap-3.5 max-nar:gap-2.75">
                <span class="pt-px text-[11px] text-[#b7cc92]">0{{ index + 1 }}</span>
                <div>
                    <h3 class="mb-1.25 text-[clamp(13px,1.1vw,14px)] font-medium text-[#d7e4c5] max-mob:text-[13px]">
                        {{ step.title }}
                    </h3>
                    <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.9] text-[#9aa990] max-mob:text-[12px]">
                        {{ index === 1 ? step.detail + firstBankRule : step.detail }}
                    </p>
                </div>
            </li>
        </ol>
        <div class="flex gap-2.5 rounded-[7px] border border-[#afcc7f22] bg-[#abc57405] p-3.5 text-[#b0c294]">
            <AppIcon name="spark" :size="18" />
            <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.9] text-[#a5b694] max-mob:text-[12px]">
                例如掷出 <strong class="font-medium text-[#d0e5b5]">1、5、2、3、4、6</strong>，你可以选 1 和 5 得 150
                分，或选择全部六颗以顺子获得
                <strong class="font-medium text-[#d0e5b5]">1,500 分</strong>。不同次投掷的同点数不能拼成三同。
            </p>
        </div>
        <p class="mt-4 text-[9px] leading-[1.9] text-[#7e926e]">
            本作采用
            <a
                class="inline border-b border-[#bdcd9e55] text-[#bdcd9e] [&>svg]:ml-0.75"
                :href="RULES_SOURCE"
                target="_blank"
                rel="noopener noreferrer">
                PlayMonster Farkle 规则<AppIcon name="diagonal" :size="11" /> </a
            >。不同版本的计分可能有所差异，以本页速查表为准。
        </p>
        <button
            :class="[styles.button, styles.primary, 'mt-6.25 w-full justify-center [&>svg:last-child]:ml-auto']"
            @click="emit('close')">
            明白了，骰子交给我<AppIcon name="arrow" :size="17" />
        </button>
    </section>
</template>
