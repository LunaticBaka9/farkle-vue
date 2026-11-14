<script setup>
import { computed } from "vue";
import AppIcon from "../AppIcon.vue";
import { RULES_SOURCE } from "../../game/scoring.js";

// GameDialogs 在 rules 状态下挂载此内容；游戏设置由 game prop 提供，关闭动作向上 emit。
const props = defineProps({ game: Object, format: Function, theme: String });
const emit = defineEmits(["close"]);
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
        <div class="dlg-eyebrow">A QUICK GUIDE TO GOOD TIMES</div>
        <h2 id="rules-title" class="dlg-h2 rules-heading">六颗骰子，一场冒险。</h2>
        <p class="dlg-lede">两位玩家轮流掷骰，争取先达到本局自定义获胜分数。</p>
        <ol class="rules-steps">
            <li v-for="(step, index) in steps" :key="step.title" class="rules-step">
                <span class="rules-index">0{{ index + 1 }}</span>
                <div>
                    <h3 class="rules-step-title">{{ step.title }}</h3>
                    <p class="rules-step-text">{{ index === 1 ? step.detail + firstBankRule : step.detail }}</p>
                </div>
            </li>
        </ol>
        <div class="rules-example">
            <AppIcon name="spark" :size="18" />
            <p class="rules-example-text">
                例如掷出 <strong class="rules-highlight">1、5、2、3、4、6</strong>，你可以选 1 和 5 得 150
                分，或选择全部六颗以顺子获得
                <strong class="rules-highlight">1,500 分</strong>。不同次投掷的同点数不能拼成三同。
            </p>
        </div>
        <p class="rules-source">
            本作采用<a class="rules-link" :href="RULES_SOURCE" target="_blank" rel="noopener noreferrer"
                >PlayMonster Farkle 规则<AppIcon name="diagonal" :size="11" /></a
            >。不同版本的计分可能有所差异，以本页速查表为准。
        </p>
        <button class="dlg-btn primary rules-close" @click="emit('close')">
            明白了，骰子交给我<AppIcon name="arrow" :size="17" />
        </button>
    </section>
</template>

<style scoped>
/* 标题与眉题之间的间距。 */
.rules-heading {
    margin-top: 17px;
}

/* 规则步骤列表：纵向排列，步骤之间留 21px。 */
.rules-steps {
    display: grid;
    gap: 21px;
    margin: 27px 0;
    padding: 0;
}

/* 窄屏规则列表：收紧步骤间距。 */
@media (max-width: 520px) {
    .rules-steps {
        gap: 19px;
    }
}

/* 单个规则步骤：序号与正文横向排列。 */
.rules-step {
    display: flex;
    gap: 14px;
}

/* 窄屏规则步骤：收紧序号与正文间距。 */
@media (max-width: 520px) {
    .rules-step {
        gap: 11px;
    }
}

/* 步骤序号：小号浅绿数字，与标题首行对齐。 */
.rules-index {
    padding-top: 1px;
    color: #b7cc92;
    font-size: 11px;
}

/* 步骤标题：比正文略大，强调操作顺序。 */
.rules-step-title {
    margin-bottom: 5px;
    color: #d7e4c5;
    font-size: clamp(13px, 1.1vw, 14px);
    font-weight: 500;
}

/* 窄屏步骤标题：固定 13px。 */
@media (max-width: 700px) {
    .rules-step-title {
        font-size: 13px;
    }
}

/* 步骤正文：较大的行高保证长句可读性。 */
.rules-step-text {
    color: #9aa990;
    font-size: clamp(11px, 0.95vw, 12px);
    line-height: 1.9;
}

/* 窄屏步骤正文：固定 12px。 */
@media (max-width: 700px) {
    .rules-step-text {
        font-size: 12px;
    }
}

/* 示例提示框：浅绿描边与极淡底色。 */
.rules-example {
    display: flex;
    gap: 10px;
    padding: 14px;
    border: 1px solid #afcc7f22;
    border-radius: 7px;
    background: #abc57405;
    color: #b0c294;
}

/* 示例正文：比步骤正文略浅，避免抢主内容。 */
.rules-example-text {
    color: #a5b694;
    font-size: clamp(11px, 0.95vw, 12px);
    line-height: 1.9;
}

/* 窄屏示例正文：固定 12px。 */
@media (max-width: 700px) {
    .rules-example-text {
        font-size: 12px;
    }
}

/* 示例中的关键数字：略亮且加粗。 */
.rules-highlight {
    color: #d0e5b5;
    font-weight: 500;
}

/* 规则来源说明：最小的辅助文字。 */
.rules-source {
    margin-top: 16px;
    color: #7e926e;
    font-size: 12px;
    line-height: 1.9;
}

/* 外部规则链接：下划线式强调。 */
.rules-link {
    display: inline;
    border-bottom: 1px solid #bdcd9e55;
    color: #bdcd9e;
    white-space: nowrap; /* 保证链接文字和右上角小箭头永远粘在一起，绝不拆行！ */
}

/* 链接尾部箭头：紧贴文字。 */
.rules-link > svg {
    margin-left: 3px;
    display: inline-block;
    flex-shrink: 0;
}

/* 底部关闭按钮：占满宽度并居中。 */
.rules-close {
    justify-content: center;
    width: 100%;
    margin-top: 25px;
}

/* 关闭按钮尾部图标：推到最右侧。 */
.rules-close > svg:last-child {
    margin-left: auto;
}
</style>
