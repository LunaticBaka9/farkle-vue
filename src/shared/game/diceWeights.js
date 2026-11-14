// 单颗骰子的权重抽样：权重下标 0 对应 1 点；非法权重回退为均匀随机。
export const UNIFORM_DICE_WEIGHTS = Object.freeze([1, 1, 1, 1, 1, 1]);

export function isValidDiceWeights(weights) {
    return (
        Array.isArray(weights) &&
        weights.length === 6 &&
        weights.every((weight) => Number.isFinite(weight) && weight >= 0) &&
        weights.some((weight) => weight > 0)
    );
}

export function rollWeightedFace(weights, random = Math.random) {
    if (!isValidDiceWeights(weights)) {
        return Math.min(6, Math.max(1, Math.floor(random() * 6) + 1));
    }
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let point = random() * total;
    for (let index = 0; index < weights.length; index += 1) {
        point -= weights[index];
        if (point < 0) return index + 1;
    }
    return 6;
}
