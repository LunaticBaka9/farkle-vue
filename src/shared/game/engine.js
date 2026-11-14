// 纯对局引擎：由 shared/game/createGameSessionStore.js 的玩家动作和 shared/game/aiAutomation.js 的 AI 流程调用。
// 公开动作接收旧 game 并返回新 game；本层不读取 Vue 状态或浏览器存储。
import { ENTRY_SCORE, TARGET_SCORE, hasScore, scoreDice, scoringOptions, farkleProbability } from "./scoring.js";
import { rollWeightedFace } from "./diceWeights.js";

/** 校验获胜分数是否安全且符合 500 分间隔。 */
export function isValidTargetScore(score) {
    return Number.isSafeInteger(score) && score >= 1000 && score <= 100000 && score % 500 === 0;
}

/** 校验首次收分门槛；0 表示关闭门槛，允许完成首次有效收分。 */
export function isValidEntryScore(score) {
    return Number.isSafeInteger(score) && score >= 0 && score <= 10000 && score % 50 === 0;
}

/**
 * 创建初始对局：设置玩家、回合、骰子、阶段、获胜目标和首次收分门槛。
 */
export function createGame(mode = "ai", difficulty = "balanced", targetScore = TARGET_SCORE, entryScore = ENTRY_SCORE) {
    if (!isValidTargetScore(targetScore)) throw new RangeError("获胜分数必须为 1,000–100,000 之间的 500 倍数");
    if (!isValidEntryScore(entryScore)) throw new RangeError("首次收分门槛必须为 0–10,000 之间的 50 倍数");
    return {
        // version 标记存档结构版本；mode 与 difficulty 分别决定对战方式和 AI 风格。
        version: 1,
        mode,
        difficulty,
        // targetScore 控制获胜目标；entryScore 约束玩家首次收分的最低累计得分。
        targetScore,
        entryScore,
        // players 保存双方名称和总分；active 指向当前行动玩家的数组下标。
        players: [
            { name: mode === "ai" ? "你" : "玩家一", score: 0 },
            { name: mode === "ai" ? "NOVA" : "玩家二", score: 0 },
        ],
        // active/turn 描述当前行动者和轮次；turnScore 是尚未收入总分的回合累计分。
        active: 0,
        turn: 1,
        turnScore: 0,
        // rollNumber 为掷骰序号；dice 保存本次骰面，kept 保存已保留组合记录。
        rollNumber: 0,
        dice: [],
        kept: [],
        // phase 描述对局阶段；finalStarter/winner 分别记录最终回合发起者和比赛结果。
        phase: "ready",
        finalStarter: null,
        winner: null,
        history: [],
        lastEvent: null,
    };
}

// 各动作先复制状态再返回新对象，避免调用方意外修改旧对局。
/**
 * JSON 深拷贝当前状态。引擎中的所有公开变更都先复制再修改。
 */
function copy(game) {
    return JSON.parse(JSON.stringify(game));
}
/**
 * 添加收分或 Farkle 事件，并维持最多 30 条对局动态记录。
 */
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

/**
 * 计算用户当前选择的骰子 ID 对应的计分；重复 ID 或非法 ID 返回 0。
 */
export function selectionScore(game, ids) {
    if (!ids.length || new Set(ids).size !== ids.length) return 0;
    const chosen = game.dice.filter((d) => ids.includes(d.id));
    return chosen.length === ids.length ? scoreDice(chosen.map((d) => d.value)) : 0;
}

/**
 * 判断收分动作是否合法，包括首次收分门槛和必须选择计分骰子的规则。
 */
export function canBank(game, ids = []) {
    if (game.phase !== "selecting") return false;
    const selected = selectionScore(game, ids);
    // At least one scoring die must be set aside after every roll.
    if (!selected) return false;
    const total = game.turnScore + selected;
    const entryScore = game.entryScore ?? ENTRY_SCORE;
    return total > 0 && (game.players[game.active].score > 0 || entryScore === 0 || total >= entryScore);
}

