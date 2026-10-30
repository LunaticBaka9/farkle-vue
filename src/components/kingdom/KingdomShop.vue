<script setup>
import AppIcon from "../framework/AppIcon.vue";

const props = defineProps({
    coins: { type: Number, required: true },
    ownedIds: { type: Array, required: true },
    shopItems: { type: Array, required: true },
});

const emit = defineEmits(["purchase"]);
</script>

<template>
    <section
        class="overflow-hidden rounded-[18px] border border-[#b99b6140] bg-[linear-gradient(145deg,#201d1355,#0d100b88)] shadow-[inset_0_1px_0_#dfcf9a12,0_12px_30px_#0003]"
        aria-labelledby="kingdom-shop-title"
    >
        <div class="flex items-center justify-between border-b border-[#b99b6120] px-[33px] py-[27px] max-nar:px-[14px]">
            <div>
                <span class="text-[11px] font-bold tracking-[3px] text-[#9d9273]">KINGDOM MARKET</span>
                <h2 id="kingdom-shop-title" class="mt-2 text-[30px] font-semibold text-[#eee5cc] max-nar:text-[18px]">古堡商店</h2>
            </div>
            <span class="rounded-full border border-[#b99b6138] px-[14px] py-[8px] text-[14px] text-[#b7a879]">
                {{ ownedIds.length }}/{{ shopItems.length }} 已拥有
            </span>
        </div>
        <div class="grid grid-cols-2 gap-[12px] p-[18px] max-nar:grid-cols-1">
            <article
                v-for="item in shopItems"
                :key="item.id"
                class="rounded-[12px] border border-[#b99b6124] bg-[#15140e66] p-[18px] transition-[border-color,background,transform] duration-200 hover:-translate-y-px hover:border-[#b99b6170] hover:bg-[#2b271577]"
            >
                <div class="flex items-start gap-[14px]">
                    <span class="grid size-[57px] shrink-0 place-items-center rounded-md border border-[#b99b6150] bg-[radial-gradient(circle,#3b351e,#17160f)] text-[#d8c58b]">
                        <AppIcon :name="item.icon" :size="29" />
                    </span>
                    <div class="min-w-0">
                        <strong class="block truncate text-[20px] text-[#e7dec4]">{{ item.name }}</strong>
                        <small class="mt-[5px] block text-[15px] leading-[1.5] text-[#989175]">{{ item.detail }}</small>
                    </div>
                </div>
                <button
                    type="button"
                    class="mt-[15px] w-full border border-[#c6b4775c] px-[15px] py-[12px] text-[15px] transition-[border-color,background] duration-200"
                    :class="ownedIds.includes(item.id)
                        ? 'cursor-default border-[#91a5684a] bg-[#73804a22] text-[#b7c795]'
                        : coins >= item.price
                          ? 'bg-[linear-gradient(145deg,#5a502f,#302916)] text-[#f0e5bf] hover:border-[#decf92]'
                          : 'bg-[#302d2366] text-[#777561]'"
                    :disabled="ownedIds.includes(item.id) || coins < item.price"
                    @click="emit('purchase', item)"
                >
                    {{ ownedIds.includes(item.id) ? "已拥有" : `购买 · ${item.price} 金币` }}
                </button>
            </article>
        </div>
    </section>
</template>
