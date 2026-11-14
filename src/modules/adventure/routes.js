// 冒险模块路由：当前为预览页，没有独立会话和定时器。
export const adventureRoutes = [
    {
        path: "/adventure",
        name: "adventure",
        component: () => import("./views/AdventureView.vue"),
        meta: {
            module: "adventure",
            publicMode: "adventure",
            theme: "adventure",
            session: null,
            title: "冒险模式",
        },
    },
];
