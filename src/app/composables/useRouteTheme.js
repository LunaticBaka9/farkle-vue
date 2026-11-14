// 路由主题：只负责把 route.meta 同步到 html/body 并记录上次模式。
import { watch } from "vue";
import { rememberMode } from "../router/lastMode.js";

export function useRouteTheme({ theme, publicMode }) {
    watch(
        theme,
        (value) => {
            document.documentElement.dataset.mode = value;
            document.body.dataset.mode = value;
        },
        { immediate: true },
    );
    watch(publicMode, (value) => rememberMode(value), { immediate: true });

    function cleanupTheme() {
        delete document.documentElement.dataset.mode;
        delete document.body.dataset.mode;
    }

    return { cleanupTheme };
}
