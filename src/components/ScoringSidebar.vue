<!-- 计分速查、Hot Dice 提示、首次收分门槛和格言。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
import Die from "./Die.vue";
defineProps({ format: Function, entryScore: Number });
defineEmits(["openRules"]);
</script>
<template>
    <aside class="sidebar" aria-label="计分与玩法提示">
        <section class="score-guide">
            <div class="section-title">
                <h2><AppIcon name="dice" :size="17" />计分速查</h2>
                <span class="reference-badge">QUICK GUIDE</span>
            </div>
            <p class="guide-description">记住这些组合，让每一掷更有把握。</p>
            <div class="single-scoring">
                <div>
                    <Die :value="1" decorative small /><span>单个 1</span><strong>100<small>分</small></strong>
                </div>
                <div>
                    <Die :value="5" decorative small /><span>单个 5</span><strong>50<small>分</small></strong>
                </div>
            </div>
            <div class="guide-divider"></div>
            <div class="score-rule">
                <span>三个 1</span><strong>300<small>分</small></strong>
            </div>
            <div class="score-rule"><span>三个 2 — 6</span><strong>点数 × 100</strong></div>
            <div class="score-rule">
                <span>四 / 五 / 六同</span><strong class="compact-score">1,000 / 2,000 / 3,000</strong>
            </div>
            <div class="guide-divider"></div>
            <div class="score-rule">
                <span>1–6 顺子</span><strong>1,500<small>分</small></strong>
            </div>
            <div class="score-rule">
                <span>三对<span class="rule-hint">2 + 2 + 2</span></span
                ><strong>1,500<small>分</small></strong>
            </div>
            <div class="score-rule">
                <span>四同 + 一对</span><strong>1,500<small>分</small></strong>
            </div>
            <div class="score-rule">
                <span>两组三同</span><strong>2,500<small>分</small></strong>
            </div>
            <button class="full-rules-link" @click="$emit('openRules')">
                查看完整规则与示例<AppIcon name="diagonal" :size="15" />
            </button>
        </section>
        <section class="hot-dice-card">
            <div class="hot-dice-icon"><AppIcon name="flame" :size="25" /></div>
            <div>
                <span class="hot-eyebrow">WHEN THE DICE ARE HOT</span>
                <h3>六骰全中，好运加码。</h3>
                <p>六颗骰子全部计分？保留累计得分，重新掷出全部六颗骰子。冒险继续。</p>
                <span class="hot-tag"><span class="green-dot"></span> HOT DICE · 火热再掷</span>
            </div>
        </section>
        <div class="entry-note">
            <AppIcon name="shield" :size="16" />
            <p v-if="entryScore > 0">首次收分，至少累计 <strong>{{ format(entryScore) }} 分</strong>。<br />之后每回合随时可以见好就收。</p>
            <p v-else>首次收分无最低门槛。<br />选择有效计分骰子即可落袋为安。</p>
        </div>
        <div class="sidebar-quote">
            <span>✧</span>
            <p>运气决定点数<br /><strong>勇气决定下一掷</strong></p>
        </div>
    </aside>
</template>
