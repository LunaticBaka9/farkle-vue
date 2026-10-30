import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
    // base 允许部署到子路径；未设置环境变量时使用根路径。
    base: process.env.VITE_BASE_PATH ?? "/",
    // plugins 启用 Vue 单文件组件编译和 Tailwind CSS Vite 转换。
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            // 将 '@' 指向项目根目录下的 'src' 文件夹
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
