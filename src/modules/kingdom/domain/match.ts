// 对局结算类型：对战 store 与天国经济道具之间只通过这个接口通信。
export interface MatchEndGame {
    winner: 0 | 1 | "tie" | null;
    players: Array<{ name: string; score: number }>;
    targetScore: number;
}

export interface MatchEndResult {
    game: MatchEndGame;
    winner: 0 | 1 | "tie" | null;
    playerWon: boolean;
}

export interface MatchSettlement {
    coins: number;
    messages: string[];
}

export type OnMatchEnd = (result: MatchEndResult) => MatchSettlement | void;
