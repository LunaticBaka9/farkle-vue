<script setup>
import { onBeforeUnmount, ref } from "vue";
import KingdomHeader from "./KingdomHeader.vue";
import KingdomOpponents from "./KingdomOpponents.vue";
import KingdomShop from "./KingdomShop.vue";

// 天国模式的持久化数据、对手事务和商店事务集中在父组件维护。
const emit = defineEmits(["openBackpack", "openDiceList", "challengeOpponent"]);
const KINGDOM_STORAGE_KEY = "farkle.kingdom.v1";

const opponents = [
    { id: "squire", name: "学徒骑士", title: "初级挑战者", difficulty: "cautious", wager: 50, target: 5000, icon: "shield" },
    { id: "archer", name: "林间射手", title: "精准控局者", difficulty: "balanced", wager: 100, target: 7500, icon: "user" },
    { id: "alchemist", name: "宫廷炼金师", title: "善用风险的棋手", difficulty: "bold", wager: 180, target: 10000, icon: "spark" },
    { id: "knight", name: "黑甲骑士", title: "皇家精英", difficulty: "balanced", wager: 260, target: 10000, icon: "shield" },
    { id: "dragon", name: "龙堡守卫", title: "传说级对手", difficulty: "bold", wager: 400, target: 15000, icon: "flame" },
];

const shopItems = [
    { id: "dice-royal", category: "dice", name: "皇家骰子", detail: "金色纹章，庄重典雅", price: 320, icon: "dice" },
    { id: "dice-knight", category: "dice", name: "骑士骰子", detail: "银灰盔甲，坚毅可靠", price: 480, icon: "shield" },
    { id: "dice-lucky", category: "dice", name: "幸运骰子", detail: "低调闪光，为关键一掷增添运气", price: 650, icon: "spark" },
    { id: "item-cross", category: "item", name: "皇家十字印记", detail: "稀有护符，可用于天国对局", price: 220, icon: "shield" },
    { id: "item-bag", category: "item", name: "古堡金币袋", detail: "古旧皮革，便于携带金币", price: 180, icon: "bank" },
    { id: "item-spark", category: "item", name: "幸运火花", detail: "等待下一次奇遇的神秘道具", price: 360, icon: "flame" },
];

function restoreKingdomState() {
    try {
        const saved = JSON.parse(localStorage.getItem(KINGDOM_STORAGE_KEY));
        const validCoins = Number.isInteger(saved?.coins) && saved.coins >= 0 ? saved.coins : 1250;
        return {
            coins: validCoins,
            ownedIds: Array.isArray(saved?.ownedIds)
                ? saved.ownedIds.filter((id) => shopItems.some((item) => item.id === id))
                : ["item-cross", "item-bag", "dice-royal"],
        };
    } catch {
        return { coins: 1250, ownedIds: ["item-cross", "item-bag", "dice-royal"] };
    }
}

const savedState = restoreKingdomState();
const coins = ref(savedState.coins);
const ownedIds = ref(savedState.ownedIds);
const notice = ref("");
let noticeTimer;

function saveKingdomState() {
    try {
        localStorage.setItem(KINGDOM_STORAGE_KEY, JSON.stringify({ coins: coins.value, ownedIds: ownedIds.value }));
    } catch {
        // localStorage 不可用时仍允许当前页面内的挑战和购买。
    }
}

function showNotice(message) {
    clearTimeout(noticeTimer);
    notice.value = message;
    noticeTimer = setTimeout(() => {
        notice.value = "";
    }, 2600);
}

function challengeOpponent(opponent) {
    if (coins.value < opponent.wager) {
        showNotice("金币不足，请先在商店或完成挑战获取更多金币。");
        return;
    }
    coins.value -= opponent.wager;
    saveKingdomState();
    showNotice(`已支付 ${opponent.wager} 金币，正在挑战 ${opponent.name}。`);
    emit("challengeOpponent", opponent);
}

function purchaseItem(item) {
    if (ownedIds.value.includes(item.id)) {
        showNotice(`${item.name} 已在收藏中。`);
        return;
    }
    if (coins.value < item.price) {
        showNotice("金币不足，无法购买该物品。");
        return;
    }
    coins.value -= item.price;
    ownedIds.value = [...ownedIds.value, item.id];
    saveKingdomState();
    showNotice(`购买成功：${item.name}。`);
}

onBeforeUnmount(() => clearTimeout(noticeTimer));
</script>

<template>
    <section class="relative col-start-2 col-end-4 max-tab:col-start-1 max-tab:col-end-auto" aria-label="天国模式">
        <KingdomHeader
            :coins="coins"
            @open-backpack="emit('openBackpack')"
            @open-dice-list="emit('openDiceList')"
        />

        <div class="mt-[24px] grid grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] gap-[18px] max-tab:mt-[24px] max-mob:grid-cols-1">
            <KingdomOpponents :coins="coins" :opponents="opponents" @challenge="challengeOpponent" />
            <KingdomShop :coins="coins" :owned-ids="ownedIds" :shop-items="shopItems" @purchase="purchaseItem" />
        </div>

        <Transition name="fade">
            <div
                v-if="notice"
                class="fixed bottom-7 left-1/2 z-30 -translate-x-1/2 rounded-lg border border-[#b99b6170] bg-[#211c12f5] px-[18px] py-[12px] text-[12px] text-[#eddfb4] shadow-[0_10px_30px_#0008]"
                role="status"
            >
                {{ notice }}
            </div>
        </Transition>
    </section>
</template>
