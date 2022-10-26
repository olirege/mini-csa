import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StoreView from "../views/StoreView.vue";
import SubscribeView from "../views/SubscribeView.vue";
import ProductView from "../views/ProductView.vue";
import ProfileView from "../views/ProfileView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [{
        name: "subscribe", 
        path: "subscribe", 
        component: SubscribeView,
        props:true,
      }],
    },
    {
      path: "/store",
      name: "store",
      component: StoreView,
    },
    {
      path: "/product/:id",
      name: "product",
      component: ProductView,
      props:true,
    },
    {
      path: "/profile/",
      name: "profile",
      component: ProfileView,
    }


  ],
});

export default router;
