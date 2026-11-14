// 天国大厅状态：金币、收藏和当前挑战；由大厅视图与对战路由共同读取。
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_KINGDOM_STATE, KINGDOM_OPPONENTS, KINGDOM_SHOP_ITEMS } from "../data/items.js";
import { restoreKingdomState, saveKingdomState } from "../storage/kingdomStorage.js";
import {
    clearActiveBattle,
    clearKingdomBattleSnapshot,
    restoreActiveBattle,
    saveActiveBattle,
} from "../storage/battleStorage.js";

export const useKingdomStore = defineStore("kingdom", () => {
    const saved = restoreKingdomState();
    const coins = ref(saved.coins);
    const ownedIds = ref(saved.ownedIds);
    const activeBattle = ref(restoreActiveBattle());
    const opponents = KINGDOM_OPPONENTS;
    const shopItems = KINGDOM_SHOP_ITEMS;
    const opponentCount = computed(() => KINGDOM_OPPONENTS.length);

    function persistProgress() {
        saveKingdomState({ coins: coins.value, ownedIds: ownedIds.value });
    }

    // 购买商品：库存判断和金币扣减都在 store 内完成，视图只负责显示结果。
    function purchase(item) {
        if (ownedIds.value.includes(item.id)) return { ok: false, message: `${item.name} 已在收藏中。` };
        if (coins.value < item.price) return { ok: false, message: "金币不足，无法购买该物品。" };
        coins.value -= item.price;
        ownedIds.value = [...ownedIds.value, item.id];
        persistProgress();
        return { ok: true, message: `购买成功：${item.name}。` };
    }

    // 挑战入口：先扣挑战金并记录对手，导航由大厅视图负责。
    function startChallenge(opponent) {
        if (coins.value < opponent.wager) {
            return { ok: false, message: "金币不足，请先在商店或完成挑战获取更多金币。" };
        }
        coins.value -= opponent.wager;
        persistProgress();
        activeBattle.value = { opponentId: opponent.id };
        saveActiveBattle(activeBattle.value);
        return { ok: true, message: `已支付 ${opponent.wager} 金币，正在挑战 ${opponent.name}。` };
    }

    // 离开或完成挑战：清除元数据和对战快照，挑战金不退回。
    function endBattle() {
        activeBattle.value = null;
        clearActiveBattle();
        clearKingdomBattleSnapshot();
    }

    function resetProgress() {
        coins.value = DEFAULT_KINGDOM_STATE.coins;
        ownedIds.value = [...DEFAULT_KINGDOM_STATE.ownedIds];
        persistProgress();
        endBattle();
    }

    function findOpponent(opponentId) {
        return opponents.find((item) => item.id === opponentId) ?? null;
    }

    return {
        coins,
        ownedIds,
        activeBattle,
        opponents,
        shopItems,
        opponentCount,
        purchase,
        startChallenge,
        endBattle,
        resetProgress,
        findOpponent,
    };
});
