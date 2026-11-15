// 天国对战 store：与普通模式共用规则，但使用独立存档、骰子权重和结算钩子。
import { createGameSessionStore } from "../../../shared/game/createGameSessionStore.js";
import { useUiStore } from "../../../shared/stores/uiStore.js";
import { switchRequest } from "../../../shared/session/switchRequest.js";
import { KINGDOM_BATTLE_STORAGE_KEY } from "../storage/battleStorage.js";
import { useKingdomStore } from "./kingdomStore.js";
import { useDiceLoadoutStore } from "./useDiceLoadoutStore";
import { useInventoryModifiers } from "../composables/useInventoryModifiers";
import { applyMatchSettlement } from "../services/matchSettlement.js";

export const useKingdomBattleStore = createGameSessionStore({
    id: "kingdom-battle",
    storageKey: KINGDOM_BATTLE_STORAGE_KEY,
    getUiStore: useUiStore,
    switchState: switchRequest,
    // 挑战开始时由大厅传入冻结配置；刷新或直接进入时回退到当前装备。
    getDiceLoadout: () => useDiceLoadoutStore().equippedConfigs,
    createScoreModifiers: useInventoryModifiers,
    // 终局钩子结算奖励并免费轮换商店；胜负弹窗由会话工厂统一打开。
    onMatchEnd: (result) => {
        const kingdom = useKingdomStore();
        const settlement = applyMatchSettlement({ result, kingdom });
        kingdom.refreshShopAfterMatch();
        useUiStore().notify([...settlement.messages, "对局结束，商店已刷新。"].join(" "));
    },
});
