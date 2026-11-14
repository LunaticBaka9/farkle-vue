// 天国对战 store：与普通模式共用规则，但使用独立存档、骰子权重和结算钩子。
import { createGameSessionStore } from "../../../shared/game/createGameSessionStore.js";
import { useUiStore } from "../../../shared/stores/uiStore.js";
import { switchRequest } from "../../../shared/session/switchRequest.js";
import { KINGDOM_BATTLE_STORAGE_KEY } from "../storage/battleStorage.js";
import { useKingdomStore } from "./kingdomStore.js";
import { useDiceLoadoutStore } from "./useDiceLoadoutStore";
import { applyMatchSettlement } from "../services/matchSettlement.js";

export const useKingdomBattleStore = createGameSessionStore({
    id: "kingdom-battle",
    storageKey: KINGDOM_BATTLE_STORAGE_KEY,
    getUiStore: useUiStore,
    switchState: switchRequest,
    // 挑战开始时由大厅传入冻结配置；刷新或直接进入时回退到当前装备。
    getDiceLoadout: () => useDiceLoadoutStore().equippedConfigs,
    // 终局钩子只负责经济结算，胜负弹窗仍由会话工厂统一打开。
    onMatchEnd: (result) => {
        const settlement = applyMatchSettlement({ result, kingdom: useKingdomStore() });
        if (settlement.messages.length) useUiStore().notify(settlement.messages.join(" "));
    },
});
