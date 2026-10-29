<!-- 模式切换、新对局入口以及双方玩家总分与进度。 -->
<script setup>
import AppIcon from "../framework/AppIcon.vue";
defineProps({ game: Object, targetScore: Number, format: Function, difficultyLabels: Object, progress: Function });
defineEmits(["selectMode", "openSetup"]);
</script>
<template>
    <div>
        <div class="game-toolbar">
            <div class="mode-tabs" role="group" aria-label="游戏模式">
                <button
                    :class="{ active: game.mode === 'ai' }"
                    :aria-pressed="game.mode === 'ai'"
                    @click="$emit('selectMode', 'ai')"
                >
                    <AppIcon name="bot" :size="16" />单人对战 <span class="mode-tag">AI</span>
                </button>
                <button
                    :class="{ active: game.mode === 'local' }"
                    :aria-pressed="game.mode === 'local'"
                    @click="$emit('selectMode', 'local')"
                >
                    <AppIcon name="users" :size="16" />本地双人
                </button>
            </div>
            <button class="text-button new-game-button" @click="$emit('openSetup')">
                <AppIcon name="restart" :size="16" /><span>新对局</span>
            </button>
        </div>
        <div class="scoreboard">
            <article
                v-for="(p, index) in game.players"
                :key="index"
                class="player-card"
                :class="{ 'is-active': game.active === index && game.phase !== 'finished', 'player-two': index === 1 }"
                :aria-label="`${p.name}，总分 ${p.score}`"
            >
                <div class="player-card-top">
                    <div class="player-avatar">
                        <AppIcon :name="index === 1 && game.mode === 'ai' ? 'bot' : 'user'" :size="21" />
                    </div>
                    <div class="player-identity">
                        <h2>{{ p.name }}<span v-if="index === 1 && game.mode === 'ai'" class="ai-label">AI</span></h2>
                        <span>{{
                            index === 1 && game.mode === "ai"
                                ? difficultyLabels[game.difficulty] + "对手"
                                : "PLAYER 0" + (index + 1)
                        }}</span>
                    </div>
                    <span v-if="game.active === index && game.phase !== 'finished'" class="current-badge"
                        ><i></i>当前回合</span
                    ><span v-else class="waiting-label">{{ game.phase === "finished" ? "对局结束" : "等待中" }}</span>
                </div>
                <div class="score-number">
                    {{ format(p.score) }}<span>/ {{ format(targetScore) }}</span>
                </div>
                <div
                    class="score-progress"
                    role="progressbar"
                    :aria-label="`${p.name}的目标进度`"
                    :aria-valuenow="Math.min(p.score, targetScore)"
                    :aria-valuemin="0"
                    :aria-valuemax="targetScore"
                >
                    <div :style="{ width: progress(p.score) }"></div>
                </div>
            </article>
        </div>
    </div>
</template>
