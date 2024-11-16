import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../view/Home.vue";
import Setting from "../view/Setting.vue";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/setting",
      component: Setting,
    },
  ],
});
export default router;
