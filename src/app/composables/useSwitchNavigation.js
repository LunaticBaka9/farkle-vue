// 模式切换与路由守卫：只负责确认弹窗、暂停/恢复会话和确认后的导航。
import { computed } from "vue";
import { routeForMode } from "../router/lastMode.js";
import { pauseActiveSession, resumeActiveSession, stopActiveSession } from "../../shared/session/moduleSession.js";
import {
    closeSwitchRequest,
    openSwitchRequest,
    switchRequest,
} from "../../shared/session/switchRequest.js";

const MODE_LABELS = { classic: "普通模式", kingdom: "天国模式", adventure: "冒险模式" };

export function useSwitchNavigation({ route, router, ui, kingdom }) {
    const targetLabel = computed(() => MODE_LABELS[switchRequest.targetMode] ?? "其他模式");

    function messageFor(fromRoute) {
        if (fromRoute.meta.session === "kingdom-battle") {
            return "离开将结束当前挑战，已支付的挑战金不会退回。";
        }
        if (fromRoute.meta.module === "normal") {
            return "当前普通对局会保留，返回后可继续。切换后当前模式的动画与 AI 会停止。";
        }
        if (fromRoute.meta.module === "kingdom") return "天国金币与收藏会自动保存。";
        return "冒险模式仍在开发中，确定切换吗？";
    }

    function requestModeChange(mode) {
        if (mode === route.meta.publicMode) return;
        ui.closeDialog();
        openSwitchRequest({
            targetPath: routeForMode(mode),
            targetMode: mode,
            message: messageFor(route),
        });
    }

    let allowNavigation = false;

    function confirmSwitch() {
        const targetPath = switchRequest.targetPath;
        const leavingBattle = route.meta.session === "kingdom-battle";
        // 先停会话和计时器，再清理挑战元数据，避免旧会话在清理后再次写回存档。
        stopActiveSession();
        if (leavingBattle) kingdom.endBattle();
        ui.closeDialog();
        ui.clearToast();
        closeSwitchRequest();
        allowNavigation = true;
        router.push(targetPath).finally(() => {
            allowNavigation = false;
        });
    }

    function cancelSwitch() {
        closeSwitchRequest();
        resumeActiveSession();
    }

    function installNavigationGuard() {
        return router.beforeEach((to, from) => {
            if (allowNavigation) {
                allowNavigation = false;
                return true;
            }
            if (!from.name) return true;
            const leavingModule = to.meta.module !== from.meta.module;
            const leavingBattle = from.meta.session === "kingdom-battle" && to.meta.session !== "kingdom-battle";
            if (!leavingModule && !leavingBattle) return true;
            ui.closeDialog();
            pauseActiveSession();
            openSwitchRequest({
                targetPath: to.fullPath,
                targetMode: to.meta.publicMode,
                message: messageFor(from),
            });
            return false;
        });
    }

    return { targetLabel, requestModeChange, confirmSwitch, cancelSwitch, installNavigationGuard };
}
