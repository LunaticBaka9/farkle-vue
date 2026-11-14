// 当前路由对应的对局会话：只在需要时实例化普通或天国对战 store。
import { computed } from "vue";
import { useNormalGameStore } from "../../modules/normal/stores/normalGameStore.js";
import { useKingdomBattleStore } from "../../modules/kingdom/stores/kingdomBattleStore.js";
import { ENTRY_SCORE, TARGET_SCORE } from "../../shared/game/scoring.js";

export function useActiveGameSession(route) {
    const activeSession = computed(() => {
        if (route.meta.session === "normal-game") return useNormalGameStore();
        if (route.meta.session === "kingdom-battle") return useKingdomBattleStore();
        return null;
    });
    const game = computed(() => activeSession.value?.game ?? { entryScore: ENTRY_SCORE, players: [] });
    const winnerLabel = computed(() => activeSession.value?.winnerLabel ?? "");
    const footerTargetScore = computed(() => activeSession.value?.game?.targetScore ?? TARGET_SCORE);

    return { activeSession, game, winnerLabel, footerTargetScore };
}
