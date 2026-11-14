// 路由入口：使用 hash history，保证 GitHub Pages 静态部署刷新不 404。
import { createRouter, createWebHashHistory } from "vue-router";
import { normalRoutes } from "../../modules/normal/routes.js";
import { kingdomRoutes } from "../../modules/kingdom/routes.js";
import { adventureRoutes } from "../../modules/adventure/routes.js";
import { lastModePath, routeForMode } from "./lastMode.js";

const routes = [
    { path: "/", redirect: () => lastModePath() },
    ...normalRoutes,
    ...kingdomRoutes,
    ...adventureRoutes,
    { path: "/:pathMatch(.*)*", redirect: "/normal" },
];

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});

export { routeForMode };
