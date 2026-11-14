// 单活动会话管理器：保证同一时间只运行一个模块的 AI、动画和音效生命周期。
import { shallowRef } from "vue";

export const activeSession = shallowRef(null);

// 进入模块时调用；如果已有其他会话，先停止旧会话再启动新会话。
export function activateSession(id, hooks = {}) {
    if (activeSession.value?.id === id) return;
    activeSession.value?.hooks.stop?.();
    activeSession.value = { id, hooks };
    hooks.start?.();
}

// 模块卸载时调用；只停止当前会话，避免误停后续模块。
export function deactivateSession(id) {
    if (activeSession.value?.id !== id) return;
    activeSession.value.hooks.stop?.();
    activeSession.value = null;
}

// 切换确认弹窗打开时暂停当前会话，取消后恢复。
export function pauseActiveSession() {
    activeSession.value?.hooks.pause?.();
}

export function resumeActiveSession() {
    activeSession.value?.hooks.resume?.();
}

// 确认切换或离开模块时彻底停止当前会话。
export function stopActiveSession() {
    if (!activeSession.value) return;
    activeSession.value.hooks.stop?.();
    activeSession.value = null;
}
