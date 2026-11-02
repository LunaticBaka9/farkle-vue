<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import { createDialogStyles } from "./dialogStyles.js";

// GameDialogs 在 setup 状态下挂载此表单；父级持有草稿状态并接收 update 与 submit 事件。
const props = defineProps({
    setupMode: String,
    setupDifficulty: String,
    setupTargetScore: Number,
    setupEntryScore: Number,
    setupNames: Array,
    targetInputValid: Boolean,
    entryInputValid: Boolean,
    format: Function,
    theme: String,
});
const emit = defineEmits([
    "newGame",
    "update:setupMode",
    "update:setupDifficulty",
    "update:setupTargetScore",
    "update:setupEntryScore",
    "update:setupNames",
]);
const styles = computed(() => createDialogStyles(props.theme));
const mode = computed({ get: () => props.setupMode, set: (value) => emit("update:setupMode", value) });
const difficulty = computed({
    get: () => props.setupDifficulty,
    set: (value) => emit("update:setupDifficulty", value),
});
const target = computed({ get: () => props.setupTargetScore, set: (value) => emit("update:setupTargetScore", value) });
const entryScore = computed({
    get: () => props.setupEntryScore,
    set: (value) => emit("update:setupEntryScore", value),
});
</script>

<template>
    <form @submit.prevent="emit('newGame')">
        <div :class="styles.eyebrow">A FRESH START</div>
        <h2 id="setup-title" :class="[styles.h2, 'mt-4.25']">新的对局，新的可能。</h2>
        <p class="text-[clamp(12px,1vw,13px)] leading-[1.8] text-[#96a68a] max-mob:text-[12px]">
            选择对手和目标分数，开始一场为你定制的对决。
        </p>
        <div class="mb-6 mt-6.75 grid grid-cols-2 gap-3 max-nar:gap-2.25">
            <button
                type="button"
                class="flex flex-col items-start gap-3.25 rounded-lg border px-4.25 py-4.75 text-left max-nar:p-[16px_12px]"
                :class="
                    mode === 'ai'
                        ? 'border-[#c5e99590] bg-[#a8c58110] text-lime'
                        : 'border-[#d1e4ad22] bg-[#152116] text-[#9faf8f]'
                "
                :aria-pressed="mode === 'ai'"
                @click="mode = 'ai'">
                <AppIcon name="bot" :size="26" />
                <strong class="text-[clamp(13px,1.1vw,14px)] font-medium max-mob:text-[13px]">挑战 NOVA</strong>
                <span class="-mt-1.25 text-[clamp(11px,0.95vw,12px)] text-[#91a37e] max-mob:text-[12px]"
                    >单人 · 与 AI 对战</span
                >
            </button>
            <button
                type="button"
                class="flex flex-col items-start gap-3.25 rounded-lg border px-4.25 py-[19px] text-left max-nar:p-[16px_12px]"
                :class="
                    mode === 'local'
                        ? 'border-[#c5e99590] bg-[#a8c58110] text-lime'
                        : 'border-[#d1e4ad22] bg-[#152116] text-[#9faf8f]'
                "
                :aria-pressed="mode === 'local'"
                @click="mode = 'local'">
                <AppIcon name="users" :size="26" />
                <strong class="text-[clamp(13px,1.1vw,14px)] font-medium max-mob:text-[13px]">和朋友来一局</strong>
                <span class="-mt-1.25 text-[clamp(11px,0.95vw,12px)] text-[#91a37e] max-mob:text-[12px]"
                    >双人 · 本地轮流游玩</span
                >
            </button>
        </div>
        <div class="mb-5.5">
            <label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]" for="target-score"
                >获胜分数</label
            >
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
                    class="mt-2.25 w-full rounded-md border bg-[#152016] py-3 pl-3 pr-10 font-numeric text-[15px] tabular-nums text-[#d9e6c7] placeholder:text-[#6e8060]"
                    :class="props.targetInputValid ? 'border-[#c5e9952c]' : 'border-[#e6a385]'"
                    :aria-invalid="!props.targetInputValid"
                    aria-describedby="target-score-hint" />
                <span
                    class="pointer-events-none absolute right-3.25 top-1/2 translate-y-[-20%] text-[clamp(11px,0.95vw,12px)] text-[#93a380] max-mob:text-[12px]"
                    >分</span
                >
            </div>
            <div class="mt-2.25 flex gap-2" aria-label="常用目标分数">
                <button
                    v-for="item in [5000, 10000, 15000]"
                    :key="item"
                    type="button"
                    :class="[
                        styles.preset,
                        Number(target) === item
                            ? 'border-[#c5e99575] bg-[#a8c58112] text-lime'
                            : 'border-[#c5e99524] bg-[#152016] text-[#91a37e] hover:border-[#c5e99575] hover:bg-[#a8c58112] hover:text-lime',
                    ]"
                    :aria-pressed="Number(target) === item"
                    @click="target = item">
                    {{ props.format(item) }}
                </button>
            </div>
            <p
                id="target-score-hint"
                :class="[styles.fieldHint, props.targetInputValid ? 'text-[#849778]' : 'text-[#edb092]']">
                {{
                    props.targetInputValid
                        ? "可设为 1,000–100,000 分，每次递增 500 分。默认 10,000 分。"
                        : "请输入 1,000–100,000 之间的 500 倍数。"
                }}
            </p>
        </div>
        <div class="mb-5.5">
            <label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]" for="entry-score"
                >首次收分门槛</label
            >
            <div class="relative mt-2.25">
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
                    :class="props.entryInputValid ? 'border-[#c5e9952c]' : 'border-[#e6a385]'"
                    :aria-invalid="!props.entryInputValid"
                    aria-describedby="entry-score-hint" />
                <span
                    class="pointer-events-none absolute right-3.25 top-1/2 translate-y-[-20%] text-[clamp(11px,0.95vw,12px)] text-[#93a380] max-mob:text-[12px]"
                    >分</span
                >
            </div>
            <div class="mt-2.25 flex gap-2" aria-label="常用首次收分门槛">
                <button
                    v-for="item in [0, 300, 500, 1000]"
                    :key="item"
                    type="button"
                    :class="[
                        styles.preset,
                        Number(entryScore) === item
                            ? 'border-[#c5e99575] bg-[#a8c58112] text-lime'
                            : 'border-[#c5e99524] bg-[#152016] text-[#91a37e] hover:border-[#c5e99575] hover:bg-[#a8c58112] hover:text-lime',
                    ]"
                    :aria-pressed="Number(entryScore) === item"
                    @click="entryScore = item">
                    {{ item === 0 ? "无限制" : props.format(item) }}
                </button>
            </div>
            <p
                id="entry-score-hint"
                :class="[styles.fieldHint, props.entryInputValid ? 'text-[#849778]' : 'text-[#edb092]']">
                {{
                    props.entryInputValid
                        ? Number(entryScore) === 0
                            ? "无限制：首次收分只需选择有效计分骰子。默认门槛为 500 分。"
                            : "首次收分需在同一回合累计达到该分数，之后不再限制。"
                        : "请输入 0–10,000 之间的 50 倍数。"
                }}
            </p>
        </div>
        <template v-if="mode === 'ai'">
            <label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]" for="ai-difficulty"
                >AI 风格</label
            >
            <select id="ai-difficulty" v-model="difficulty" :class="styles.field">
                <option value="cautious">稳健型 — 见好就收</option>
                <option value="balanced">均衡型 — 权衡风险与回报</option>
                <option value="bold">冒险型 — 让好运再飞一会</option>
            </select>
        </template>
        <div v-else class="grid grid-cols-2 gap-[13px]">
            <label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]">
                玩家一<input
                    :value="props.setupNames[0]"
                    maxlength="24"
                    placeholder="玩家一"
                    autocomplete="off"
                    :class="styles.field"
                    @input="emit('update:setupNames', [$event.target.value, props.setupNames[1]])" />
            </label>
            <label class="block text-[clamp(12px,1vw,13px)] text-[#bdcda9] max-mob:text-[12px]">
                玩家二<input
                    :value="props.setupNames[1]"
                    maxlength="24"
                    placeholder="玩家二"
                    autocomplete="off"
                    :class="styles.field"
                    @input="emit('update:setupNames', [props.setupNames[0], $event.target.value])" />
            </label>
        </div>
        <p
            class="mt-[23px] flex items-center gap-1.5 text-[clamp(11px,0.95vw,12px)] leading-[1.7] text-[#94a580] max-mob:text-[12px]">
            <AppIcon name="info" :size="14" />开始新对局将重置当前得分及对局记录。
        </p>
        <button
            type="submit"
            :class="[styles.button, styles.primary, 'mt-[25px] w-full justify-center [&>svg:last-child]:ml-auto']"
            :disabled="!props.targetInputValid || !props.entryInputValid">
            开始新对局<AppIcon name="arrow" :size="18" />
        </button>
    </form>
</template>
