// 对局存档适配层：由 stores/farkle.js 在创建 store 时读取，并在 game 更新后写回。
import { ENTRY_SCORE, TARGET_SCORE } from "./scoring.js";
import { isValidEntryScore, isValidTargetScore } from "./engine.js";

export const GAME_STORAGE_KEY = "farkle.table.v1";

// 校验 localStorage 快照的外部数据；数据格式改动时从这里统一维护兼容条件。
export function isValidGameSnapshot(value) {
    if (!value || value.version !== 1 || !["ai", "local"].includes(value.mode) || ![0, 1].includes(value.active))
        return false;
    const targetScore = value.targetScore ?? TARGET_SCORE;
    const entryScore = value.entryScore ?? ENTRY_SCORE;
    if (!isValidTargetScore(targetScore) || !isValidEntryScore(entryScore)) return false;
    if (
        !Array.isArray(value.players) ||
        value.players.length !== 2 ||
        !value.players.every(
            (player) =>
                typeof player.name === "string" &&
                player.name.length <= 24 &&
                Number.isInteger(player.score) &&
                player.score >= 0,
        )
    )
        return false;
    if (
        !["ready", "selecting", "farkle", "handoff", "finished"].includes(value.phase) ||
        !Number.isInteger(value.turnScore) ||
        value.turnScore < 0
    )
        return false;
    if (
        !Array.isArray(value.dice) ||
        value.dice.length > 6 ||
        !value.dice.every(
            (die) => typeof die.id === "string" && Number.isInteger(die.value) && die.value >= 1 && die.value <= 6,
        )
    )
        return false;
    if (
        !Array.isArray(value.history) ||
        !Array.isArray(value.kept) ||
        !Number.isInteger(value.turn) ||
        value.turn < 1 ||
        !Number.isInteger(value.rollNumber) ||
        value.rollNumber < 0
    )
        return false;
    if (!["cautious", "balanced", "bold"].includes(value.difficulty)) return false;
    if (
        !value.history.every(
            (event) =>
                event &&
                ["bank", "farkle"].includes(event.type) &&
                typeof event.name === "string" &&
                Number.isInteger(event.points) &&
                event.points >= 0 &&
                Number.isInteger(event.turn),
        )
    )
        return false;
    if (![null, 0, 1].includes(value.finalStarter) || ![null, 0, 1, "tie"].includes(value.winner)) return false;
    return value.phase !== "finished" || value.winner !== null;
}

// store 初始化时调用此函数；损坏、过期或浏览器禁用存储时返回 null。
export function restoreGame(storageKey = GAME_STORAGE_KEY, storage = null) {
    try {
        const value = JSON.parse((storage ?? globalThis.localStorage).getItem(storageKey));
        if (!isValidGameSnapshot(value)) return null;
        return {
            ...value,
            targetScore: value.targetScore ?? TARGET_SCORE,
            entryScore: value.entryScore ?? ENTRY_SCORE,
        };
    } catch {
        return null;
    }
}

// store 监听 game 状态变化时调用；存储失败不影响当前对局。
export function saveGame(game, storageKey = GAME_STORAGE_KEY, storage = null) {
    try {
        (storage ?? globalThis.localStorage).setItem(storageKey, JSON.stringify(game));
        return true;
    } catch {
        return false;
    }
}
