<script setup>
import AppIcon from "../framework/AppIcon.vue";
</script>

<template>
    <section class="mode-stage mode-stage--adventure" aria-label="冒险模式">
        <div class="mode-stage-header adventure-header">
            <span class="mode-kicker">ADVENTURE MAP</span>
            <h1>冒险模式</h1>
            <p>探索地图、遭遇事件，逐步展开另类 RPG 对局。</p>
        </div>
        <div class="adventure-map" aria-hidden="true">
            <span class="map-route map-route-a"></span>
            <span class="map-route map-route-b"></span>
            <span class="map-node map-node-a"></span>
            <span class="map-node map-node-b"></span>
            <span class="map-node map-node-c"></span>
            <AppIcon class="map-compass" name="map" :size="54" />
        </div>
    </section>
</template>
