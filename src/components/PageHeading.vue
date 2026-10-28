<!-- 页面主标题、产品标语和当前获胜目标展示。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
defineProps({ targetScore: Number, format: Function });
</script>
<template>
    <section class="page-heading">
        <div>
            <div class="eyebrow"><span class="green-dot"></span> ROLL THE DICE. OWN THE MOMENT.</div>
            <h1>再掷一次，<span>好运在手。</span></h1>
            <p>是落袋为安，还是放手一搏？让每一次选择，都值得心跳。</p>
        </div>
        <div class="target-badge">
            <span class="target-icon"><AppIcon name="trophy" :size="24" /></span>
            <div>
                <small>本局目标</small><strong>{{ format(targetScore) }}<span>分</span></strong>
            </div>
        </div>
    </section>
</template>
