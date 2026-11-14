// 对局结算服务：根据玩家收藏中的经济道具计算金币奖励，不直接操作 UI。
import { MATCH_END_ITEM_EFFECTS } from "../data/matchEndEffects.js";

/** 收集本局胜利后触发的道具奖励；失败或平局不会触发金币类效果。 */
export function resolveMatchSettlement({ result, ownedIds }) {
    const settlement = { coins: 0, messages: [] };
    if (!result?.playerWon) return settlement;
    for (const itemId of ownedIds) {
        const effect = MATCH_END_ITEM_EFFECTS[itemId];
        if (!effect) continue;
        if (effect.coinsOnWin > 0) {
            settlement.coins += effect.coinsOnWin;
            settlement.messages.push(effect.message);
        }
    }
    return settlement;
}

/** 将结算结果写入天国 store；返回值供对战页显示 Toast。 */
export function applyMatchSettlement({ result, kingdom }) {
    const settlement = resolveMatchSettlement({ result, ownedIds: kingdom.ownedIds });
    if (settlement.coins > 0) kingdom.grantCoins(settlement.coins);
    return settlement;
}
