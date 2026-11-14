<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";

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
        <div class="dlg-eyebrow">A FRESH START</div>
        <h2 id="setup-title" class="dlg-h2 setup-heading">新的对局，新的可能。</h2>
        <p class="dlg-lede">选择对手和目标分数，开始一场为你定制的对决。</p>
        <div class="setup-modes">
            <button
                type="button"
                class="setup-mode"
                :class="{ active: mode === 'ai' }"
                :aria-pressed="mode === 'ai'"
                @click="mode = 'ai'">
                <AppIcon name="bot" :size="26" />
                <strong class="setup-mode-title">挑战 NOVA</strong>
                <span class="setup-mode-sub">单人 · 与 AI 对战</span>
            </button>
            <button
                type="button"
                class="setup-mode"
                :class="{ active: mode === 'local' }"
                :aria-pressed="mode === 'local'"
                @click="mode = 'local'">
                <AppIcon name="users" :size="26" />
                <strong class="setup-mode-title">和朋友来一局</strong>
                <span class="setup-mode-sub">双人 · 本地轮流游玩</span>
            </button>
        </div>
        <div class="setup-block">
            <label class="setup-label" for="target-score">获胜分数</label>
            <div class="setup-input-wrap">
                <input
                    id="target-score"
                    v-model.number="target"
                    type="number"
                    inputmode="numeric"
                    min="1000"
                    max="100000"
                    step="500"
                    required
                    class="dlg-field score-input"
                    :class="{ invalid: !props.targetInputValid }"
                    :aria-invalid="!props.targetInputValid"
                    aria-describedby="target-score-hint" />
                <span class="score-unit">分</span>
            </div>
            <div class="preset-row" aria-label="常用目标分数">
                <button
                    v-for="item in [5000, 10000, 15000]"
                    :key="item"
                    type="button"
                    class="dlg-preset"
                    :class="{ active: Number(target) === item }"
                    :aria-pressed="Number(target) === item"
                    @click="target = item">
                    {{ props.format(item) }}
                </button>
            </div>
            <p
                id="target-score-hint"
                class="dlg-field-hint"
                :class="{ error: !props.targetInputValid }"
                aria-live="polite">
                {{
                    props.targetInputValid
                        ? "可设为 1,000–100,000 分，每次递增 500 分。默认 10,000 分。"
                        : "请输入 1,000–100,000 之间的 500 倍数。"
                }}
            </p>
        </div>
        <div class="setup-block">
            <label class="setup-label" for="entry-score">首次收分门槛</label>
            <div class="setup-input-wrap">
                <input
                    id="entry-score"
                    v-model.number="entryScore"
                    type="number"
                    inputmode="numeric"
                    min="0"
                    max="10000"
                    step="50"
                    required
                    class="dlg-field score-input"
                    :class="{ invalid: !props.entryInputValid }"
                    :aria-invalid="!props.entryInputValid"
                    aria-describedby="entry-score-hint" />
                <span class="score-unit">分</span>
            </div>
            <div class="preset-row" aria-label="常用首次收分门槛">
                <button
                    v-for="item in [0, 300, 500, 1000]"
                    :key="item"
                    type="button"
                    class="dlg-preset"
                    :class="{ active: Number(entryScore) === item }"
                    :aria-pressed="Number(entryScore) === item"
                    @click="entryScore = item">
                    {{ item === 0 ? "无限制" : props.format(item) }}
                </button>
            </div>
            <p
                id="entry-score-hint"
                class="dlg-field-hint"
                :class="{ error: !props.entryInputValid }"
                aria-live="polite">
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
            <label class="setup-label" for="ai-difficulty">AI 风格</label>
            <select id="ai-difficulty" v-model="difficulty" class="dlg-field">
                <option value="cautious">稳健型 — 见好就收</option>
                <option value="balanced">均衡型 — 权衡风险与回报</option>
                <option value="bold">冒险型 — 让好运再飞一会</option>
            </select>
        </template>
        <div v-else class="setup-names">
            <label class="setup-label">
                玩家一<input
                    :value="props.setupNames[0]"
                    maxlength="24"
                    placeholder="玩家一"
                    autocomplete="off"
                    class="dlg-field"
                    @input="emit('update:setupNames', [$event.target.value, props.setupNames[1]])" />
            </label>
            <label class="setup-label">
                玩家二<input
                    :value="props.setupNames[1]"
                    maxlength="24"
                    placeholder="玩家二"
                    autocomplete="off"
                    class="dlg-field"
                    @input="emit('update:setupNames', [props.setupNames[0], $event.target.value])" />
            </label>
        </div>
        <p class="setup-info"><AppIcon name="info" :size="14" />开始新对局将重置当前得分及对局记录。</p>
        <button
            type="submit"
            class="dlg-btn primary setup-submit"
            :disabled="!props.targetInputValid || !props.entryInputValid">
            开始新对局<AppIcon name="arrow" :size="18" />
        </button>
    </form>
