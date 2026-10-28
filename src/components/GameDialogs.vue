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
import { RULES_SOURCE } from "../game/scoring.js";

// Props 是只读输入：组件根据 modal 决定展示哪一种弹窗。

const { modal, game, format, winnerLabel, setupMode, setupDifficulty, setupTargetScore, setupNames, targetInputValid } =
    defineProps({
        modal: String,
        game: Object,
        format: Function,
        winnerLabel: String,
        setupMode: String,
        setupDifficulty: String,
        setupTargetScore: Number,
        setupNames: Array,
        targetInputValid: Boolean,
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
    "update:setupNames",
]);
// dialog 指向原生 <dialog> 元素，用于调用浏览器的 showModal/close API。
// dialog 指向原生 <dialog>，用于调用 showModal 和 close。
const dialog = ref(null);

// computed 把模板中的 v-model 转为受控表单：读取 props、写入 emit。

// 这些计算属性把模板中的 v-model 转换为“读 props、写 emit”的受控表单模式。
const mode = computed({ get: () => setupMode, set: (v) => emit("update:setupMode", v) });
const difficulty = computed({ get: () => setupDifficulty, set: (v) => emit("update:setupDifficulty", v) });
const target = computed({ get: () => setupTargetScore, set: (v) => emit("update:setupTargetScore", v) });
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
</script>
<template>
    <!-- 原生 dialog 提供焦点管理、模态遮罩和 Escape 取消支持。 -->
    <dialog
        ref="dialog"
        class="game-dialog"
        :aria-labelledby="modal === 'rules' ? 'rules-title' : modal === 'setup' ? 'setup-title' : 'winner-title'"
        @cancel.prevent="$emit('close')"
        @click="
            (event) => {
                if (event.target === dialog) $emit('close');
            }
        "
    >
        <button class="dialog-close" aria-label="关闭弹窗" @click="$emit('close')">
            <AppIcon name="close" :size="20" />
        </button>
        <!-- 规则弹窗：展示回合流程、计分说明和规则来源。 -->
                <!-- 规则弹窗：展示四个回合步骤、示例说明、规则来源和确认按钮。 -->
        <section v-if="modal === 'rules'" class="rules-content">
            <div class="eyebrow">A QUICK GUIDE TO GOOD TIMES</div>
            <h2 id="rules-title">六颗骰子，一场冒险。</h2>
            <p class="dialog-intro">两位玩家轮流掷骰，争取先达到本局自定义获胜分数。</p>
            <ol class="rules-steps">
                <li>
                    <span>01</span>
                    <div>
                        <h3>掷骰，选出得分组合</h3>
                        <p>
                            每回合从六颗骰子开始。每次投掷后，选出至少一颗可计分骰子；不计分的 2、3、4、6
                            不能单独保留。组合必须来自同一次投掷。
                        </p>
                    </div>
                </li>
                <li>
                    <span>02</span>
                    <div>
                        <h3>继续冒险，还是落袋为安？</h3>
                        <p>
                            继续掷剩余骰子，或点击「收分」将本回合得分加入总分。首次上分需要在同一回合累计至少 500
                            分，以后没有最低门槛。
                        </p>
                    </div>
                </li>
                <li>
                    <span>03</span>
                    <div>
                        <h3>小心 Farkle，也期待 Hot Dice</h3>
                        <p>
                            新掷的骰子完全没有计分组合，即爆骰：本回合未收分得分归零。若六颗骰子全部计分，则可以保留本回合得分，重新掷全部六颗。
                        </p>
                    </div>
                </li>
                <li>
                    <span>04</span>
                    <div>
                        <h3>最后一次机会，最后一搏</h3>
                        <p>有人达到本局目标分数后，对手还有最后一回合。最终总分较高者获胜；同分则平局。</p>
                    </div>
                </li>
            </ol>
            <div class="example-note">
                <AppIcon name="spark" :size="18" />
                <p>
                    例如掷出 <strong>1、5、2、3、4、6</strong>，你可以选 1 和 5 得 150 分，或选择全部六颗以顺子获得
                    <strong>1,500 分</strong>。不同次投掷的同点数不能拼成三同。
                </p>
            </div>
            <p class="rules-source">
                本作采用
                <a :href="RULES_SOURCE" target="_blank" rel="noopener noreferrer"
                    >PlayMonster Farkle 规则<AppIcon name="diagonal" :size="11" /></a
                >。不同版本的计分可能有所差异，以本页速查表为准。
            </p>
            <button class="button button-primary dialog-main-action" @click="$emit('close')">
                明白了，骰子交给我<AppIcon name="arrow" :size="17" />
            </button>
        </section>
        <!-- 对局设置弹窗：受控表单通过 emit 汇报模式、目标分数、AI 难度和玩家名。 -->
        <!-- 对局设置弹窗：表单只报告模式、目标分数、AI 难度和玩家名，不创建对局。 -->
        <form v-else-if="modal === 'setup'" class="setup-content" @submit.prevent="$emit('newGame')">
            <div class="eyebrow">A FRESH START</div>
            <h2 id="setup-title">新的对局，新的可能。</h2>
            <p class="dialog-intro">选择对手和目标分数，开始一场为你定制的对决。</p>
            <div class="setup-mode-options">
                <button
                    type="button"
                    :class="{ chosen: mode === 'ai' }"
                    :aria-pressed="mode === 'ai'"
                    @click="mode = 'ai'"
                >
                    <AppIcon name="bot" :size="26" /><strong>挑战 NOVA</strong><span>单人 · 与 AI 对战</span></button
                ><button
                    type="button"
                    :class="{ chosen: mode === 'local' }"
                    :aria-pressed="mode === 'local'"
                    @click="mode = 'local'"
                >
                    <AppIcon name="users" :size="26" /><strong>和朋友来一局</strong><span>双人 · 本地轮流游玩</span>
                </button>
            </div>
            <div class="target-setup">
                <label class="field-label" for="target-score">获胜分数</label>
                <div class="target-input-wrap">
                    <input
                        id="target-score"
                        v-model.number="target"
                        type="number"
                        inputmode="numeric"
                        min="1000"
                        max="100000"
                        step="500"
                        required
                        :aria-invalid="!targetInputValid"
                        aria-describedby="target-score-hint"
                    /><span>分</span>
                </div>
                <div class="target-presets" aria-label="常用目标分数">
                    <button
                        v-for="preset in [5000, 10000, 15000]"
                        :key="preset"
                        type="button"
                        :class="{ chosen: Number(target) === preset }"
                        :aria-pressed="Number(target) === preset"
                        @click="target = preset"
                    >
                        {{ format(preset) }}
                    </button>
                </div>
                <p id="target-score-hint" class="field-hint" :class="{ 'hint-error': !targetInputValid }">
                    {{
                        targetInputValid
                            ? "可设为 1,000–100,000 分，每次递增 500 分。默认 10,000 分。"
                            : "请输入 1,000–100,000 之间的 500 倍数。"
                    }}
                </p>
            </div>
            <template v-if="mode === 'ai'"
                ><label class="field-label" for="ai-difficulty">AI 风格</label
                ><select id="ai-difficulty" v-model="difficulty">
                    <option value="cautious">稳健型 — 见好就收</option>
                    <option value="balanced">均衡型 — 权衡风险与回报</option>
                    <option value="bold">冒险型 — 让好运再飞一会</option>
                </select></template
            >
            <div v-else class="name-fields">
                <label class="field-label"
                    >玩家一<input
                        :value="setupNames[0]"
                        maxlength="24"
                        placeholder="玩家一"
                        autocomplete="off"
                        @input="$emit('update:setupNames', [$event.target.value, setupNames[1]])" /></label
                ><label class="field-label"
                    >玩家二<input
                        :value="setupNames[1]"
                        maxlength="24"
                        placeholder="玩家二"
                        autocomplete="off"
                        @input="$emit('update:setupNames', [setupNames[0], $event.target.value])"
                /></label>
            </div>
            <p class="setup-notice"><AppIcon name="info" :size="14" />开始新对局将重置当前得分及对局记录。</p>
            <button type="submit" class="button button-primary dialog-main-action" :disabled="!targetInputValid">
                开始新对局<AppIcon name="arrow" :size="18" />
            </button>
        </form>
        <!-- 结果弹窗：根据 game.winner 展示获胜者或平局，并汇总最终得分。 -->
        <!-- 结果弹窗：展示获胜者或平局，并汇总两个玩家的最终得分。 -->
        <section v-else-if="modal === 'winner'" class="winner-content">
            <div class="winner-emblem"><AppIcon name="trophy" :size="45" /></div>
            <div class="eyebrow">WHAT A GAME. WHAT A JOURNEY.</div>
            <h2 id="winner-title">{{ winnerLabel }}</h2>
            <p class="dialog-intro">
                {{
                    game.winner === "tie"
                        ? "旗鼓相当的对手，值得再来一局。"
                        : "每一次果断收手，每一次勇敢再掷，都算数。"
                }}
            </p>
            <div class="final-scores">
                <div v-for="(p, i) in game.players" :key="i" :class="{ victorious: game.winner === i }">
                    <span>{{ p.name }}</span
                    ><strong>{{ format(p.score) }}</strong
                    ><small>{{ game.winner === i ? "WINNER" : "POINTS" }}</small>
                </div>
            </div>
            <button class="button button-primary dialog-main-action" @click="$emit('openSetup')">
                再来一局<AppIcon name="restart" :size="17" /></button
            ><button class="text-button return-table" @click="$emit('close')">回到牌桌查看记录</button>
        </section>
    </dialog>
</template>
