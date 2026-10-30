<!-- 规则说明、对局设置和最终结果弹窗。 -->
<!--
  弹窗组件集中管理规则、对局设置和获胜结果三种界面。
  组件不直接修改对局状态，而是向父组合式逻辑发出带参数的事件。
-->
<!-- 弹窗组件集中管理规则、对局设置和获胜结果；它不直接修改对局状态。 -->
<script setup>
// computed 提供双向表单桥接，nextTick/watch 用于同步原生 dialog DOM 状态。
import { computed, nextTick, ref, watch } from "vue";
import AppIcon from "./AppIcon.vue";
import { RULES_SOURCE } from "../../game/scoring.js";

// Props 是只读输入：组件根据 modal 决定展示哪一种弹窗。

const {
    modal,
    game,
    format,
    winnerLabel,
    setupMode,
    setupDifficulty,
    setupTargetScore,
    setupEntryScore,
    setupNames,
    targetInputValid,
    entryInputValid,
} = defineProps({
    modal: String,
    game: Object,
    format: Function,
    winnerLabel: String,
    setupMode: String,
    setupDifficulty: String,
    setupTargetScore: Number,
    setupEntryScore: Number,
    setupNames: Array,
    targetInputValid: Boolean,
    entryInputValid: Boolean,
});
// Emits 将用户操作明确回传给 App；setup 表单字段由父组件保存。
// Emits 将用户操作回传给父组件；setup 表单字段仍由父组件保存。
const emit = defineEmits([
    "close",
    "newGame",
    "openSetup",
    "update:setupMode",
    "update:setupDifficulty",
    "update:setupTargetScore",
    "update:setupEntryScore",
    "update:setupNames",
    "openActivity",
]);
// dialog 指向原生 <dialog> 元素，用于调用浏览器的 showModal/close API。
// dialog 指向原生 <dialog>，用于调用 showModal 和 close。
const dialog = ref(null);

// computed 把模板中的 v-model 转为受控表单：读取 props、写入 emit。

// 这些计算属性把模板中的 v-model 转换为“读 props、写 emit”的受控表单模式。
const mode = computed({ get: () => setupMode, set: (v) => emit("update:setupMode", v) });
const difficulty = computed({ get: () => setupDifficulty, set: (v) => emit("update:setupDifficulty", v) });
const target = computed({ get: () => setupTargetScore, set: (v) => emit("update:setupTargetScore", v) });
const entryScore = computed({ get: () => setupEntryScore, set: (v) => emit("update:setupEntryScore", v) });
// modal 同时控制模板分支和原生弹窗的打开状态。
// 等 DOM 更新后再调用 showModal，确保弹窗内容已经渲染完成。
// 等 Vue 完成 DOM 更新后，再同步原生弹窗的打开状态。
watch(
    () => modal,
    async (value) => {
        await nextTick();
        if (value && !dialog.value.open) dialog.value.showModal();
        else if (!value && dialog.value.open) dialog.value.close();
    },
);

// 按钮与表单控件骨架：拆自原 .button / input / select 等基础规则。
const button = "flex min-h-[49px] items-center gap-[10px] rounded-[7px] border px-[18px] py-[14px] text-[clamp(12px,1vw,13px)] font-semibold transition-[background,transform,box-shadow] duration-200 max-mob:text-[12px] max-nar:min-h-[47px] max-nar:gap-2 max-nar:px-3 max-nar:py-[13px]";
const primary =
    "border-[#d2edaf] bg-lime text-[#26351c] shadow-[0_3px_0_#8ba65e] enabled:hover:-translate-y-px enabled:hover:bg-[#d3f1ac] enabled:hover:shadow-[0_4px_0_#8ba65e,0_8px_20px_#07180722] enabled:active:translate-y-0.5 enabled:active:shadow-[0_1px_0_#8ba65e] disabled:border-[#8aa66a50] disabled:bg-[#638251] disabled:text-[#bdd3ab] disabled:opacity-65 disabled:shadow-[0_3px_0_#455f36]";
const secondary =
    "border-[#a3c07f54] bg-[#49613b28] text-[#c4d5b3] enabled:hover:border-[#a3c07f90] enabled:hover:bg-[#77935935] disabled:border-[#86a06d30] disabled:bg-[#94b47808] disabled:text-[#829a72] disabled:opacity-70";
