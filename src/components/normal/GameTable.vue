<!-- 游戏牌桌、骰子选择、保留区、掷骰与收分操作。 -->
<script setup>
import AppIcon from "../framework/AppIcon.vue";
import Die from "../framework/Die.vue";
// props 汇总牌桌所需的对局状态、选骰状态、计分预览和可执行动作约束。
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
defineEmits(["toggleDie", "suggest", "roll", "bank", "nextTurn", "openSetup", "openWinner", "openActivity"]);

// 按钮骨架与两种配色：拆自原 .button / .button-primary / .button-secondary。
const button =
    "flex min-h-[49px] items-center gap-[10px] rounded-[7px] border px-[18px] py-[14px] text-[clamp(12px,1vw,13px)] font-semibold transition-[background,transform,box-shadow] duration-200 max-mob:text-[12px] max-nar:min-h-[47px] max-nar:px-3 max-nar:py-[13px]";
const primary =
    "border-[#d2edaf] bg-lime text-[#26351c] shadow-[0_3px_0_#8ba65e] enabled:hover:-translate-y-px enabled:hover:bg-[#d3f1ac] enabled:hover:shadow-[0_4px_0_#8ba65e,0_8px_20px_#07180722] enabled:active:translate-y-0.5 enabled:active:shadow-[0_1px_0_#8ba65e] disabled:border-[#8aa66a50] disabled:bg-[#638251] disabled:text-[#bdd3ab] disabled:opacity-65 disabled:shadow-[0_3px_0_#455f36]";
const secondary =
    "border-[#a3c07f54] bg-[#49613b28] text-[#c4d5b3] enabled:hover:border-[#a3c07f90] enabled:hover:bg-[#77935935] disabled:border-[#86a06d30] disabled:bg-[#94b47808] disabled:text-[#829a72] disabled:opacity-70";
