// 天国模块路由：大厅与对战共用 kingdom 主题，但使用不同的会话标识。
import { useKingdomStore } from "./stores/kingdomStore.js";
import { KINGDOM_OPPONENTS } from "./data/items.js";

export const kingdomRoutes = [
    {
        path: "/kingdom",
        name: "kingdom",
        component: () => import("./views/KingdomLobbyView.vue"),
        meta: {
            module: "kingdom",
            publicMode: "kingdom",
            theme: "kingdom",
            session: "kingdom-lobby",
            title: "天国模式",
        },
    },
    {
        path: "/kingdom/battle/:opponentId",
        name: "kingdom-battle",
        component: () => import("./views/KingdomBattleView.vue"),
        meta: {
            module: "kingdom",
            publicMode: "kingdom",
            theme: "kingdom",
            session: "kingdom-battle",
            title: "天国对战",
        },
        // 直接访问对战地址时，只有当前挑战元数据匹配才允许进入，否则回大厅。
        beforeEnter: (to) => {
            const opponent = KINGDOM_OPPONENTS.find((item) => item.id === String(to.params.opponentId));
            const kingdom = useKingdomStore();
            if (!opponent || kingdom.activeBattle?.opponentId !== opponent.id) return { name: "kingdom" };
            return true;
        },
    },
];
