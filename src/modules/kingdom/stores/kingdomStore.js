// 天国大厅状态：金币、收藏和当前挑战；由大厅视图与对战路由共同读取。
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
    DEFAULT_KINGDOM_STATE,
    KINGDOM_DICE_MAX_COPIES,
    KINGDOM_OPPONENTS,
    KINGDOM_SHOP_ITEMS,
} from "../data/items.js";
import {
    chooseShopItems,
    KINGDOM_SHOP_ITEM_COUNT,
    KINGDOM_SHOP_REFRESH_COST,
} from "../domain/shopRotation.js";
import { restoreKingdomState, saveKingdomState } from "../storage/kingdomStorage.js";
import { restoreKingdomShopIds, saveKingdomShopIds } from "../storage/kingdomShopStorage.js";
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
    const shopItemById = new Map(KINGDOM_SHOP_ITEMS.map((item) => [item.id, item]));
    const savedShopIds = restoreKingdomShopIds();
    const restoredShopItems = savedShopIds?.map((id) => shopItemById.get(id) ?? null);
    const hasValidShopItems =
        restoredShopItems?.length === KINGDOM_SHOP_ITEM_COUNT && restoredShopItems.every((item) => item !== null);
    const shopItems = ref(hasValidShopItems ? restoredShopItems : chooseShopItems(KINGDOM_SHOP_ITEMS));
    const maxDiceCopies = KINGDOM_DICE_MAX_COPIES;
    const shopRefreshCost = KINGDOM_SHOP_REFRESH_COST;
    const ownedCounts = computed(() => {
        const counts = {};
        for (const id of ownedIds.value) counts[id] = (counts[id] ?? 0) + 1;
        return counts;
    });
    const opponentCount = computed(() => KINGDOM_OPPONENTS.length);

    function persistProgress() {
        saveKingdomState({ coins: coins.value, ownedIds: ownedIds.value });
    }

    // 付费刷新或对局结算调用；商品来源为完整天国商店目录。
    function rotateShop() {
        shopItems.value = chooseShopItems(KINGDOM_SHOP_ITEMS);
        saveKingdomShopIds(shopItems.value.map((item) => item.id));
    }

    // 商店刷新按钮调用；金币不足时不扣款且保留当前商品。
    function refreshShop() {
        if (coins.value < shopRefreshCost) {
            return { ok: false, message: `金币不足，刷新商店需要 ${shopRefreshCost} 金币。` };
        }
        coins.value -= shopRefreshCost;
        persistProgress();
        rotateShop();
        return { ok: true, message: `商店已刷新，消耗 ${shopRefreshCost} 金币。` };
    }

    // 对局结束结算调用；免费刷新并保存新一轮商品。
    function refreshShopAfterMatch() {
        rotateShop();
    }

    // 骰子可按颗重复购买，最多 6 颗；普通道具仍然只能持有一件。
    function purchase(item) {
        const currentCount = ownedCounts.value[item.id] ?? 0;
        const maxCount = item.category === "dice" ? maxDiceCopies : 1;
        if (currentCount >= maxCount) {
            return {
                ok: false,
                message:
                    item.category === "dice"
                        ? `${item.name} 已持有 ${maxCount} 颗，无法继续购买。`
                        : `${item.name} 已在收藏中。`,
            };
        }
        if (coins.value < item.price) return { ok: false, message: "金币不足，无法购买该物品。" };
        coins.value -= item.price;
        ownedIds.value = [...ownedIds.value, item.id];
        persistProgress();
        return {
            ok: true,
            message:
                item.category === "dice"
                    ? `购买成功：${item.name} ×1（已持有 ${currentCount + 1}/${maxCount} 颗）。`
                    : `购买成功：${item.name}。`,
        };
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

    // 对局结算钩子通过此方法发放金币，保持金币与存档同步。
    function grantCoins(amount) {
        const reward = Math.max(0, Math.round(Number(amount) || 0));
        if (!reward) return 0;
        coins.value += reward;
        persistProgress();
        return reward;
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

    if (!hasValidShopItems) saveKingdomShopIds(shopItems.value.map((item) => item.id));

    return {
        coins,
        ownedIds,
        ownedCounts,
        maxDiceCopies,
        activeBattle,
        opponents,
        shopItems,
        shopRefreshCost,
        opponentCount,
        purchase,
        refreshShop,
        refreshShopAfterMatch,
        grantCoins,
        startChallenge,
        endBattle,
        resetProgress,
        findOpponent,
    };
});
