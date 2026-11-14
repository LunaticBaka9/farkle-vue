// 对局会话工厂：组合派生状态、动画、回合动作、设置和 AI 生命周期。
import { computed, onScopeDispose, ref, shallowRef, watch } from "vue";
import { defineStore } from "pinia";
import { createGame } from "./engine.js";
import { loadSessionGame, persistSessionGame } from "./session/persistenceAdapter.js";
import { createAiAutomation } from "./aiAutomation.js";
import { createSessionDerivedState } from "./session/derivedState.js";
import { createRollController } from "./session/rollController.js";
import { createTurnController } from "./session/turnController.js";
import { createSelectionController } from "./session/selectionController.js";
import { createNewGameAction } from "./session/newGame.js";
import { createSetupController } from "./session/setupController.js";
import { createPlayerActions } from "./session/playerActions.js";
import { ENTRY_SCORE } from "./scoring.js";
import { format } from "../utils/format.js";

export function createGameSessionStore({ id, storageKey, legacyKey = null, getUiStore, switchState }) {
    return defineStore(id, () => {
        const ui = getUiStore();
        // 读取本模块存档；普通模式会通过适配器迁移旧版本唯一存档。
        const { restored, restoredNotice: initialRestoredNotice } = loadSessionGame({ storageKey, legacyKey });
        let restoredNotice = initialRestoredNotice;
        const game = shallowRef(restored || createGame());
        const selected = ref([]);
        const rolling = ref(false);
        const rollingFaces = ref([]);
        const aiChoice = ref("");
        const active = ref(false);

        const derived = createSessionDerivedState({ game, selected, rolling, aiChoice });
        const roll = createRollController({
            game,
            selected,
            rolling,
            rollingFaces,
            aiChoice,
            isAi: derived.isAi,
            play: ui.play,
            notify: ui.notify,
        });
        const turn = createTurnController({
            game,
            selected,
            aiChoice,
            rolling,
            isAi: derived.isAi,
            play: ui.play,
            notify: ui.notify,
        });
        const selection = createSelectionController({
            game,
            selected,
            rolling,
            isAi: derived.isAi,
            play: ui.play,
        });
        const createNewGame = createNewGameAction({
            game,
            selected,
            ui,
            resetAnimation: roll.resetAnimation,
        });
        // 新局创建成功后不再提示“已恢复上次对局”，挑战流程会先创建再进入路由。
        function newGame(overrides = {}) {
            const created = createNewGame(overrides);
            if (created) restoredNotice = false;
            return created;
        }
        const setup = createSetupController({ game, ui });
        const players = createPlayerActions({ game });

        const automation = createAiAutomation({
            game,
            rolling,
            modal: computed(() => ui.modal || (switchState?.open ? "switch-mode" : null)),
            isAi: derived.isAi,
            showHandoff: derived.showHandoff,
            selected,
            aiChoice,
            doRoll: roll.doRoll,
            doBank: turn.doBank,
            nextTurn: turn.nextTurn,
        });

        // 启动会话：只有 active 为 true 时才允许 AI 与 watcher 继续调度。
        function startSession() {
            if (active.value) return;
            active.value = true;
            if (restoredNotice) {
                ui.notify("已恢复上次的对局", "info");
                restoredNotice = false;
            }
            if (game.value.phase === "finished") ui.modal = "winner";
            automation.run();
        }

        function stopSession() {
            active.value = false;
            automation.cancel();
            roll.clearTimers();
            rolling.value = false;
            rollingFaces.value = [];
            selected.value = [];
            ui.stopAudio();
        }

        function pauseSession() {
            active.value = false;
            automation.cancel();
            roll.clearTimers();
            rolling.value = false;
            rollingFaces.value = [];
            ui.stopAudio();
        }

        function resumeSession() {
            if (active.value) return;
            active.value = true;
            automation.run();
        }

        // 状态变化只调度当前活动会话；离开路由后 watcher 不会继续推进 AI。
        watch([game, rolling, () => ui.modal, () => switchState?.open], () => {
            if (active.value) automation.run();
        });
        watch(game, (value) => {
            persistSessionGame(value, storageKey);
            if (active.value && value.phase === "finished") ui.modal = "winner";
        });

        onScopeDispose(() => {
            automation.cancel();
            roll.clearTimers();
        });

        return {
            ENTRY_SCORE,
            format,
            game,
            selected,
            rolling,
            rollingFaces,
            aiChoice,
            ...derived,
            ...selection,
            ...turn,
            doRoll: roll.doRoll,
            ...setup,
            ...players,
            newGame,
            startSession,
            stopSession,
            pauseSession,
            resumeSession,
        };
    });
}

