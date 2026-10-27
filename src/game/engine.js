import { ENTRY_SCORE, TARGET_SCORE, hasScore, scoreDice, scoringOptions, farkleProbability } from "./scoring.js";

export function isValidTargetScore(score) {
    return Number.isSafeInteger(score) && score >= 1000 && score <= 100000 && score % 500 === 0;
}

export function createGame(mode = "ai", difficulty = "balanced", targetScore = TARGET_SCORE) {
    if (!isValidTargetScore(targetScore)) throw new RangeError("获胜分数必须为 1,000–100,000 之间的 500 倍数");
    return {
        version: 1,
        mode,
        difficulty,
        targetScore,
        players: [
            { name: mode === "ai" ? "你" : "玩家一", score: 0 },
            { name: mode === "ai" ? "NOVA" : "玩家二", score: 0 },
        ],
        active: 0,
        turn: 1,
        turnScore: 0,
        rollNumber: 0,
        dice: [],
        kept: [],
        phase: "ready",
        finalStarter: null,
        winner: null,
        history: [],
        lastEvent: null,
    };
}

// 各动作先复制状态再返回新对象，避免调用方意外修改旧对局。
function copy(game) {
    return JSON.parse(JSON.stringify(game));
}
function addEvent(game, type, points = 0) {
    const event = {
        id: `${game.turn}-${game.rollNumber}-${game.history.length}`,
        type,
        player: game.active,
        name: game.players[game.active].name,
        points,
        turn: game.turn,
    };
    game.lastEvent = event;
    game.history.unshift(event);
    game.history = game.history.slice(0, 30);
}

export function selectionScore(game, ids) {
    if (!ids.length || new Set(ids).size !== ids.length) return 0;
    const chosen = game.dice.filter((d) => ids.includes(d.id));
    return chosen.length === ids.length ? scoreDice(chosen.map((d) => d.value)) : 0;
}

export function canBank(game, ids = []) {
    if (game.phase !== "selecting") return false;
    const selected = selectionScore(game, ids);
    // At least one scoring die must be set aside after every roll.
    if (!selected) return false;
    const total = game.turnScore + selected;
    return total > 0 && (game.players[game.active].score > 0 || total >= ENTRY_SCORE);
}

// Passing in a RNG keeps the rules deterministic and testable.
export function rollDice(game, ids = [], random = Math.random) {
    if (!["ready", "selecting"].includes(game.phase)) throw new Error("当前不能掷骰");
    const next = copy(game);
    let count = 6;
    let hotDice = false;
    if (game.phase === "selecting") {
        const score = selectionScore(game, ids);
        if (!score) throw new Error("请先选出至少一组可计分骰子");
        const chosen = game.dice.filter((d) => ids.includes(d.id));
        next.kept.push({ roll: game.rollNumber, values: chosen.map((d) => d.value), score });
        next.turnScore += score;
        count = game.dice.length - chosen.length;
        // 全部骰子都被选中时触发 Hot Dice：累计分保留，下一掷恢复六颗。
        if (count === 0) {
            count = 6;
            next.kept = [];
            hotDice = true;
        }
    }
    next.rollNumber++;
    next.dice = Array.from({ length: count }, (_, i) => ({
        id: `${next.rollNumber}-${i}`,
        value: Math.min(6, Math.max(1, Math.floor(random() * 6) + 1)),
    }));
    if (!hasScore(next.dice.map((d) => d.value))) {
        addEvent(next, "farkle", next.turnScore);
        next.turnScore = 0;
        next.phase = "farkle";
    } else {
        next.phase = "selecting";
        next.lastEvent = hotDice ? { type: "hot" } : null;
    }
    return next;
}

function endTurn(game) {
    // 达到目标分后由对手完成唯一的最终回合，随后比较双方总分。
    if (game.finalStarter !== null && game.active !== game.finalStarter) {
        game.phase = "finished";
        const [a, b] = game.players.map((p) => p.score);
        game.winner = a === b ? "tie" : a > b ? 0 : 1;
    } else game.phase = "handoff";
    return game;
}

export function bankPoints(game, ids = []) {
    if (!canBank(game, ids)) throw new Error("首次收分需达到 500 分，且所选骰子必须全部可计分");
    const next = copy(game);
    const points = next.turnScore + selectionScore(next, ids);
    next.players[next.active].score += points;
    addEvent(next, "bank", points);
    if (next.finalStarter === null && next.players[next.active].score >= next.targetScore) {
        next.finalStarter = next.active;
        next.lastEvent.final = true;
    }
    next.turnScore = 0;
    return endTurn(next);
}

export function finishFarkle(game) {
    if (game.phase !== "farkle") throw new Error("尚未出现 Farkle");
    return endTurn(copy(game));
}

export function startNextTurn(game) {
    if (game.phase !== "handoff") throw new Error("当前无需交接回合");
    const next = copy(game);
    next.active = 1 - next.active;
    next.turn++;
    next.turnScore = 0;
    next.dice = [];
    next.kept = [];
    next.phase = "ready";
    next.lastEvent = null;
    return next;
}

// Uses exact next-roll Farkle probability, available scoring subsets and score gap.
export function chooseAiMove(game) {
    if (game.phase === "ready") return { type: "roll", ids: [] };
    if (game.phase !== "selecting") return null;
    const options = scoringOptions(game.dice);
    const player = game.players[game.active];
    const opponent = game.players[1 - game.active];
    const finalTurn = game.finalStarter !== null && game.active !== game.finalStarter;
    const attitude = { cautious: 0.72, balanced: 1, bold: 1.38 }[game.difficulty] || 1;
    const evaluated = options.map((option) => {
        const total = game.turnScore + option.score;
        const remaining = option.remaining || 6;
        const risk = farkleProbability(remaining);
        const canStop = player.score > 0 || total >= ENTRY_SCORE;
        const winsFinal = finalTurn && player.score + total > opponent.score;
        const reachesTarget = !finalTurn && player.score + total >= game.targetScore;
        // Expected next-roll gain, adjusted by personality and match position.
        const gain = [0, 25, 65, 110, 180, 280, 450][remaining];
        const chasing = Math.min(1.3, 1 + Math.max(0, opponent.score - player.score) / 16000);
        const continueValue = (1 - risk) * gain * attitude * chasing - risk * total;
        // 若最终回合仍落后，AI 必须继续追分；否则可按收益或胜局条件收分。
        const mustChase = finalTurn && player.score + total <= opponent.score;
        const stop = canStop && !mustChase && (winsFinal || reachesTarget || continueValue <= 0);
        return {
            ...option,
            type: stop ? "bank" : "roll",
            utility: option.score + (stop ? 0 : continueValue),
            winsFinal,
            reachesTarget,
        };
    });
    evaluated.sort(
        (a, b) =>
            Number(b.winsFinal) - Number(a.winsFinal) ||
            Number(b.reachesTarget) - Number(a.reachesTarget) ||
            b.utility - a.utility,
    );
    return evaluated[0];
}