</template>

<style scoped>
/* 标题与引导段之间的固定留白，保持原视觉节奏。 */
.setup-heading {
    margin-top: 17px;
}

/* 对手类型选择区：双列卡片，窄屏收紧间距。 */
.setup-modes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin: 27px 0 24px;
}

/* 窄屏对手卡片：缩小卡片间距。 */
@media (max-width: 520px) {
    .setup-modes {
        gap: 9px;
    }
}

/* 对手类型卡片：默认未选中状态。 */
.setup-mode {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 13px;
    padding: 19px 17px;
    border: 1px solid #d1e4ad22;
    border-radius: 8px;
    background: #152116;
    color: #9faf8f;
    text-align: left;
}

/* 对手类型卡片选中态：品牌绿描边与浅绿底。 */
.setup-mode.active {
    border-color: #c5e99590;
    background: #a8c58110;
    color: var(--color-lime);
}

/* 窄屏对手卡片：压缩内边距。 */
@media (max-width: 520px) {
    .setup-mode {
        padding: 16px 12px;
    }
}

/* 对手卡片标题：比说明文字略大一号。 */
.setup-mode-title {
    font-size: clamp(13px, 1.1vw, 14px);
    font-weight: 500;
}

/* 窄屏对手卡片标题：固定 13px。 */
@media (max-width: 700px) {
    .setup-mode-title {
        font-size: 13px;
    }
}

/* 对手卡片说明：向上收紧，与标题形成紧凑组合。 */
.setup-mode-sub {
    margin-top: -5px;
    color: #91a37e;
    font-size: clamp(11px, 0.95vw, 12px);
}

/* 窄屏对手卡片说明：固定 12px。 */
@media (max-width: 700px) {
    .setup-mode-sub {
        font-size: 12px;
    }
}

/* 每个设置分组的下方间距。 */
.setup-block {
    margin-bottom: 22px;
}

/* 表单标签：统一字号与浅绿文字。 */
.setup-label {
    display: block;
    color: #bdcda9;
    font-size: clamp(12px, 1vw, 13px);
}

/* 窄屏表单标签：固定 12px。 */
@media (max-width: 700px) {
    .setup-label {
        font-size: 12px;
    }
}

/* 分数输入容器：为右侧“分”单位提供定位基准。 */
.setup-input-wrap {
    position: relative;
    margin-top: 9px;
}

/* 分数输入框：覆盖通用输入框上边距，并给右侧单位留出空间。 */
.score-input {
    margin-top: 0;
    padding-right: 40px;
    font-family: var(--font-numeric);
    font-size: 15px;
    font-variant-numeric: tabular-nums;
}

/* 分数输入框校验失败：暖橙色边框提示错误。 */
.score-input.invalid {
    border-color: #e6a385;
}

/* 输入框右侧单位：不拦截鼠标事件，垂直略偏上对齐数字。 */
.score-unit {
    position: absolute;
    top: 50%;
    right: 13px;
    pointer-events: none;
    transform: translateY(-20%);
    color: #93a380;
    font-size: clamp(11px, 0.95vw, 12px);
}

/* 窄屏单位文字：固定 12px。 */
@media (max-width: 700px) {
    .score-unit {
        font-size: 12px;
    }
}

/* 快捷分数行：按钮横向排列，空间不足时允许换行。 */
.preset-row {
    display: flex;
    gap: 8px;
    margin-top: 9px;
}

/* 本地双人姓名输入：两列排布。 */
.setup-names {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 13px;
}

/* 窄屏姓名输入：改为单列，避免两个输入框过窄。 */
@media (max-width: 520px) {
    .setup-names {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 底部说明：图标与提示文字同一行。 */
.setup-info {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 23px;
    color: #94a580;
    font-size: clamp(11px, 0.95vw, 12px);
    line-height: 1.7;
}

/* 窄屏底部说明：固定 12px。 */
@media (max-width: 700px) {
    .setup-info {
        font-size: 12px;
    }
}

/* 提交按钮：占满弹窗宽度并让尾部箭头靠右。 */
.setup-submit {
    justify-content: center;
    width: 100%;
    margin-top: 25px;
}

/* 提交按钮尾部图标：推到最右侧，与文字形成两端布局。 */
.setup-submit > svg:last-child {
    margin-left: auto;
}
</style>
