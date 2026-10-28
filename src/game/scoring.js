// 计分规则与概率工具模块。
// 本模块只负责纯计算，不读取或修改 Vue 响应式状态。
// PlayMonster Farkle rules. Combinations must come from the same roll.
/** 默认获胜分数。 */
export const TARGET_SCORE = 10000;
/** 首次收分门槛。 */
export const ENTRY_SCORE = 500;
/** 完整规则说明链接。 */
export const RULES_SOURCE = "https://www.playmonster.com/wp-content/uploads/2018/06/Farkle-Rules.pdf";

/**
 * 计算一组同一次投掷中骰子的得分。
 * 只接受合法的 1–6 点数组；空数组、超长数组或非法点数返回 0。
 */
export function scoreDice(values) {
    if (!values.length || values.length > 6 || values.some((v) => !Number.isInteger(v) || v < 1 || v > 6)) return 0;
    const counts = Array(6).fill(0);
    for (const value of values) counts[value - 1]++;
    // 六骰专属组合须先整体识别，不能拆成互相独立的计分部分。
    if (values.length === 6) {
        if (counts.every((n) => n === 1)) return 1500;
        if (counts.filter((n) => n === 2).length === 3) return 1500;
        if (counts.includes(4) && counts.includes(2)) return 1500;
        if (counts.filter((n) => n === 3).length === 2) return 2500;
    }
    let total = 0;
    for (let i = 0; i < 6; i++) {
        const n = counts[i];
        if (n >= 3) total += n === 6 ? 3000 : n === 5 ? 2000 : n === 4 ? 1000 : i === 0 ? 300 : (i + 1) * 100;
        else if (i === 0) total += n * 100;
        else if (i === 4) total += n * 50;
        else if (n > 0) return 0;
    }
    return total;
}

/**
 * 穷举当前骰子的所有选择组合，并按分数由高到低排列。
 * remaining 用于 AI 估算下一次掷剩余骰子的爆骰风险。
 */
export function scoringOptions(dice) {
    const options = [];
    for (let mask = 1; mask < 2 ** dice.length; mask++) {
        const chosen = dice.filter((_, index) => mask & (1 << index));
        const score = scoreDice(chosen.map((die) => die.value));
        if (score) options.push({ ids: chosen.map((die) => die.id), score, remaining: dice.length - chosen.length });
    }
    return options.sort((a, b) => b.score - a.score || a.remaining - b.remaining);
}

/**
 * 快速判断骰子组合是否至少存在一种计分方式。
 * 此函数用于掷骰后立刻判定 Farkle，不计算具体分数。
 */
export function hasScore(values) {
    // 快速判断是否存在任意可计分骰，供爆骰判定使用。
    if (values.includes(1) || values.includes(5)) return true;
    const counts = Array(6).fill(0);
    for (const value of values) counts[value - 1]++;
    return counts.some((n) => n >= 3) || (values.length === 6 && counts.filter((n) => n === 2).length === 3);
}

const riskCache = new Map();
/**
 * 精确计算掷出指定数量骰子后完全没有得分组合的概率。
 * 结果按骰子数量缓存，避免重复枚举。
 */
export function farkleProbability(count) {
    if (!Number.isInteger(count) || count < 1 || count > 6) throw new RangeError("Dice count must be 1–6");
    if (riskCache.has(count)) return riskCache.get(count);
    // 枚举该数量骰子的所有点数组合，精确统计无可计分组合的比例。
    let failures = 0;
    function visit(values) {
        if (values.length === count) {
            if (!hasScore(values)) failures++;
            return;
        }
        for (let face = 1; face <= 6; face++) visit([...values, face]);
    }
    visit([]);
    const risk = failures / 6 ** count;
    riskCache.set(count, risk);
    return risk;
}
