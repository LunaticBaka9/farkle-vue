// 对局引擎模块：实现不可变对局状态转换、回合规则和 AI 决策。
// 每个公开动作接收旧 game 对象并返回新的 game 对象，调用方无需手动深拷贝。
import { ENTRY_SCORE, TARGET_SCORE, hasScore, scoreDice, scoringOptions, farkleProbability } from "./scoring.js";

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
        version: 1,
        mode,
        difficulty,
        targetScore,
        entryScore,
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

// Passing in a RNG keeps the rules deterministic and testable.
/**
 * 执行掷骰或继续掷骰。
 * random 参数允许测试注入固定随机序列；默认使用浏览器随机数。
 */
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

// AI 的决策分为两阶段：先枚举所有合法计分组合，再根据风险、得分、分差和游戏阶段逐项打分。
/**
 * 选择 AI 的下一次行动。
 *
 * 算法不是随机猜测，而是对当前骰面生成的每一种合法计分组合执行一次启发式估算：
 * 1. 计算保留该组合后，本回合累计得到多少分，以及下一次还能掷几颗骰子。
 * 2. 使用 scoring.js 中的精确概率计算下一次掷骰出现 Farkle 的风险。
 * 3. 根据 AI 难度风格、双方分差和是否处于最终回合，估算继续掷骰的期望收益。
 * 4. 若没有首次收分门槛限制、已达到目标分或继续掷收益为负，则选择收分；否则继续掷。
 *
 * 组合选项本身来自 scoringOptions()：它会穷举当前六颗骰子的合法子集，但只保留合法计分组合。
 * 最终排序会优先选择能够直接赢得最终回合、能够触发目标分或具有最高综合效用的组合。
 */
export function chooseAiMove(game) {
    // 回合刚开始时没有可选择的骰子，因此 AI 的唯一合法动作是掷出全部六颗。
    if (game.phase === "ready") return { type: "roll", ids: [] };

    // AI 只会在掷骰完成并进入 selecting 阶段时分析选骰方案；Farkle 或交接阶段没有决策动作。
    if (game.phase !== "selecting") return null;

    const options = scoringOptions(game.dice);
    const player = game.players[game.active];
    const opponent = game.players[1 - game.active];

    // finalTurn 表示当前玩家正在执行触发目标分后的最后一个回合。
    // 最终回合会让 AI 更偏向追分，而不是保守收分，以免总分低于对手。
    const finalTurn = game.finalStarter !== null && game.active !== game.finalStarter;

    // AI 风格通过乘数影响“继续掷”的收益：
    // cautious 收益较低，更倾向收分；balanced 为基准；bold 会放大继续冒险的收益。
    const attitude = { cautious: 0.72, balanced: 1, bold: 1.38 }[game.difficulty] || 1;

    // 对每一种计分方案分别计算是否收分，以及继续掷骰的综合效用。
    const evaluated = options.map((option) => {
        // total 是本回合已有得分加上当前方案分数；AI 能否收分时必须考虑整个回合累计值。
        const total = game.turnScore + option.score;

        // remaining 表示保留 option 后还能掷的骰子数量。
        // 六颗全保留时规则会触发 Hot Dice，因此 remaining 为 0 时仍按重新掷六颗处理。
        const remaining = option.remaining || 6;

        // risk 是下一次掷 remaining 颗骰子后完全没有计分组合的精确爆骰概率；值越高越危险。
        const risk = farkleProbability(remaining);

        // 首次收分门槛由当前对局配置决定；0 表示无限制。
        // 玩家已经有总分后，本回合不再受首次收分门槛限制。
        const entryScore = game.entryScore ?? ENTRY_SCORE;
        const canStop = player.score > 0 || entryScore === 0 || total >= entryScore;

        // winsFinal 和 reachesTarget 用于判断当前方案是否直接形成胜局优势或触发最终回合。
        const winsFinal = finalTurn && player.score + total > opponent.score;
        const reachesTarget = !finalTurn && player.score + total >= game.targetScore;

        // gain 是剩余骰数对应的经验性下一掷收益：剩余越少，继续掷通常越危险，理论收益越小。
        // 数组下标刚好对应 remaining；这里只是启发式估值，不参与实际计分。
        const gain = [0, 25, 65, 110, 180, 280, 450][remaining];

        // chasing 会根据 AI 与对手的分差提高追分程度，但最高限制为 1.3，避免分差过大时无限放大。
        const chasing = Math.min(1.3, 1 + Math.max(0, opponent.score - player.score) / 16000);

        // continueValue = 继续掷的正收益 - 爆骰损失：
        // (1 - risk) × 下一掷经验收益 × 风格 × 追分系数  减去  risk × 本回合可能损失的累计得分。
        const continueValue = (1 - risk) * gain * attitude * chasing - risk * total;

        // finalTurn 中只要当前方案连对手都追不上，就禁止收分，强制继续寻找更高分方案。
        const mustChase = finalTurn && player.score + total <= opponent.score;

        // 满足首次收分规则后，AI 在以下任一情况下收分：
        // 1. 当前方案可直接赢得最终回合；2. 可触发目标分/最终回合；3. 继续掷的期望收益已变为负值。
        const stop = canStop && !mustChase && (winsFinal || reachesTarget || continueValue <= 0);

        return {
            ...option,
            type: stop ? "bank" : "roll",
            // 收分方案优先只看实际能得到的分；继续掷方案额外叠加下一掷的期望收益。
            utility: option.score + (stop ? 0 : continueValue),
            winsFinal,
            reachesTarget,
        };
    });

    // 排序优先级从高到低：
    // 1. 能够赢下最终回合；2. 能触发目标分/最终回合；3. 当前方案的综合效用最高。
    // 第一项和第二项必须排在组合分数之前，避免 AI 虽然选高分却错失直接获胜机会。
    evaluated.sort(
        (a, b) =>
            Number(b.winsFinal) - Number(a.winsFinal) ||
            Number(b.reachesTarget) - Number(a.reachesTarget) ||
            b.utility - a.utility,
    );

    // 返回最高优先级方案，其中 ids 是本次应保留的骰子 ID，type 决定收分或继续掷。
    return evaluated[0];
}