// 兼容两种传入格式：纯权重数组，或桥接层映射出的 { dieId, weights } 配置。
function resolveDiceConfig(diceConfig, slot) {
    const entry = Array.isArray(diceConfig) ? diceConfig[slot] : null;
    if (Array.isArray(entry)) return { weights: entry, dieId: null };
    if (entry && typeof entry === "object") {
        return { weights: entry.weights ?? null, dieId: entry.dieId ?? null };
    }
    return { weights: null, dieId: null };
}

// Passing in a RNG keeps the rules deterministic and testable.
/**
 * 执行掷骰或继续掷骰。
 * random 参数允许测试注入固定随机序列；diceConfig 支持“权重数组”或完整的 6 颗骰子配置。
 */
export function rollDice(game, ids = [], random = Math.random, diceConfig = null) {
    if (!["ready", "selecting"].includes(game.phase)) throw new Error("当前不能掷骰");
    const next = copy(game);
    let count = 6;
    let hotDice = false;
    // slot 记录该骰子来自装备栏的哪个槽位，继续掷骰时沿用原槽位权重。
    let slots = [0, 1, 2, 3, 4, 5];
    if (game.phase === "selecting") {
        const score = selectionScore(game, ids);
        if (!score) throw new Error("请先选出至少一组可计分骰子");
        const chosen = game.dice.filter((d) => ids.includes(d.id));
        next.kept.push({ roll: game.rollNumber, values: chosen.map((d) => d.value), score });
        next.turnScore += score;
        const remaining = game.dice.filter((die) => !ids.includes(die.id));
        count = remaining.length;
        slots = remaining.map((die, index) => (Number.isInteger(die.slot) ? die.slot : index));
        // 全部骰子都被选中时触发 Hot Dice：累计分保留，下一掷恢复六颗。
        if (count === 0) {
            count = 6;
            slots = [0, 1, 2, 3, 4, 5];
            next.kept = [];
            hotDice = true;
        }
    }
    next.rollNumber++;
    next.dice = Array.from({ length: count }, (_, i) => {
        const slot = slots[i] ?? i;
        const config = resolveDiceConfig(diceConfig, slot);
        return {
            id: `${next.rollNumber}-${i}`,
            value: rollWeightedFace(config.weights, random),
            slot,
            // dieId 供护符/套装等扩展读取；普通模式为 null。
            dieId: config.dieId,
        };
    });
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

/**
 * 将选中得分与当前回合累计得分收入玩家总分，并处理交接或最终回合。
 */
export function bankPoints(game, ids = []) {
    if (!canBank(game, ids)) throw new Error("未达到首次收分门槛，或所选骰子含有不可计分骰子");
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

/** 处理 Farkle 后的回合结束，并进入交接或最终结果阶段。 */
export function finishFarkle(game) {
    if (game.phase !== "farkle") throw new Error("尚未出现 Farkle");
    return endTurn(copy(game));
}

/** 重置回合临时状态，并把控制权交给下一位玩家。 */
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

// AI 决策只向前看一掷：穷举合法选骰，用期望值决定收分或继续，再用胜负目标覆盖纯分数。
/**
 * 选择 AI 的下一次行动。
 * 调用方：game/aiAutomation.js；输入为当前对局快照 game，不读写 Vue 状态。
 *
 * 问题：在 selecting 阶段同时决定两件事——选哪几颗骰子，以及选完后收分还是继续掷。
 * 算法：穷举合法动作 + 一层期望值启发式 + 词典序目标覆盖。
 *       这是深度为 1 的 expectimax / 贪心期望值搜索，不是随机，也不展开整棵对局树。
 * 实现：
 *   1. scoringOptions() 给出当前骰面的全部合法计分子集，构成动作空间（最多 63 个）。
 *   2. 对每个子集用 (1-p)·启发式收益 - p·回合累计分 估算「再掷一次」的期望。
 *   3. 用首次收分门槛、最终回合、目标分做硬约束，覆盖纯期望值结论。
 *   4. 按「能赢最终回合 > 能触发目标分 > 综合效用」词典序排序，取第一项。
 * 原理：骰子子集很小，完整博弈树却随后续掷骰指数膨胀，所以只评估下一掷。
 *       爆骰概率 p 由 farkleProbability 精确给出；下一掷得分用固定表估计，避免再枚举。
 */
export function chooseAiMove(game) {
    // 回合刚开始没有骰面可选，唯一合法动作是掷出全部六颗。
    if (game.phase === "ready") return { type: "roll", ids: [] };

    // 只在 selecting 阶段决策；Farkle / 交接 / 终局由自动化流程推进，不走本函数。
    if (game.phase !== "selecting") return null;

    // 动作空间：当前骰面的全部合法计分子集，已按分数排过序，这里会重新按效用排序。
    const options = scoringOptions(game.dice);
    const player = game.players[game.active];
    const opponent = game.players[1 - game.active];

    // 对手已经触及目标分后，当前玩家正在打唯一的追分回合。
    const finalTurn = game.finalStarter !== null && game.active !== game.finalStarter;

    // 难度只缩放「继续掷」的正收益，不改爆骰概率本身。
    // cautious 压低收益更爱收分；bold 放大收益更爱冒险。
    const attitude = { cautious: 0.72, balanced: 1, bold: 1.38 }[game.difficulty] || 1;

    const evaluated = options.map((option) => {
        // 若现在收分，本回合会落入总分的金额 = 已累计 + 当前子集分数。
        const total = game.turnScore + option.score;

        // 留下 0 颗表示 Hot Dice，规则会重新掷六颗，因此按 6 颗估风险和收益。
        const remaining = option.remaining || 6;

        // p = 再掷 remaining 颗后完全没有计分组合的精确概率。
        const risk = farkleProbability(remaining);

        // 尚未上板且本回合累计低于门槛时，规则禁止收分，只能继续掷。
        const entryScore = game.entryScore ?? ENTRY_SCORE;
        const canStop = player.score > 0 || entryScore === 0 || total >= entryScore;

        // 硬目标：最终回合收下就能超过对手，或非最终回合收下就能触发目标分。
        const winsFinal = finalTurn && player.score + total > opponent.score;
        const reachesTarget = !finalTurn && player.score + total >= game.targetScore;

        // 启发式下一掷得分：下标 = 剩余骰数。颗数越少越难出分，估值越低。
        // 这张表不参与真实计分，只代替对下一掷样本空间的再枚举。
        const gain = [0, 25, 65, 110, 180, 280, 450][remaining];

        // 落后时放大继续掷的正收益，最多 1.3 倍，避免分差过大时无限加码。
        const chasing = Math.min(1.3, 1 + Math.max(0, opponent.score - player.score) / 16000);

        // 一层期望值：
        //   存活 (1-p)：拿到启发式收益，再乘风格和追分系数
        //   爆骰 p    ：输掉当前回合累计分 total
        // continueValue > 0 表示「再掷一次」的期望优于立刻停手。
        const continueValue = (1 - risk) * gain * attitude * chasing - risk * total;

        // 最终回合若收下仍追不上，禁止停手，否则会直接输掉比赛。
        const mustChase = finalTurn && player.score + total <= opponent.score;

        // 允许停手时，满足任一目标或期望已转负就收分。
        const stop = canStop && !mustChase && (winsFinal || reachesTarget || continueValue <= 0);

        return {
            ...option,
            type: stop ? "bank" : "roll",
            // 收分只比较已经拿到的子集分数；继续掷再叠加上一层期望值。
            utility: option.score + (stop ? 0 : continueValue),
            winsFinal,
            reachesTarget,
        };
    });

    // 词典序比较，不是把胜负目标折进同一个分数。
    // 先保证能赢就赢、能进最终回合就进，最后才比综合效用。
    evaluated.sort(
        (a, b) =>
            Number(b.winsFinal) - Number(a.winsFinal) ||
            Number(b.reachesTarget) - Number(a.reachesTarget) ||
            b.utility - a.utility,
    );

    // ids 是应保留的骰子；type 为 bank 或 roll，交给 aiAutomation 执行。
    return evaluated[0];
}