const field =
    "mt-[9px] w-full rounded-md border border-[#c5e9952c] bg-[#152016] p-3 text-[clamp(12px,1vw,13px)] text-[#d9e6c7] placeholder:text-[#6e8060] max-mob:text-[12px]";
const h2 = "mb-3 text-[25px] font-semibold tracking-[-0.4px] max-nar:text-[23px]";
const eyebrow =
    "flex items-center gap-2 text-[clamp(8px,0.7vw,9px)] font-semibold tracking-[2px] text-[#acbf97] max-mob:text-[8px] max-nar:gap-1.5 max-nar:tracking-[1.4px]";
const preset = "rounded-[5px] border px-[10px] py-[5px] text-[clamp(11px,0.95vw,12px)] max-mob:text-[12px]";
const fieldHint = "mt-[7px] text-[clamp(11px,0.95vw,12px)] leading-[1.6] max-mob:text-[12px]";
const finalTagBase =
    "ml-[7px] inline-block rounded-[3px] border border-[#b8a26b26] px-1 py-0.5 text-[clamp(9px,0.75vw,10px)] max-nar:ml-1 max-nar:text-[6px]";
</script>
<template>
    <!-- 原生 dialog 提供焦点管理、模态遮罩和 Escape 取消支持。 -->
    <dialog
        ref="dialog"
        class="fixed m-auto max-h-[calc(100dvh-48px)] w-[min(540px,calc(100vw-32px))] overscroll-contain rounded-2xl border border-[#a8c18355] bg-[linear-gradient(130deg,#273225,#18241c)] p-[35px] text-[#e4ecdc] shadow-[0_25px_100px_#0008] backdrop:bg-[#07100bc9] backdrop:backdrop-blur-[8px] max-nar:max-h-[calc(100dvh-32px)] max-nar:p-[30px_23px]"
        :aria-labelledby="
            modal === 'rules'
                ? 'rules-title'
                : modal === 'setup'
                  ? 'setup-title'
                  : modal === 'activity'
                    ? 'activity-title'
                    : 'winner-title'
        "
        @cancel.prevent="$emit('close')"
        @click="
            (event) => {
                if (event.target === dialog) $emit('close');
            }
        "
    >
        <button
            class="absolute right-4 top-4 grid place-items-center rounded-[5px] border-0 bg-transparent p-1.5 text-[#8d9f80] hover:bg-[#ffffff08] hover:text-[#e2efd1]"
            aria-label="关闭弹窗"
            @click="$emit('close')"
        >
            <AppIcon name="close" :size="20" />
        </button>
        <!-- 规则弹窗：展示回合流程、计分说明和规则来源。 -->
        <!-- 规则弹窗：展示四个回合步骤、示例说明、规则来源和确认按钮。 -->
        <section v-if="modal === 'rules'">
            <div :class="eyebrow">A QUICK GUIDE TO GOOD TIMES</div>
            <h2 id="rules-title" :class="[h2, 'mt-[17px]']">六颗骰子，一场冒险。</h2>
            <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#96a68a] max-mob:text-[12px]">
                两位玩家轮流掷骰，争取先达到本局自定义获胜分数。
            </p>
            <ol class="my-[27px] grid list-none gap-[21px] p-0 max-nar:gap-[19px]">
                <li class="flex gap-[14px] max-nar:gap-[11px]">
                    <span class="pt-px text-[11px] text-[#b7cc92]">01</span>
                    <div>
                        <h3 class="mb-[5px] text-[clamp(13px,1.1vw,14px)] font-medium text-[#d7e4c5] max-mob:text-[13px]">掷骰，选出得分组合</h3>
                        <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.9] text-[#9aa990] max-mob:text-[12px]">
                            每回合从六颗骰子开始。每次投掷后，选出至少一颗可计分骰子；不计分的 2、3、4、6
                            不能单独保留。组合必须来自同一次投掷。
                        </p>
                    </div>
                </li>
                <li class="flex gap-[14px] max-nar:gap-[11px]">
                    <span class="pt-px text-[11px] text-[#b7cc92]">02</span>
                    <div>
                        <h3 class="mb-[5px] text-[clamp(13px,1.1vw,14px)] font-medium text-[#d7e4c5] max-mob:text-[13px]">继续冒险，还是落袋为安？</h3>
                        <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.9] text-[#9aa990] max-mob:text-[12px]">
                            继续掷剩余骰子，或点击「收分」将本回合得分加入总分。{{
                                (game.entryScore ?? 500) === 0
                                    ? "首次收分不设最低门槛，只需选择有效计分骰子。"
                                    : `首次收分需在同一回合累计至少 ${format(game.entryScore ?? 500)} 分；之后没有最低门槛。`
                            }}
                        </p>
                    </div>
                </li>
                <li class="flex gap-[14px] max-nar:gap-[11px]">
                    <span class="pt-px text-[11px] text-[#b7cc92]">03</span>
                    <div>
                        <h3 class="mb-[5px] text-[clamp(13px,1.1vw,14px)] font-medium text-[#d7e4c5] max-mob:text-[13px]">
                            小心 Farkle，也期待 Hot Dice
                        </h3>
                        <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.9] text-[#9aa990] max-mob:text-[12px]">
                            新掷的骰子完全没有计分组合，即爆骰：本回合未收分得分归零。若六颗骰子全部计分，则可以保留本回合得分，重新掷全部六颗。
                        </p>
                    </div>
                </li>
                <li class="flex gap-[14px] max-nar:gap-[11px]">
                    <span class="pt-px text-[11px] text-[#b7cc92]">04</span>
                    <div>
                        <h3 class="mb-[5px] text-[clamp(13px,1.1vw,14px)] font-medium text-[#d7e4c5] max-mob:text-[13px]">最后一次机会，最后一搏</h3>
                        <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.9] text-[#9aa990] max-mob:text-[12px]">
                            有人达到本局目标分数后，对手还有最后一回合。最终总分较高者获胜；同分则平局。
                        </p>
                    </div>
                </li>
            </ol>
            <div class="flex gap-[10px] rounded-[7px] border border-[#afcc7f22] bg-[#abc57405] p-[14px] text-[#b0c294]">
                <AppIcon name="spark" :size="18" />
                <p class="text-[clamp(11px,0.95vw,12px)] leading-[1.9] text-[#a5b694] max-mob:text-[12px]">
                    例如掷出 <strong class="font-medium text-[#d0e5b5]">1、5、2、3、4、6</strong>，你可以选 1 和 5 得 150 分，或选择全部六颗以顺子获得
                    <strong class="font-medium text-[#d0e5b5]">1,500 分</strong>。不同次投掷的同点数不能拼成三同。
                </p>
            </div>
            <p class="mt-4 text-[9px] leading-[1.9] text-[#7e926e]">
                本作采用
                <a
                    class="inline border-b border-[#bdcd9e55] text-[#bdcd9e] [&>svg]:ml-[3px]"
                    :href="RULES_SOURCE"
                    target="_blank"
                    rel="noopener noreferrer"
                    >PlayMonster Farkle 规则<AppIcon name="diagonal" :size="11" /></a
                >。不同版本的计分可能有所差异，以本页速查表为准。
            </p>
            <button :class="[button, primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']" @click="$emit('close')">
                明白了，骰子交给我<AppIcon name="arrow" :size="17" />
            </button>
        </section>

        <!-- 对局设置弹窗：受控表单通过 emit 汇报模式、目标分数、AI 难度和玩家名。 -->
        <form v-else-if="modal === 'setup'" @submit.prevent="$emit('newGame')">
            <div :class="eyebrow">A FRESH START</div>
            <h2 id="setup-title" :class="[h2, 'mt-[17px]']">新的对局，新的可能。</h2>
            <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#96a68a] max-mob:text-[12px]">
                选择对手和目标分数，开始一场为你定制的对决。
            </p>
            <div class="mb-6 mt-[27px] grid grid-cols-2 gap-3 max-nar:gap-[9px]">
                <button
                    type="button"
                    class="flex flex-col items-start gap-[13px] rounded-lg border px-[17px] py-[19px] text-left max-nar:p-[16px_12px]"
                    :class="
                        mode === 'ai'
                            ? 'border-[#c5e99590] bg-[#a8c58110] text-lime'
                            : 'border-[#d1e4ad22] bg-[#152116] text-[#9faf8f]'
                    "
                    :aria-pressed="mode === 'ai'"
                    @click="mode = 'ai'"
                >
                    <AppIcon name="bot" :size="26" /><strong class="text-[clamp(13px,1.1vw,14px)] font-medium max-mob:text-[13px]"
                        >挑战 NOVA</strong
                    ><span class="-mt-[5px] text-[clamp(11px,0.95vw,12px)] text-[#91a37e] max-mob:text-[12px]">单人 · 与 AI 对战</span></button
                ><button
                    type="button"
                    class="flex flex-col items-start gap-[13px] rounded-lg border px-[17px] py-[19px] text-left max-nar:p-[16px_12px]"
                    :class="
                        mode === 'local'
                            ? 'border-[#c5e99590] bg-[#a8c58110] text-lime'
                            : 'border-[#d1e4ad22] bg-[#152116] text-[#9faf8f]'
                    "
                    :aria-pressed="mode === 'local'"
                    @click="mode = 'local'"
                >
                    <AppIcon name="users" :size="26" /><strong class="text-[clamp(13px,1.1vw,14px)] font-medium max-mob:text-[13px]"
                        >和朋友来一局</strong
                    ><span class="-mt-[5px] text-[clamp(11px,0.95vw,12px)] text-[#91a37e] max-mob:text-[12px]">双人 · 本地轮流游玩</span>
                </button>
            </div>
            <div class="mb-[22px]">
                <label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]" for="target-score">获胜分数</label>
                <div class="relative">
                    <input
                        id="target-score"
                        v-model.number="target"
                        type="number"
                        inputmode="numeric"
                        min="1000"
                        max="100000"
                        step="500"
                        required
                        class="mt-[9px] w-full rounded-md border bg-[#152016] py-3 pl-3 pr-10 font-numeric text-[15px] tabular-nums text-[#d9e6c7] placeholder:text-[#6e8060]"
                        :class="targetInputValid ? 'border-[#c5e9952c]' : 'border-[#e6a385]'"
                        :aria-invalid="!targetInputValid"
                        aria-describedby="target-score-hint"
                    /><span
                        class="pointer-events-none absolute right-[13px] top-1/2 -translate-y-[20%] text-[clamp(11px,0.95vw,12px)] text-[#93a380] max-mob:text-[12px]"
                        >分</span
                    >
                </div>
                <div class="mt-[9px] flex gap-2" aria-label="常用目标分数">
                    <button
                        v-for="item in [5000, 10000, 15000]"
                        :key="item"
                        type="button"
                        :class="[
                            preset,
                            Number(target) === item
                                ? 'border-[#c5e99575] bg-[#a8c58112] text-lime'
                                : 'border-[#c5e99524] bg-[#152016] text-[#91a37e] hover:border-[#c5e99575] hover:bg-[#a8c58112] hover:text-lime',
                        ]"
                        :aria-pressed="Number(target) === item"
                        @click="target = item"
                    >
                        {{ format(item) }}
                    </button>
                </div>
                <p
                    id="target-score-hint"
                    :class="[fieldHint, targetInputValid ? 'text-[#849778]' : 'text-[#edb092]']"
                >
                    {{
                        targetInputValid
                            ? "可设为 1,000–100,000 分，每次递增 500 分。默认 10,000 分。"
                            : "请输入 1,000–100,000 之间的 500 倍数。"
                    }}
                </p>
            </div>
            <div class="mb-[22px]">
                <label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]" for="entry-score">首次收分门槛</label>
                <div class="relative mt-[9px]">
                    <input
                        id="entry-score"
                        v-model.number="entryScore"
                        type="number"
                        inputmode="numeric"
                        min="0"
                        max="10000"
                        step="50"
                        required
                        class="w-full rounded-md border bg-[#152016] py-3 pl-3 pr-10 font-numeric text-[15px] tabular-nums text-[#d9e6c7] placeholder:text-[#6e8060]"
                        :class="entryInputValid ? 'border-[#c5e9952c]' : 'border-[#e6a385]'"
                        :aria-invalid="!entryInputValid"
                        aria-describedby="entry-score-hint"
                    /><span
                        class="pointer-events-none absolute right-[13px] top-1/2 -translate-y-[20%] text-[clamp(11px,0.95vw,12px)] text-[#93a380] max-mob:text-[12px]"
                        >分</span
                    >
                </div>
                <div class="mt-[9px] flex gap-2" aria-label="常用首次收分门槛">
                    <button
                        v-for="item in [0, 300, 500, 1000]"
                        :key="item"
                        type="button"
                        :class="[
                            preset,
                            Number(entryScore) === item
                                ? 'border-[#c5e99575] bg-[#a8c58112] text-lime'
                                : 'border-[#c5e99524] bg-[#152016] text-[#91a37e] hover:border-[#c5e99575] hover:bg-[#a8c58112] hover:text-lime',
                        ]"
                        :aria-pressed="Number(entryScore) === item"
                        @click="entryScore = item"
                    >
                        {{ item === 0 ? "无限制" : format(item) }}
                    </button>
                </div>
                <p id="entry-score-hint" :class="[fieldHint, entryInputValid ? 'text-[#849778]' : 'text-[#edb092]']">
                    {{
                        entryInputValid
                            ? Number(entryScore) === 0
                                ? "无限制：首次收分只需选择有效计分骰子。默认门槛为 500 分。"
                                : "首次收分需在同一回合累计达到该分数，之后不再限制。"
                            : "请输入 0–10,000 之间的 50 倍数。"
                    }}
                </p>
            </div>

            <template v-if="mode === 'ai'"
                ><label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]" for="ai-difficulty">AI 风格</label
                ><select id="ai-difficulty" v-model="difficulty" :class="field">
                    <option value="cautious">稳健型 — 见好就收</option>
                    <option value="balanced">均衡型 — 权衡风险与回报</option>
                    <option value="bold">冒险型 — 让好运再飞一会</option>
                </select></template
            >
            <div v-else class="grid grid-cols-2 gap-[13px]">
                <label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]"
                    >玩家一<input
                        :value="setupNames[0]"
                        maxlength="24"
                        placeholder="玩家一"
                        autocomplete="off"
                        :class="field"
                        @input="$emit('update:setupNames', [$event.target.value, setupNames[1]])" /></label
                ><label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]"
                    >玩家二<input
                        :value="setupNames[1]"
                        maxlength="24"
                        placeholder="玩家二"
                        autocomplete="off"
                        :class="field"
                        @input="$emit('update:setupNames', [setupNames[0], $event.target.value])"
                /></label>
            </div>
            <p class="mt-[23px] flex items-center gap-1.5 text-[clamp(11px,0.95vw,12px)] leading-[1.7] text-[#94a580] max-mob:text-[12px]">
                <AppIcon name="info" :size="14" />开始新对局将重置当前得分及对局记录。
            </p>
            <button
                type="submit"
                :class="[button, primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']"
                :disabled="!targetInputValid || !entryInputValid"
            >
                开始新对局<AppIcon name="arrow" :size="18" />
            </button>
        </form>
        <!-- 对局动态弹窗：展示本局全部收分和 Farkle 记录，不截取最近五条。 -->
        <section v-else-if="modal === 'activity'" class="max-h-[min(760px,calc(100vh-48px))] max-w-[620px] overflow-y-auto p-[44px_48px_38px] max-mob:p-[38px_22px_24px]">
            <div :class="eyebrow">THE COMPLETE STORY</div>
            <h2 id="activity-title" :class="[h2, 'mt-2']">本局动态详情</h2>
            <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#96a68a] max-mob:text-[12px]">
                按时间顺序回顾当前对局的全部收分与 Farkle 动态。
            </p>
            <ol v-if="game.history.length" class="my-6 grid max-h-[430px] list-none gap-[10px] overflow-y-auto p-0">
                <li
                    v-for="event in game.history"
                    :key="event.id"
                    class="flex min-h-[58px] items-center gap-[10px] border-b border-line pb-[10px] max-mob:items-start"
                >
                    <span
                        class="grid size-[18px] shrink-0 place-items-center rounded-full"
                        :class="event.type === 'bank' ? 'bg-[#c5e99510] text-[#bdda96]' : 'bg-[#c0947315] text-[#d4a783]'"
                    >
                        <AppIcon :name="event.type === 'bank' ? 'check' : 'close'" :size="12" />
                    </span>
                    <div class="min-w-0 flex-1">
                        <strong class="mr-[7px] text-[#d4dfca]">{{ event.name }}</strong>
                        <span
                            class="text-[clamp(12px,1vw,13px)] text-[#93a28a] max-mob:mt-1 max-mob:block max-mob:text-[13px]"
                            >{{ event.type === "bank" ? "落袋为安" : "遭遇 Farkle" }}</span
                        >
                        <small
                            class="ml-2 inline-block text-[clamp(10px,0.85vw,11px)] text-[#75846e] max-mob:ml-0 max-mob:mt-1 max-mob:block max-mob:text-[11px]"
                            >第 {{ Math.ceil(event.turn / 2) }} 轮</small
                        >
                        <small
                            v-if="event.final"
                            :class="[
                                finalTagBase,
                                'text-[#d8c18b] max-mob:ml-0 max-mob:mt-1 max-mob:block max-mob:text-[11px]',
                            ]"
                            >触发最终回合</small
                        >
                    </div>
                    <b>
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
                class="my-6 grid min-h-[180px] place-content-center justify-items-center gap-3 rounded-xl border border-dashed border-line text-[#75846e]"
            >
                <AppIcon name="history" :size="28" />
                <p>当前对局还没有收分或 Farkle 动态。</p>
            </div>
            <button :class="[button, primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']" @click="$emit('close')">
                返回对局<AppIcon name="arrow" :size="17" />
            </button>
        </section>
        <!-- 结果弹窗：根据 game.winner 展示获胜者或平局，并汇总最终得分。 -->
        <!-- 结果弹窗：展示获胜者或平局，并汇总两个玩家的最终得分。 -->
        <section v-else-if="modal === 'winner'" class="pt-[5px] text-center">
            <div
                class="mx-auto mb-[25px] grid size-[90px] place-items-center rounded-full border border-[#c5e9953a] bg-[radial-gradient(#c5e99516,#c5e99502)] text-lime shadow-[0_0_40px_#c5e99508]"
            >
                <AppIcon name="trophy" :size="45" />
            </div>
            <div class="flex items-center justify-center gap-2 text-[7px] font-semibold tracking-[2px] text-[#acbf97]">WHAT A GAME. WHAT A JOURNEY.</div>
            <h2 id="winner-title" :class="[h2, 'mt-[17px] break-words max-nar:text-[26px]']">{{ winnerLabel }}</h2>
            <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#96a68a] max-mob:text-[12px]">
                {{
                    game.winner === "tie" ? "旗鼓相当的对手，值得再来一局。" : "每一次果断收手，每一次勇敢再掷，都算数。"
                }}
            </p>
            <div class="mt-[26px] grid grid-cols-2 rounded-lg border border-[#cadfa424] bg-[#0a140c33] py-[23px]">
                <div
                    v-for="(p, i) in game.players"
                    :key="i"
                    class="flex min-w-0 flex-col items-center gap-[10px]"
                    :class="i > 0 ? 'border-l border-[#b1c58c21]' : ''"
                >
                    <span class="break-words px-2 text-[clamp(12px,1vw,13px)] text-[#a5b691] max-mob:text-[12px]">{{ p.name }}</span
                    ><strong
                        class="font-numeric text-[32px] font-normal tracking-[-0.5px] max-nar:text-[30px]"
                        :class="game.winner === i ? 'text-lime' : 'text-[#cedbc0]'"
                        >{{ format(p.score) }}</strong
                    ><small
                        class="text-[clamp(9px,0.75vw,10px)] tracking-[2px] max-mob:text-[9px]"
                        :class="game.winner === i ? 'text-lime' : 'text-[#839474]'"
                        >{{ game.winner === i ? "WINNER" : "POINTS" }}</small
                    >
                </div>
            </div>
            <button :class="[button, primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']" @click="$emit('openSetup')">
                再来一局<AppIcon name="restart" :size="17" /></button
            ><button :class="[button, secondary, 'mt-[9px] w-full justify-center']" @click="$emit('openActivity')">
                查看动态详情<AppIcon name="history" :size="17" /></button
            ><button
                class="mt-[18px] inline-flex items-center justify-center gap-[7px] border-0 bg-transparent py-[7px] text-[clamp(11px,0.95vw,12px)] text-[#8d9b88] hover:text-lime max-mob:text-[12px]"
                @click="$emit('close')"
            >
                回到牌桌查看记录
            </button>
        </section>
    </dialog>
</template>
