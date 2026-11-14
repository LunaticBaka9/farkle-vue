// 普通模式对局 store：拥有独立存档，不会与天国对战互相覆盖。
import { createGameSessionStore } from "../../../shared/game/createGameSessionStore.js";
import { useUiStore } from "../../../shared/stores/uiStore.js";
import { switchRequest } from "../../../shared/session/switchRequest.js";

export const useNormalGameStore = createGameSessionStore({
    id: "normal-game",
    storageKey: "farkle.normal.game.v1",
    // 兼容迁移前唯一的对局存档。
    legacyKey: "farkle.table.v1",
    getUiStore: useUiStore,
    switchState: switchRequest,
});
