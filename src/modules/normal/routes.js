// 普通模式路由：只负责声明路由和 meta，不包含页面逻辑。
export const normalRoutes = [
    {
        path: "/normal",
        name: "normal",
        component: () => import("./views/NormalView.vue"),
        meta: {
            module: "normal",
            publicMode: "classic",
            theme: "classic",
            session: "normal-game",
            title: "普通模式",
        },
    },
];
