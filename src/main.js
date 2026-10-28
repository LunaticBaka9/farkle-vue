// 应用入口：创建 Vue 实例、加载全局样式，并挂载唯一根组件。
// 业务逻辑不放在入口文件中，由组件和组合式函数负责。
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// #app 是 index.html 提供的挂载节点。
createApp(App).mount("#app");
