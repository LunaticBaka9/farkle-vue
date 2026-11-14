import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/styles/index.css";

// app 是 Vue 应用实例；Pinia 负责跨组件共享 store，mount 将应用挂载到 index.html 的 app 节点。
const app = createApp(App);
app.use(createPinia());
app.mount("#app");
