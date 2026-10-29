<!-- 页面顶部品牌、音效开关和玩法规则入口。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
defineProps({ sound: Boolean });
defineEmits(["toggleSound", "openRules"]);
</script>

<template>
    <header class="site-header">
        <a class="brand" href="./" aria-label="Farkle 首页">
            <span class="brand-mark"><AppIcon name="dice" :size="27" /></span>farkle<span class="brand-period">.</span>
        </a>
        <span class="header-motto">A LITTLE LUCK. A LOT OF NERVE.</span>
        <nav aria-label="游戏工具">
            <button
                class="sound-toggle"
                :aria-label="sound ? '关闭音效' : '开启音效'"
                :aria-pressed="sound"
                @click="$emit('toggleSound')"
            >
                <AppIcon :name="sound ? 'sound' : 'mute'" :size="18" /><span>{{
                    sound ? "音效开启" : "音效关闭"
                }}</span></button
            ><span class="nav-divider"></span>
            <button class="rules-button" @click="$emit('openRules')"><AppIcon name="book" :size="17" />玩法规则</button>
        </nav>
    </header>
</template>
