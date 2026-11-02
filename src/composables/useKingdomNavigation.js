// 天国导航事务：由 App.vue 提供 Pinia store 与模式 ref，响应天国组件的 challenge/leave/reset 事件。
import { ref, shallowRef } from "vue";

export function useKingdomNavigation(farkle, activeMode) {
    const opponent = shallowRef(null);
    const resetToken = ref(0);

    // KingdomMode 发出 challengeOpponent 后调用；参数来自对手目录，store 创建对应 AI 对局。
    function startChallenge(challenger) {
        farkle.setupMode = "ai";
        farkle.setupDifficulty = challenger.difficulty;
        farkle.setupTargetScore = challenger.target;
        farkle.setupNames = ["", ""];
        opponent.value = challenger;
        farkle.newGame();
        farkle.setOpponentName(challenger.name);
        activeMode.value = "kingdom-battle";
    }

    // 新对局窗口提交后调用；在天国挑战上下文中继续留在对战牌桌。
    function startNewGame() {
        farkle.newGame();
        if (opponent.value && farkle.setupMode === "ai") activeMode.value = "kingdom-battle";
    }

    // KingdomBattle 发出 leaveBattle 后调用，清除当前对手并返回天国大厅。
    function leaveBattle() {
        opponent.value = null;
        activeMode.value = "kingdom";
    }

    // 确认弹窗发出 resetKingdomState 后调用，递增令牌通知仍挂载的 KingdomMode 执行重置。
    function confirmPlayerReset() {
        resetToken.value++;
        farkle.closeDialog();
    }

    return { opponent, resetToken, startChallenge, startNewGame, leaveBattle, confirmPlayerReset };
}
