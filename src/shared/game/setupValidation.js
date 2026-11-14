// 设置表单校验：只暴露目标分数和首次收分门槛的纯校验函数。
import { isValidEntryScore, isValidTargetScore } from "./engine.js";

export function isTargetScoreInputValid(value) {
    return isValidTargetScore(Number(value));
}

export function isEntryScoreInputValid(value) {
    return isValidEntryScore(Number(value));
}
