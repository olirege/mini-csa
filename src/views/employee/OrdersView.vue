<template>
    <div>
        <h2>Orders</h2>
    </div>
    <div class='page-wrapper'>
        <div class="search-wrapper">
            <input type="text" v-model="search" placeholder="Search">
        </div>
        <div class='content' v-if="carts">
            <div class="order" v-for="cart in carts" :key="cart">
                <div class="query-id">{{cart}}</div>
                <div class='query-item' v-for="(item,index) in cart.active.items" :key="index">{{item.iid}} {{item.qty}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { useCartStore } from '../../stores/cart'
import {ref} from 'vue'
export default ({
    setup() {
        const cartStore = useCartStore()
        cartStore.loadFullCarts()
        const carts = cartStore.carts
        const search = ref(null)
        return {
            cartStore,
            carts,
            search,
        }
    },
})
</script>
<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
.content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.order {
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    margin: 10px;
    padding: 10px;
}
.query-id {
    font-weight: bold;
}
.query-item {
    padding-left: 1rem;
}
.search-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2rem;
}
.search-wrapper input {
    width: 50%;
}
</style>
