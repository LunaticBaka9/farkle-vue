// 计分规则与概率工具：由 shared/game/engine.js 和 createGameSessionStore.js 调用。
// 本模块只负责纯计算，不读取或修改 Vue 响应式状态。
// 骰子最多 6 颗，状态空间很小（子集 2^6、点数组合 6^6），因此全部使用精确穷举。
// PlayMonster Farkle rules. Combinations must come from the same roll.
/** 默认获胜分数。 */
export const TARGET_SCORE = 10000;
/** 首次收分门槛。 */
export const ENTRY_SCORE = 500;
/** 完整规则说明链接。 */
export const RULES_SOURCE = "https://www.playmonster.com/wp-content/uploads/2018/06/Farkle-Rules.pdf";

/**
 * 计算一组同一次投掷中骰子的得分。
 * 调用方：engine.selectionScore / scoringOptions；输入来自当前掷出的点数数组。
 *
 * 问题：给定 1–6 个点数，算出这组骰子的合法分数；混入任何不能计分的骰子则整组为 0。
 * 算法：频次直方图 + 贪心优先级匹配。
 * 原理：点数只有 6 种，用 counts[i] 记录点数 i+1 的出现次数即可判断牌型。
 *       六骰专属组合会占用全部骰子，必须先于可拆分计分识别，否则顺子会被拆成散 1/5。
 * 只接受合法的 1–6 点数组；空数组、超长数组或非法点数返回 0。
 */
export function scoreDice(values) {
    if (!values.length || values.length > 6 || values.some((v) => !Number.isInteger(v) || v < 1 || v > 6)) return 0;
    // 直方图：counts[0] 是 1 点的颗数，counts[5] 是 6 点的颗数。
    const counts = Array(6).fill(0);
    for (const value of values) counts[value - 1]++;
    // 六骰专属组合须先整体识别，不能拆成互相独立的计分部分。
    if (values.length === 6) {
        if (counts.every((n) => n === 1)) return 1500; // 顺子 1–6
        if (counts.filter((n) => n === 2).length === 3) return 1500; // 三对
        if (counts.includes(4) && counts.includes(2)) return 1500; // 四条 + 一对
        if (counts.filter((n) => n === 3).length === 2) return 2500; // 两个三条
    }
    // 按点数贪心加分：三条及以上优先，散骰只允许 1 和 5。
    let total = 0;
    for (let i = 0; i < 6; i++) {
        const n = counts[i];
        // n 条：6=3000，5=2000，4=1000；三个 1=300，三个 k=k*100。
        if (n >= 3) total += n === 6 ? 3000 : n === 5 ? 2000 : n === 4 ? 1000 : i === 0 ? 300 : (i + 1) * 100;
        else if (i === 0) total += n * 100; // 散 1：每颗 100
        else if (i === 4) total += n * 50; // 散 5：每颗 50
        else if (n > 0) return 0; // 2/3/4/6 的散骰不能单独计分，整组非法
    }
    return total;
}

/**
 * 穷举当前骰子的所有选择组合，并按分数由高到低排列。
 * 调用方：engine.chooseAiMove、store.suggest；输入来自当前桌面 dice[{id,value}]。
 *
 * 问题：从 n 颗骰子中找出全部合法计分子集，供建议选骰和 AI 评估。
 * 算法：二进制掩码子集枚举。mask 的第 i 位为 1 表示选中第 i 颗，范围 1..2^n-1。
 * 原理：n≤6 时非空子集最多 63 个，穷举比按牌型搜索更不容易漏组合。
 * remaining 用于 AI 估算下一次掷剩余骰子的爆骰风险；0 表示 Hot Dice。
 */
export function scoringOptions(dice) {
    const options = [];
    for (let mask = 1; mask < 2 ** dice.length; mask++) {
        // mask & (1 << index) 为真时，当前子集包含第 index 颗骰子。
        const chosen = dice.filter((_, index) => mask & (1 << index));
        const score = scoreDice(chosen.map((die) => die.value));
        if (score) options.push({ ids: chosen.map((die) => die.id), score, remaining: dice.length - chosen.length });
    }
    // 高分优先；同分时留下更少骰子（更容易 Hot Dice）。
    return options.sort((a, b) => b.score - a.score || a.remaining - b.remaining);
}

/**
 * 快速判断骰子组合是否至少存在一种计分方式。
 * 调用方：engine.rollDice、farkleProbability；输入来自刚掷出的点数。
 *
 * 问题：掷完立刻判定是否 Farkle，只需要布尔结果，不需要具体分数。
 * 算法：短路谓词。有 1 或 5 必得分；否则用直方图检查三条或六骰三对。
 * 原理：顺子 / 四带对 / 两个三条都会被「含 1 或 5」或「含三条」提前命中，不必单独写。
 * 此函数用于掷骰后立刻判定 Farkle，不计算具体分数。
 */
export function hasScore(values) {
    // 最快路径：有 1 或 5，一定能计分。
    if (values.includes(1) || values.includes(5)) return true;
    const counts = Array(6).fill(0);
    for (const value of values) counts[value - 1]++;
    // 没有 1/5 时，只可能靠三条，或六骰且恰好三对。
    return counts.some((n) => n >= 3) || (values.length === 6 && counts.filter((n) => n === 2).length === 3);
}

// riskCache 缓存各骰子数量的爆骰概率，避免对相同数量重复枚举所有骰面组合。
const riskCache = new Map();
/**
 * 精确计算掷出指定数量骰子后完全没有得分组合的概率。
 * 调用方：engine.chooseAiMove、store.nextRisk；输入为下一掷将使用的骰子数量 1–6。
 *
 * 问题：求再掷 count 颗骰子后完全没有得分组合的精确概率。
 * 算法：DFS 完全枚举样本空间 + Map 记忆化。
 * 原理：每颗骰子独立均匀，总结果数为 6^count；叶子上用 hasScore 统计失败次数后相除。
 *       count=6 时最多 46656 种，算一次即可；同一 count 的结果不变，故按数量缓存。
 * 结果按骰子数量缓存，避免重复枚举。
 */
export function farkleProbability(count) {
    if (!Number.isInteger(count) || count < 1 || count > 6) throw new RangeError("Dice count must be 1–6");
    if (riskCache.has(count)) return riskCache.get(count);
    let failures = 0;
    // DFS：values 是已填好的点数前缀；深度等于 count 时得到一个完整结果。
    function visit(values) {
        if (values.length === count) {
            if (!hasScore(values)) failures++;
            return;
        }
        for (let face = 1; face <= 6; face++) visit([...values, face]);
    }
    visit([]);
    // 精确比例，不是蒙特卡洛抽样。
    const risk = failures / 6 ** count;
    riskCache.set(count, risk);
    return risk;
}
