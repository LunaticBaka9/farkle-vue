<script setup>
import AppIcon from "../framework/AppIcon.vue";

defineProps({
    coins: { type: Number, required: true },
    opponents: { type: Array, required: true },
});

const emit = defineEmits(["challenge"]);
</script>

<template>
    <section
        class="overflow-hidden rounded-[18px] border border-[#b99b6140] bg-[linear-gradient(145deg,#201d1355,#0d100b88)] shadow-[inset_0_1px_0_#dfcf9a12,0_12px_30px_#0003]"
        aria-labelledby="kingdom-opponents-title"
    >
        <div class="flex items-center justify-between border-b border-[#b99b6120] px-[33px] py-[27px] max-nar:px-[14px]">
            <div>
                <span class="text-[11px] font-bold tracking-[3px] text-[#9d9273]">THE ROYAL CHALLENGERS</span>
                <h2 id="kingdom-opponents-title" class="mt-2 text-[30px] font-semibold text-[#eee5cc] max-nar:text-[18px]">选择对手</h2>
            </div>
            <span class="rounded-full border border-[#b99b6138] px-[14px] py-[8px] text-[14px] text-[#b7a879]">5 位</span>
        </div>
        <div class="grid gap-[12px] p-[18px]">
            <article
                v-for="(opponent, index) in opponents"
                :key="opponent.id"
                class="grid grid-cols-[63px_minmax(0,1fr)_auto] items-center gap-[18px] rounded-[12px] border border-[#b99b6124] bg-[#15140e66] px-[18px] py-[15px] transition-[border-color,background,transform] duration-200 hover:border-[#b99b6170] hover:bg-[#2b271577] max-nar:grid-cols-[38px_minmax(0,1fr)]"
            >
                <span class="grid size-[63px] place-items-center rounded-full border border-[#b99b6150] bg-[radial-gradient(circle,#3b351e,#17160f)] text-[#d8c58b] max-nar:size-[38px]">
                    <AppIcon :name="opponent.icon" :size="30" />
                </span>
                <div class="min-w-0">
                    <div class="flex items-center gap-[7px]">
                        <strong class="truncate text-[21px] text-[#e7dec4]">{{ opponent.name }}</strong>
                        <small class="text-[12px] text-[#918765]">0{{ index + 1 }}</small>
                    </div>
                    <p class="mt-[5px] text-[16px] text-[#989175]">{{ opponent.title }} · {{ opponent.target.toLocaleString("zh-CN") }} 分</p>
                </div>
                <button
                    type="button"
                    class="min-w-[168px] border border-[#c6b4775c] bg-[linear-gradient(145deg,#5a502f,#302916)] px-[18px] py-[14px] text-[16px] text-[#f0e5bf] shadow-[inset_0_1px_0_#fff7c426,0_4px_10px_#0005] transition-[transform,border-color,background] duration-200 hover:-translate-y-px hover:border-[#decf92] hover:bg-[linear-gradient(145deg,#756843,#403620)] active:translate-y-px disabled:cursor-not-allowed disabled:border-[#77705240] disabled:bg-[#302d2366] disabled:text-[#777561] max-nar:col-span-2 max-nar:mt-1 max-nar:w-full"
                    :disabled="coins < opponent.wager"
                    @click="emit('challenge', opponent)"
                >
                    挑战 · {{ opponent.wager }} 金币
                </button>
            </article>
        </div>
    </section>
</template>
