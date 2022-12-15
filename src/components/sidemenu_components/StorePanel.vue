<template>
    <div class="navigator">
        <RouterLink class="subtitle-wrapper" :to="{name:'Store'}">
            <h3 class="subtitle">Categories</h3>
        </RouterLink>
        <div class="nav-item" v-for="(product,pid,index) in products" :key="index" @click="$emit('scrollto',pid)">
            <p>{{product.name}}</p>
        </div>
    </div>
</template>
<script>
import { useProductStore } from '../../stores/products'
import { computed } from 'vue'

export default({
    setup() {
        const productStore = useProductStore()
        const products = computed(() => productStore.products)
        return{
            products
        }
    },
})
</script>
<style scoped>
.navigator {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    padding: 0.5rem;
}
.navigator .subtitle-wrapper {
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width:100%;
    margin-bottom: 0.5rem;
    padding-right: 0.5rem;
    cursor: pointer;
    text-decoration: none;

}
.subtitle-wrapper i:hover {
    color: var(--vt-c-white);
}
.navigator .subtitle{
    font-size: 0.8rem;
    color: var(--color-sidemenu-subtitle);
    margin-left: 5px;
}
.nav-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 1.3rem;
    padding-left: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.2s ease-in-out;
}
.nav-item:hover {
    background-color: var(--color-sidemenu-hover);
}
.nav-item > p {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--color-sidemenu-text);
}
</style>
