<script>
import { useRouter } from "vue-router";
import { useFirebaseStore } from "./stores/firebase";
import { useUserStore } from './stores/user';
import { useProductStore } from "./stores/products";
import { useHelperStore } from "./stores/helpers";
import TheSideMenu from "./components/sidebars/TheSideMenu.vue";
import TheHeader from "./components/sidebars/TheHeader.vue";
import { computed } from 'vue'
export default {
  components: {
    TheSideMenu,
    TheHeader,
  },
  setup() {
    const router = useRouter();
    const fb = useFirebaseStore();
    const userStore = useUserStore();
    const productStore = useProductStore();
    const helper = useHelperStore();
    const currentRoute = computed(() => router.currentRoute.value.name);
    
    const products = computed(() => productStore.products);
    const items = computed(() => productStore.items);
    
    fb.init().then(() => {
      helper.globalLoading = true;
      productStore.getProductTree()
      .then(()=>{
        if(areAllImagesLoaded.value) {
          helper.globalLoading = false;
        }
      })
    })
    
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth && !userStore.isAdmin) {
        next({ name: "Store" });
      } else {
        next();
      }
    });
    
    const areAllImagesLoaded = computed(() => {
      const _products = Object.values(products.value);
      const _items = Object.values(items.value);
      const p = _products.every(product => product.storeImage.complete)
      const i = _items.every(item => item.images.bigRef.complete);
      return p && i;
    });
    
    return {
    userStore,
    currentRoute,
    };
  },
};
</script>

<template>
  <main>
    <div class="view-wrapper">
      <TheSideMenu v-if="currentRoute !== 'home'"/>
      <TheHeader v-if="currentRoute !== 'home'"/>
      <RouterView/>
    </div>
  </main>
</template>

<style scoped>
main {
  position:fixed;
  /* top:var(--header-height); */
  /* height:calc(100vh - var(--header-height) - var(--footer-height)); */
  top: 0;
  height: 100vh;
  left:0;
  display: flex;
  flex-direction: column;
  width: 100vw;
  background-color: #f5f5f5;
}
.view-wrapper {
  height:100%;
}
</style>
