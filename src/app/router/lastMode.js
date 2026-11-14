// 上次访问模式：保留原有 localStorage key，兼容升级前保存的页面模式。
const PAGE_MODE_STORAGE_KEY = "farkle.pageMode.v1";
const PAGE_MODES = ["classic", "kingdom", "adventure"];

export function restoreLastMode() {
    try {
        const mode = localStorage.getItem(PAGE_MODE_STORAGE_KEY);
        return PAGE_MODES.includes(mode) ? mode : "classic";
    } catch {
        return "classic";
    }
}

export function rememberMode(mode) {
    if (!PAGE_MODES.includes(mode)) return;
    try {
        localStorage.setItem(PAGE_MODE_STORAGE_KEY, mode);
    } catch {
        // 浏览器禁用存储时仍可在当前会话内切换模式。
    }
}

export function routeForMode(mode) {
    if (mode === "kingdom") return "/kingdom";
    if (mode === "adventure") return "/adventure";
    return "/normal";
}

export function lastModePath() {
    return routeForMode(restoreLastMode());
}
