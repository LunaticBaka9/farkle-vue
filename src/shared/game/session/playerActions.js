// 玩家信息控制器：只负责修改玩家显示名。
export function createPlayerActions({ game }) {
    function setOpponentName(name) {
        game.value = {
            ...game.value,
            players: game.value.players.map((player, index) => (index === 1 ? { ...player, name } : player)),
        };
    }

    return { setOpponentName };
}
