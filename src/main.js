import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./app/App.vue";
import { router } from "./app/router/index.js";
import "./assets/styles/index.css";

// app 是 Vue 应用实例；Pinia 负责共享状态，Router 负责三大模块页面切换。
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
