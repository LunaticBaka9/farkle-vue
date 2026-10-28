<!-- 游戏牌桌、骰子选择、保留区、掷骰与收分操作。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
import Die from "./Die.vue";
defineProps({
    game: Object,
    format: Function,
    round: Number,
    selected: Array,
    rolling: Boolean,
    rollingFaces: Array,
    isAi: Boolean,
    headline: String,
    selectionText: String,
    chosenScore: Number,
    pendingScore: Number,
    validSelection: Boolean,
    canRollNow: Boolean,
    canBankNow: Boolean,
    nextDiceCount: Number,
    nextRisk: Number,
    entryMissing: Boolean,
    showHandoff: Boolean,
    entryScore: Number,
});
defineEmits(["toggleDie", "suggest", "roll", "bank", "nextTurn", "openSetup", "openWinner"]);
</script>
<template>
    <section
        class="game-table"
        :class="{ 'table-farkle': game.phase === 'farkle', 'table-final': game.finalStarter !== null }"
        aria-label="骰子牌桌"
    >
        <div class="table-corner corner-tl"></div>
        <div class="table-corner corner-tr"></div>
        <div class="table-corner corner-bl"></div>
        <div class="table-corner corner-br"></div>
        <div class="table-topline">
            <span
                ><span class="green-dot"></span
                >{{
                    game.finalStarter !== null ? "最后一回合 · FINAL ROUND" : `第 ${String(round).padStart(2, "0")} 轮`
                }}</span
            ><span class="table-caption">SIX DICE. INFINITE POSSIBILITIES.</span>
        </div>
        <div v-if="game.finalStarter !== null && game.phase !== 'finished'" class="final-notice">
            <AppIcon name="trophy" :size="13" />{{
                game.players[game.finalStarter].name
            }}已达目标，对手还有最后一次机会。
        </div>
        <div class="turn-summary">
            <div class="table-overline">
                {{
                    game.phase === "farkle"
                        ? "这一掷，运气暂时离场"
                        : game.phase === "finished"
                          ? "THANKS FOR PLAYING"
                          : "本回合累计"
                }}
            </div>
            <div class="turn-score" :class="{ 'farkle-title': game.phase === 'farkle' }">
                {{ game.phase === "farkle" ? "FARKLE!" : format(game.turnScore)
                }}<span v-if="game.phase !== 'farkle'">pts</span>
            </div>
            <p class="turn-description" role="status" aria-live="polite">{{ headline }}</p>
        </div>
        <div
            class="dice-zone"
            :class="{ 'waiting-dice': game.phase === 'ready' || showHandoff, 'farkle-dice': game.phase === 'farkle' }"
        >
            <template v-if="rolling"
                ><Die
                    v-for="(value, index) in rollingFaces"
                    :key="index"
                    :value="value"
                    :index="index"
                    rolling
                    disabled
            /></template>
            <template v-else-if="game.dice.length"
                ><Die
                    v-for="(die, index) in game.dice"
                    :key="die.id"
                    :value="die.value"
                    :index="index"
                    :selected="selected.includes(die.id)"
                    :disabled="isAi || game.phase !== 'selecting'"
                    @select="$emit('toggleDie', die.id)"
            /></template>
            <template v-else
                ><Die
                    v-for="(value, index) in [1, 5, 3, 6, 2, 4]"
                    :key="index"
                    :value="value"
                    :index="index"
                    decorative
            /></template>
        </div>
        <div class="selection-line" :class="{ 'invalid-selection': selected.length && !chosenScore }">
            <span>{{ selectionText }}</span
            ><span v-if="chosenScore" class="selection-points">+{{ format(chosenScore) }} 分</span
            ><button
                v-if="game.phase === 'selecting' && !isAi && !rolling"
                class="suggest-button"
                @click="$emit('suggest')"
            >
                <AppIcon name="spark" :size="12" />帮我选
            </button>
        </div>
        <div class="kept-tray">
            <span class="kept-label"><AppIcon name="shield" :size="13" />已保留</span>
            <div v-if="game.kept.length" class="kept-groups">
                <span
                    v-for="(group, index) in game.kept"
                    :key="index"
                    class="kept-group"
                    :title="`第 ${group.roll} 次投掷，${group.score} 分`"
                    ><Die v-for="(value, i) in group.values" :key="i" :value="value" :index="i" small decorative
                /></span>
            </div>
            <span v-else class="kept-placeholder">等待你的第一个得分组合</span
            ><span class="kept-note">组合仅限同一次投掷</span>
        </div>
        <div v-if="showHandoff" class="handoff-actions">
            <div v-if="game.mode === 'ai'" class="auto-handoff">
                <span class="thinking-dots"><i></i><i></i><i></i></span> 正在交接回合
            </div>
            <button v-else class="button button-primary" @click="$emit('nextTurn')">
                {{
                    game.finalStarter !== null && game.active !== game.finalStarter
                        ? "查看最终结果"
                        : `交给${game.players[1 - game.active].name}`
                }}<AppIcon name="arrow" :size="18" />
            </button>
        </div>
        <div v-else-if="game.phase === 'finished'" class="finished-actions">
            <button class="button button-primary" @click="$emit('openSetup')">
                <AppIcon name="restart" :size="18" />再来一局</button
            ><button class="button button-secondary" @click="$emit('openWinner')">
                查看结果<AppIcon name="trophy" :size="17" />
            </button>
        </div>
        <div v-else class="table-actions">
            <button class="button button-primary roll-button" :disabled="!canRollNow" @click="$emit('roll')">
                <AppIcon name="dice" :size="21" /><span>{{
                    rolling ? "掷骰中…" : isAi ? "NOVA 思考中…" : game.phase === "ready" ? "掷出骰子" : "继续掷骰"
                }}</span
                ><span v-if="game.phase === 'selecting' && !rolling && !isAi" class="button-count"
                    >{{ nextDiceCount }} 颗</span
                ><AppIcon name="arrow" :size="17" /></button
            ><button
                class="button button-secondary bank-button"
                :disabled="!canBankNow"
                :title="entryMissing ? '首次收分需在同一回合累计至少 500 分' : '把本回合得分加入总分'"
                @click="$emit('bank')"
            >
                <AppIcon name="bank" :size="18" /><span>收分 · 结束回合</span
                ><strong v-if="canBankNow">+{{ format(pendingScore) }}</strong>
            </button>
        </div>
        <div class="table-footnote">
            <template v-if="validSelection && !showHandoff && !rolling"
                ><AppIcon name="info" :size="12" /><span>{{
                    entryMissing
                        ? `首次收分还差 ${entryScore - pendingScore} 分，需继续掷骰。`
                        : `下次掷 ${nextDiceCount} 颗，爆骰概率约 ${nextRisk}%。冒险还是收手？`
                }}</span></template
            ><template v-else
                ><AppIcon name="info" :size="12" /><span>没有得分组合即爆骰，本回合未收分得分全部归零。</span></template
            >
        </div>
    </section>
</template>
