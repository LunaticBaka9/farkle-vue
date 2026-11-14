// 切换确认状态：模式按钮、天国返回和路由守卫共用同一份请求。
import { reactive } from "vue";
import { pauseActiveSession } from "./moduleSession.js";

export const switchRequest = reactive({
    open: false,
    targetPath: null,
    targetMode: null,
    message: "",
});

// 打开确认前先暂停当前会话，避免确认期间 AI 或动画继续推进。
export function openSwitchRequest({ targetPath, targetMode, message }) {
    pauseActiveSession();
    switchRequest.open = true;
    switchRequest.targetPath = targetPath;
    switchRequest.targetMode = targetMode;
    switchRequest.message = message;
}

export function closeSwitchRequest() {
    switchRequest.open = false;
    switchRequest.targetPath = null;
    switchRequest.targetMode = null;
    switchRequest.message = "";
}
