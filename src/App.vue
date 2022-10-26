<script>
import { RouterLink, RouterView } from "vue-router";
import { useFirebaseStore } from "./stores/firebase";
import { useUserStore } from './stores/user';
import { useProductStore} from "./stores/products";
export default {
  setup() {
    const fb = useFirebaseStore();
    const userStore = useUserStore();
    fb.init().then(() => {
      const productStore = useProductStore();
      productStore.getProducts()
      // productStore.getItems()
    });
    return {userStore};
  },
};
</script>

<template>
  <main>
    <header>
      <div>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/store">Store</RouterLink>
        <RouterLink v-if ='userStore.isLogged' to="/profile">Profile</RouterLink>
      </div>
    </header>
    <div class="view-wrapper">
      <RouterView/>
    </div>
    <footer>
      <div>
        <p>© 2021 - All rights reserved</p>
      </div>
    </footer>
  </main>
</template>

<style scoped>
main {
  position:fixed;
  top:var(--header-height);
  height:calc(100vh - var(--header-height) - var(--footer-height));
  left:0;
  display: flex;
  flex-direction: column;
  width: 100vw;
  background-color: #f5f5f5;
}
header {
  position:fixed;
  top:0;
  left:0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  max-height: var(--header-height);
  width:100%;
  z-index: 1;
}

footer {
  position:fixed;
  bottom:0;
  left:0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  width:100%;
  max-height: var(--footer-height)
}
.view-wrapper {
  height:100%;
}
</style>
