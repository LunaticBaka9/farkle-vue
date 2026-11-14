<script setup>
import { onBeforeUnmount, ref, watch } from "vue";
import KingdomHeader from "./KingdomHeader.vue";
import KingdomOpponents from "./KingdomOpponents.vue";
import KingdomShop from "./KingdomShop.vue";
// 商品和挑战参数的唯一来源是 game/kingdom/items.js；存档适配层负责本地读写与校验。
import { DEFAULT_KINGDOM_STATE, KINGDOM_OPPONENTS, KINGDOM_SHOP_ITEMS } from "../../game/kingdom/items.js";
import { restoreKingdomState, saveKingdomState as persistKingdomState } from "../../game/kingdom/kingdomStorage.js";

// 天国模式的持久化数据、对手事务和商店事务集中在父组件维护。
const props = defineProps({ resetToken: { type: Number, default: 0 } });
const emit = defineEmits(["openBackpack", "openDiceList", "challengeOpponent", "resetPlayerState"]);
// 天国模式初始化从存档模块恢复状态，静态目录从 game/kingdom/items.js 注入子视图。
const opponents = KINGDOM_OPPONENTS;
const shopItems = KINGDOM_SHOP_ITEMS;
const savedState = restoreKingdomState();
const coins = ref(savedState.coins);
const ownedIds = ref(savedState.ownedIds);
const notice = ref("");
let noticeTimer;

function saveKingdomState() {
    // 购买、挑战与重置都从这里写回，组件继续以响应式 refs 作为当前页状态源。
    persistKingdomState({ coins: coins.value, ownedIds: ownedIds.value });
}

function resetKingdomState() {
    coins.value = DEFAULT_KINGDOM_STATE.coins;
    ownedIds.value = [...DEFAULT_KINGDOM_STATE.ownedIds];
    saveKingdomState();
    showNotice("天国玩家状态已恢复初始设置。");
}

watch(
    () => props.resetToken,
    (token, previousToken) => {
        if (token !== previousToken) resetKingdomState();
    },
);

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
    // 挑战卡发出 challenge 后由根页面接管模式切换和对战对象。
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
    <section class="kingdom-mode" aria-label="天国模式">
        <KingdomHeader
            :coins="coins"
            @open-backpack="emit('openBackpack')"
            @open-dice-list="emit('openDiceList')"
            @reset-player-state="emit('resetPlayerState')"
        />

        <div class="kingdom-grid">
            <KingdomOpponents :coins="coins" :opponents="opponents" @challenge="challengeOpponent" />
            <KingdomShop :coins="coins" :owned-ids="ownedIds" :shop-items="shopItems" @purchase="purchaseItem" />
        </div>

        <Transition name="fade">
            <div v-if="notice" class="kingdom-notice" role="status">
                {{ notice }}
            </div>
        </Transition>
    </section>
</template>

<style scoped>
/* 天国模式容器：占据普通模式主内容的两列宽度。 */
.kingdom-mode {
    position: relative;
    grid-column: 2 / 4;
}

/* 平板天国容器：单列布局时占满整行。 */
@media (max-width: 1000px) {
    .kingdom-mode {
        grid-column: 1 / -1;
    }
}

/* 对手与商店的双栏布局，对手区略宽，卡片按内容高度对齐。 */
.kingdom-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
    align-items: start;
    gap: 18px;
    margin-top: 24px;
}

/* 平板及以下天国双栏：改为单列上下排列，避免商店卡过窄。 */
@media (max-width: 1000px) {
    .kingdom-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 天国操作提示：固定在视口底部的短暂 toast。 */
.kingdom-notice {
    position: fixed;
    bottom: calc(28px + env(safe-area-inset-bottom, 0px));
    left: 50%;
    z-index: 30;
    padding: 12px 18px;
    border: 1px solid #b99b6170;
    border-radius: 8px;
    background: #211c12f5;
    color: #eddfb4;
    font-size: 12px;
    box-shadow: 0 10px 30px #0008;
    transform: translateX(-50%);
    /* 提示条不拦截点击，避免遮挡牌桌或按钮。 */
    pointer-events: none;
}
</style>
