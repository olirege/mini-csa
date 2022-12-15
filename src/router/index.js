import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StoreView from "../views/StoreView.vue";
import SubscribeView from "../views/SubscribeView.vue";
import ProductView from "../views/ProductView.vue";
import ProfileView from "../views/ProfileView.vue";
import EmployeePanelView from "../views/employee/EmployeePanelView.vue";
import CRUDProductView from "../views/employee/CRUDProductView.vue";
import FinishedProductsView from "../views/employee/FinishedProductsView.vue";
import OrdersView from "../views/employee/OrdersView.vue";
import ScheduleView from "../views/employee/ScheduleView.vue";
import SuppliersView from "../views/employee/SuppliersView.vue";
import ReviewsView from "../views/employee/ReviewsView.vue";
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
      name: "Store",
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
      name: "Profile",
      component: ProfileView,
    },
    {
      path: "/order/view/:id",
      name: "Order",
      component: OrderDetailView,
      props:true,
    },
    {
      path: "/employeepanel",
      name: "Employee Panel",
      component: EmployeePanelView,
      // meta: { requiresAuth: true },
    },
    {
      name: "Crudproducts",
      path: "/employeepanel/crudproducts",
      component: CRUDProductView,
      // meta: { requiresAuth: true },
    },
    {
      name: "Finished Products",
      path: "/employeepanel/finishedproducts",
      component: FinishedProductsView,
      // meta: { requiresAuth: true },
    },
    {
      name: "Orders",
      path: "/employeepanel/orders",
      component: OrdersView,
      // meta: { requiresAuth: true },
    },
    {
      name: "Schedule",
      path: "/employeepanel/schedule",
      component: ScheduleView,
      // meta: { requiresAuth: true },
    },
    {
      name: "Reviews",
      path: "/employeepanel/reviews",
      component: ReviewsView,
      // meta: { requiresAuth: true },
    },
    {
      name: "Suppliers",
      path: "/employeepanel/suppliers",
      component: SuppliersView,
      // meta: { requiresAuth: true },
    },
    
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },



  ],
});

export default router;
