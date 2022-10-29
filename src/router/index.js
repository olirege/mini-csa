import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StoreView from "../views/StoreView.vue";
import SubscribeView from "../views/SubscribeView.vue";
import ProductView from "../views/ProductView.vue";
import ProfileView from "../views/ProfileView.vue";
import EmployeePanelView from "../views/employee/EmployeePanelView.vue";
import CRUDProductView from "../views/employee/CRUDProductView.vue";
import InventoryView from "../views/employee/InventoryView.vue";
import OrdersView from "../views/employee/OrdersView.vue";
import ScheduleView from "../views/employee/ScheduleView.vue";
import OrderDetailView from "../views/OrderDetailView.vue";
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
    },
    {
      path: "/order/view/:id",
      name: "order",
      component: OrderDetailView,
      props:true,
    },
    {
      path: "/employeepanel",
      name: "employee",
      component: EmployeePanelView,
      // meta: { requiresAuth: true },
    },
    {
      name: "crudproducts",
      path: "/employeepanel/crudproducts",
      component: CRUDProductView,
      // meta: { requiresAuth: true },
    },
    {
      name: "inventory",
      path: "/employeepanel/inventory",
      component: InventoryView,
      // meta: { requiresAuth: true },
    },
    {
      name: "orders",
      path: "/employeepanel/orders",
      component: OrdersView,
      // meta: { requiresAuth: true },
    },
    {
      name: "schedule",
      path: "/employeepanel/schedule",
      component: ScheduleView,
      // meta: { requiresAuth: true },
    },
    
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },



  ],
});

export default router;
