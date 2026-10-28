<!-- 页面底部品牌、说明和局数规格展示。 -->
<script setup>
defineProps({ targetScore: Number, format: Function });
</script>
<template>
    <footer class="site-footer">
        <span class="footer-brand">farkle<span>.</span><small>ROLL. RISK. REPEAT.</small></span
        ><span>为每一个「再来一次」的瞬间而作。</span
        ><span class="footer-spec">6 DICE <i>/</i> 2 PLAYERS <i>/</i> {{ format(targetScore) }} POINTS</span>
    </footer>
</template>