</script>
<template>
    <section
        class="relative overflow-hidden rounded-xl px-[30px] pb-5 pt-[21px] shadow-[inset_0_0_70px_#0a211820,0_12px_24px_#00000008] before:pointer-events-none before:absolute before:inset-2 before:rounded-[7px] before:border before:border-[#b8d68e09] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:opacity-[0.16] after:mix-blend-soft-light after:content-[''] after:table-noise wide:px-8 wide:pb-[21px] wide:pt-[23px] max-mid:px-[23px] max-nar:rounded-[10px] max-nar:px-[15px] max-nar:pb-5 max-nar:pt-[19px] max-tab:px-[29px] max-tab:py-[23px]"
        :class="
            game.phase === 'farkle'
                ? 'border border-[#be87676b] bg-[radial-gradient(ellipse_at_50%_35%,#443b2c,#2d3425)]'
                : game.finalStarter !== null
                  ? 'border border-[#c7b47e80] bg-[radial-gradient(ellipse_at_50%_35%,#274d37_0,#203f2e_42%,#1b3427_100%)]'
                  : 'border border-[#52754f7a] bg-[radial-gradient(ellipse_at_50%_35%,#274d37_0,#203f2e_42%,#1b3427_100%)]'
        "
        aria-label="骰子牌桌"
    >
        <div class="absolute left-2 top-2 z-[2] size-[9px] rounded-tl-[2px] border-l border-t border-[#b8d38b66]"></div>
        <div
            class="absolute right-2 top-2 z-[2] size-[9px] rounded-tr-[2px] border-r border-t border-[#b8d38b66]"
        ></div>
        <div
            class="absolute bottom-2 left-2 z-[2] size-[9px] rounded-bl-[2px] border-b border-l border-[#b8d38b66]"
        ></div>
        <div
            class="absolute bottom-2 right-2 z-[2] size-[9px] rounded-br-[2px] border-b border-r border-[#b8d38b66]"
        ></div>
        <!-- 内容层：统一抬到牌桌纹理之上，替代原来的子元素选择器。 -->
        <div class="relative z-[1]">
            <div
                class="flex items-center justify-between text-[clamp(10px,0.85vw,11px)] tracking-[1.6px] text-[#a5b79b] max-mob:text-[10px] max-nar:tracking-[1px]"
            >
                <span class="flex items-center gap-[7px] max-nar:gap-[5px]"
                    ><span
                        class="inline-block size-[5px] shrink-0 rounded-full bg-lime shadow-[0_0_9px_#c5e99520] max-nar:size-1"
                    ></span
                    >{{
                        game.finalStarter !== null
                            ? "最后一回合 · FINAL ROUND"
                            : `第 ${String(round).padStart(2, "0")} 轮`
                    }}</span
                ><span
                    class="text-[clamp(8px,0.75vw,9px)] tracking-[1.5px] text-[#709275] max-mob:text-[10px] max-nar:tracking-[0.8px]"
                    >SIX DICE. INFINITE POSSIBILITIES.</span
                >
            </div>
            <div
                v-if="game.finalStarter !== null && game.phase !== 'finished'"
                class="-mb-[14px] mt-[15px] flex items-center justify-center gap-1.5 text-center text-[clamp(10px,0.85vw,11px)] leading-[1.6] text-[#e3d6a6] max-mob:text-[10px]"
            >
                <AppIcon name="trophy" :size="13" />{{
                    game.players[game.finalStarter].name
                }}已达目标，对手还有最后一次机会。
            </div>
            <div class="pt-[30px] text-center wide:pt-[33px] max-tab:pt-[29px] max-nar:pt-[29px]">
                <div class="text-[clamp(12px,1vw,13px)] tracking-[2px] text-[#a5bb9c] max-nar:text-[9px]">
                    {{
                        game.phase === "farkle"
                            ? "这一掷，运气暂时离场"
                            : game.phase === "finished"
                              ? "THANKS FOR PLAYING"
                              : "本回合累计"
                    }}
                </div>
                <div
                    class="mt-2 flex items-baseline justify-center gap-2 font-numeric leading-[1.2] tabular-nums"
                    :class="
                        game.phase === 'farkle'
                            ? 'py-[5px] text-[47px] font-bold tracking-[1px] text-[#efc198] max-nar:py-[7px] max-nar:text-[41px]'
                            : 'text-[59px] font-medium tracking-[-2px] text-[#f0f3df] max-nar:text-[53px]'
                    "
                >
                    {{ game.phase === "farkle" ? "FARKLE!" : format(game.turnScore)
                    }}<span
                        v-if="game.phase !== 'farkle'"
                        class="text-[11px] font-normal tracking-[0.6px] text-[#8aa984]"
                        >pts</span
                    >
                </div>
                <p
                    class="mt-[9px] min-h-[17px] text-[clamp(12px,1vw,13px)] leading-[1.7] text-[#9bb496] max-mob:text-[12px] max-nar:mt-2 max-nar:min-h-[29px] max-nar:px-[5px] max-nar:leading-[1.8]"
                    role="status"
                    aria-live="polite"
                >
                    {{ headline }}
                </p>
            </div>
            <div
                class="flex min-h-[136px] items-center justify-center gap-[19px] pb-[22px] pt-[29px] wide:gap-[23px] max-mid:gap-[15px] max-tab:min-h-[143px] max-tab:gap-6 max-nar:min-h-[112px] max-nar:gap-[11px] max-nar:pb-[19px] max-nar:pt-6 max-tiny:gap-2"
                :class="{
                    '[&>*]:saturate-[0.7] [&>*[aria-hidden]]:opacity-[0.88]': game.phase === 'ready' || showHandoff,
                    '[&>*]:opacity-[0.65]': game.phase === 'farkle',
                }"
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
            <div
                class="flex min-h-7 flex-wrap items-center justify-center gap-[10px] text-[clamp(12px,1vw,13px)] max-nar:gap-[7px]"
                :class="selected.length && !chosenScore ? 'text-[#f3c59f]' : 'text-[#a0b79a]'"
            >
                <span>{{ selectionText }}</span
                ><span v-if="chosenScore" class="font-semibold text-[#d1efa5]">+{{ format(chosenScore) }} 分</span
                ><button
                    v-if="game.phase === 'selecting' && !isAi && !rolling"
                    class="inline-flex items-center gap-1 border-0 border-b border-[#c5df9a40] bg-transparent py-1 text-[clamp(11px,0.95vw,12px)] text-[#c5df9a] hover:text-[#e3ffc1] max-mob:text-[11px]"
                    @click="$emit('suggest')"
                >
                    <AppIcon name="spark" :size="12" />帮我选
                </button>
            </div>
            <div
                class="mt-[9px] mb-5 flex min-h-12 items-center gap-3 border-y border-[#c1dd9a14] max-nar:mb-[18px] max-nar:mt-[10px] max-nar:min-h-[45px] max-nar:gap-[9px]"
            >
                <span
                    class="flex shrink-0 items-center gap-[5px] text-[clamp(10px,0.85vw,11px)] text-[#94aa8b] max-mob:text-[11px] max-nar:gap-1"
                    ><AppIcon name="shield" :size="13" />已保留</span
                >
                <div v-if="game.kept.length" class="flex flex-wrap items-center gap-[9px] py-[7px] max-nar:gap-[5px]">
                    <span
                        v-for="(group, index) in game.kept"
                        :key="index"
                        class="flex items-center gap-1 opacity-75 [&+&]:border-l [&+&]:border-[#adca8b30] [&+&]:pl-[9px] max-nar:gap-[3px] max-nar:[&+&]:pl-[5px]"
                        :title="`第 ${group.roll} 次投掷，${group.score} 分`"
                        ><Die
                            v-for="(value, i) in group.values"
                            :key="i"
                            :value="value"
                            :index="i"
                            class="max-nar:size-5 max-nar:p-[3px]"
                            small
                            decorative
                    /></span>
                </div>
                <span v-else class="text-[clamp(10px,0.85vw,11px)] text-[#74916e] max-mob:text-[11px]"
                    >等待你的第一个得分组合</span
                ><span
                    class="ml-auto whitespace-nowrap text-[clamp(9px,0.75vw,10px)] text-[#7e9976] max-mob:text-[11px] max-tiny:hidden"
                    >组合仅限同一次投掷</span
                >
            </div>
            <div v-if="showHandoff" class="flex min-h-[52px] items-center justify-center [&>button]:w-full">
                <div
                    v-if="game.mode === 'ai'"
                    class="flex items-center gap-3 text-[clamp(12px,1vw,13px)] text-[#b7c99f] max-mob:text-[12px]"
                >
                    <span
                        class="flex gap-1 [&>i]:size-1 [&>i]:animate-blink [&>i]:rounded-full [&>i]:bg-lime [&>i:nth-child(2)]:[animation-delay:0.2s] [&>i:nth-child(3)]:[animation-delay:0.4s]"
                        ><i></i><i></i><i></i
                    ></span>
                    正在交接回合
                </div>
                <button v-else :class="[button, primary, 'justify-center max-nar:gap-2']" @click="$emit('nextTurn')">
                    {{
                        game.finalStarter !== null && game.active !== game.finalStarter
                            ? "查看最终结果"
                            : `交给${game.players[1 - game.active].name}`
                    }}<AppIcon name="arrow" :size="18" />
                </button>
            </div>
            <div v-else-if="game.phase === 'finished'" class="grid grid-cols-3 gap-3 max-mob:grid-cols-1">
                <button :class="[button, primary, 'justify-center max-nar:gap-2']" @click="$emit('openSetup')">
                    <AppIcon name="restart" :size="18" />再来一局</button
                ><button :class="[button, secondary, 'justify-center max-nar:gap-2']" @click="$emit('openWinner')">
                    查看结果<AppIcon name="trophy" :size="17" />
                </button>
                <button
                    :class="[button, secondary, 'justify-center whitespace-nowrap max-nar:gap-2']"
                    @click="$emit('openActivity')"
                >
                    查看动态详情<AppIcon name="history" :size="17" />
                </button>
            </div>
            <div
                v-else
                class="grid grid-cols-[1.08fr_1fr] gap-3 max-tab:grid-cols-2 max-nar:grid-cols-[1.05fr_1fr] max-nar:gap-[10px]"
            >
                <button
                    :class="[
                        button,
                        primary,
                        'justify-start pl-[23px] max-mid:pl-[17px] max-nar:gap-2 max-nar:pl-[14px] max-tiny:text-[9px]',
                        '[&>svg:last-child]:ml-auto max-nar:[&>svg:first-child]:w-[18px] max-nar:[&>svg:last-child]:w-[15px]',
                    ]"
                    :disabled="!canRollNow"
                    @click="$emit('roll')"
                >
                    <AppIcon name="dice" :size="21" /><span>{{
                        rolling ? "掷骰中…" : isAi ? "NOVA 思考中…" : game.phase === "ready" ? "掷出骰子" : "继续掷骰"
                    }}</span
                    ><span
                        v-if="game.phase === 'selecting' && !rolling && !isAi"
                        class="ml-px border-l border-[#3c571e30] pl-[9px] text-[clamp(11px,0.95vw,12px)] font-medium max-mob:text-[11px] max-nar:pl-1.5 max-tiny:hidden"
                        >{{ nextDiceCount }} 颗</span
                    ><AppIcon name="arrow" :size="17" /></button
                ><button
                    :class="[
                        button,
                        secondary,
                        'justify-center max-nar:flex-wrap max-nar:gap-1.5 max-nar:px-2 max-nar:py-[13px] max-tiny:text-[9px]',
                        'max-mid:gap-[7px] max-mid:px-[10px] max-mid:py-[13px] max-nar:[&>svg]:w-[15px]',
                    ]"
                    :disabled="!canBankNow"
                    :title="
                        entryMissing ? `首次收分需在同一回合累计至少 ${format(entryScore)} 分` : '把本回合得分加入总分'
                    "
                    @click="$emit('bank')"
                >
                    <AppIcon name="bank" :size="18" /><span>收分 · 结束回合</span
                    ><strong
                        v-if="canBankNow"
                        class="text-[clamp(11px,0.95vw,12px)] font-semibold text-lime max-mob:text-[11px]"
                        >+{{ format(pendingScore) }}</strong
                    >
                </button>
            </div>
            <div
                class="mt-[18px] flex min-h-[13px] items-center justify-center gap-1.5 text-[clamp(10px,0.85vw,11px)] leading-[1.6] text-[#819d75] max-mob:text-[10px] max-nar:mt-4 max-nar:gap-[5px]"
            >
                <template v-if="validSelection && !showHandoff && !rolling"
                    ><AppIcon name="info" :size="12" /><span>{{
                        entryMissing
                            ? `首次收分还差 ${entryScore - pendingScore} 分，需继续掷骰。`
                            : `下次掷 ${nextDiceCount} 颗，爆骰概率约 ${nextRisk}%。冒险还是收手？`
                    }}</span></template
                ><template v-else
                    ><AppIcon name="info" :size="12" /><span
                        >没有得分组合即爆骰，本回合未收分得分全部归零。</span
                    ></template
                >
            </div>
        </div>
    </section>
</template>
