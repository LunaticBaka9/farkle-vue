// 天国对战 store：与普通模式共用规则，但使用独立存档和独立 AI 生命周期。
import { createGameSessionStore } from "../../../shared/game/createGameSessionStore.js";
import { useUiStore } from "../../../shared/stores/uiStore.js";
import { switchRequest } from "../../../shared/session/switchRequest.js";
import { KINGDOM_BATTLE_STORAGE_KEY } from "../storage/battleStorage.js";

export const useKingdomBattleStore = createGameSessionStore({
    id: "kingdom-battle",
    storageKey: KINGDOM_BATTLE_STORAGE_KEY,
    getUiStore: useUiStore,
    switchState: switchRequest,
});
