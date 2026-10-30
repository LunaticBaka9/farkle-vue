<!-- 模式切换、新对局入口以及双方玩家总分与进度。 -->
<script setup>
import AppIcon from "../framework/AppIcon.vue";
// game/targetScore 提供当前对局信息；difficultyLabels/progress 负责显示 AI 难度和进度。
defineProps({ game: Object, targetScore: Number, format: Function, difficultyLabels: Object, progress: Function });
defineEmits(["selectMode", "openSetup"]);
</script>
<template>
    <div>
        <div class="mb-[19px] flex items-center justify-between gap-4 max-nar:mb-[15px] max-nar:gap-[10px]">
            <div
                class="inline-flex gap-1 rounded-lg border border-[#ffffff0a] bg-[#1a241c] p-1 max-nar:gap-0.5 max-nar:p-[3px]"
                role="group"
                aria-label="游戏模式"
            >
                <button
                    class="flex items-center justify-center gap-2 rounded-[5px] border border-transparent bg-transparent px-[15px] py-[9px] text-[clamp(12px,1vw,13px)] text-[#8d9a8c] max-nar:gap-1.5 max-nar:px-[11px] max-tiny:px-[9px]"
                    :class="
                        game.mode === 'ai'
                            ? 'border-[#a0c57d18] bg-[#34402b] text-lime shadow-[0_1px_3px_#0002]'
                            : 'hover:bg-[#ffffff04] hover:text-[#d6e0cd]'
                    "
                    :aria-pressed="game.mode === 'ai'"
                    @click="$emit('selectMode', 'ai')"
                >
                    <AppIcon class="max-nar:size-3.5" name="bot" :size="16" />单人对战
                    <span
                        class="rounded-[3px] bg-[#bfe79213] px-[3px] py-0.5 text-[clamp(9px,0.75vw,10px)] leading-[1.2] tracking-[0.5px] text-[#b7d28f]"
                        >AI</span
                    >
                </button>
                <button
                    class="flex items-center justify-center gap-2 rounded-[5px] border border-transparent bg-transparent px-[15px] py-[9px] text-[clamp(12px,1vw,13px)] text-[#8d9a8c] max-nar:gap-1.5 max-nar:px-[11px] max-tiny:px-[9px]"
                    :class="
                        game.mode === 'local'
                            ? 'border-[#a0c57d18] bg-[#34402b] text-lime shadow-[0_1px_3px_#0002]'
                            : 'hover:bg-[#ffffff04] hover:text-[#d6e0cd]'
                    "
                    :aria-pressed="game.mode === 'local'"
                    @click="$emit('selectMode', 'local')"
                >
                    <AppIcon class="max-nar:size-3.5" name="users" :size="16" />本地双人
                </button>
            </div>
            <button
                class="inline-flex items-center justify-center gap-[7px] border-0 bg-transparent py-[7px] text-[clamp(11px,0.95vw,12px)] text-[#8d9b88] hover:text-lime max-mob:text-[12px] max-nar:min-h-10 max-nar:gap-[5px]"
                @click="$emit('openSetup')"
            >
                <AppIcon name="restart" :size="16" /><span>新对局</span>
            </button>
        </div>
        <div class="mb-5 grid grid-cols-2 gap-4 max-nar:mb-4 max-nar:gap-[11px]">
            <article
                v-for="(p, index) in game.players"
                :key="index"
                class="relative min-w-0 overflow-hidden rounded-[10px] px-[21px] pb-[17px] pt-[18px] max-mid:px-4 max-tab:p-5 max-nar:rounded-[9px] max-nar:px-[13px] max-nar:py-[15px]"
                :class="
                    game.active === index && game.phase !== 'finished'
                        ? 'border border-[#b3d18c61] bg-[linear-gradient(110deg,#293725,#202c21)] before:absolute before:left-[18%] before:right-[18%] before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,#bce29266,transparent)] before:content-[\'\']'
                        : 'border border-[#e0efcc13] bg-[linear-gradient(115deg,#202a22,#1b241e)]'
                "
                :aria-label="`${p.name}，总分 ${p.score}`"
            >
                <div class="flex items-center gap-[10px] max-nar:gap-2">
                    <div
                        class="grid size-[35px] place-items-center rounded-[9px] max-nar:size-[30px] max-nar:rounded-lg"
                        :class="[
                            index === 1 ? 'bg-[#dab48a10] text-[#d4bf93]' : 'bg-[#c5e99512] text-[#b9d697]',
                            game.active === index && game.phase !== 'finished' ? 'max-nar:shadow-[0_0_0_1px_#c5e99530]' : '',
                        ]"
                    >
                        <AppIcon class="max-nar:size-[18px]" :name="index === 1 && game.mode === 'ai' ? 'bot' : 'user'" :size="21" />
                    </div>
                    <div class="min-w-0">
                        <h2
                            class="flex max-w-[170px] items-center gap-[7px] overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(14px,1.15vw,16px)] font-semibold max-mid:max-w-[110px] max-tab:max-w-[190px] max-nar:max-w-[100px] max-nar:gap-[5px] max-tiny:max-w-[80px]"
                        >
                            {{ p.name }}<span
                                v-if="index === 1 && game.mode === 'ai'"
                                class="rounded-[3px] border border-[#cbb78a3a] px-1 py-0.5 text-[clamp(8px,0.65vw,9px)] font-medium tracking-[0.3px] text-[#cdb68b] max-mob:text-[8px]"
                                >AI</span
                            >
                        </h2>
                        <span class="mt-[5px] block text-[clamp(9px,0.75vw,10px)] tracking-[1.2px] text-[#7e8d77] max-mob:text-[10px] max-nar:tracking-[0.8px]"
                            >{{
                                index === 1 && game.mode === "ai"
                                    ? difficultyLabels[game.difficulty] + "对手"
                                    : "PLAYER 0" + (index + 1)
                            }}</span
                        >
                    </div>
                    <span
                        v-if="game.active === index && game.phase !== 'finished'"
                        class="ml-auto flex items-center gap-[5px] whitespace-nowrap rounded-[4px] border border-[#c1df8a1a] bg-[#c5e99509] px-1.5 py-1 text-[clamp(9px,0.8vw,10px)] text-[#c2dc9f] max-mid:p-1 max-tab:px-[7px] max-tab:py-[5px] max-mob:text-[10px] max-nar:hidden"
                        ><i class="size-1 rounded-full bg-lime"></i>当前回合</span
                    ><span
                        v-else
                        class="ml-auto whitespace-nowrap text-[clamp(9px,0.8vw,10px)] text-[#76816f] max-mob:text-[10px] max-nar:hidden"
                        >{{ game.phase === "finished" ? "对局结束" : "等待中" }}</span
                    >
                </div>
                <div
                    class="mb-[14px] mt-[15px] flex items-baseline gap-[11px] font-numeric text-[37px] font-semibold leading-[1.2] tracking-[-0.8px] tabular-nums max-nar:mb-3 max-nar:mt-4 max-nar:gap-[7px] max-nar:text-[32px] max-tiny:text-[28px]"
                >
                    {{ format(p.score) }}<span class="text-[clamp(11px,0.9vw,12px)] font-normal tracking-[0.3px] text-[#7a8873]"
                        >/ {{ format(targetScore) }}</span
                    >
                </div>
                <div
                    class="h-[3px] overflow-hidden rounded-[3px] bg-[#d6e6be12]"
                    role="progressbar"
                    :aria-label="`${p.name}的目标进度`"
                    :aria-valuenow="Math.min(p.score, targetScore)"
                    :aria-valuemin="0"
                    :aria-valuemax="targetScore"
                >
                    <div
                        class="h-full transition-[width] duration-[800ms] ease-out"
                        :class="index === 1 ? 'bg-[#d7bd85]' : 'bg-lime'"
                        :style="{ width: progress(p.score) }"
                    ></div>
                </div>
            </article>
        </div>
    </div>
</template>
