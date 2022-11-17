<template>
    <div class="page-wrapper">
        <h2>Order {{id}} Summary</h2>
        <div class="grid-content" v-if="oldCart && oldCart.oid == id">
            <div class="header">Processed on:{{oldCart.closedOn.toDate()}}</div>
            <div class="column">
                <div class="row" v-for="item in oldCart.items" :key="item.iid">{{item.name}} {{item.qty}} x {{item.price}}$ = {{item.price * item.qty}}$</div>
            </div>
            <div class="'total'">Total {{oldCart.total}}$</div>
        </div>
        <div v-else>
            <h2>no order</h2>
        </div>
    </div>
</template>
<script>
import { useCartStore } from '../stores/cart'
import { useProductStore} from '../stores/products'
import { computed } from 'vue'
export default ({
    props:[
        'id',
    ],
    setup(props) {
        const productStore = useProductStore()
        const products = productStore.products 
        const cartStore = useCartStore()
        const oldCart = computed(() => cartStore.oldCart)
        cartStore.getOlderCart(props.id)
        return {
            oldCart,
            oldCartLoaded: cartStore.oldCartLoaded,
            products,
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
.grid-content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas: 
        "header header header header"
        "item item item item"
        "item item item item"
        "item item item item"
        "total total total total";
    width: 100%;
    height: 100%;
}
.header {
    grid-area: header;
    font-weight: bold;
}
.row {
    grid-area: item;
    padding-left: 1rem;
}
.total {
    grid-area: total;
    font-weight: bold;
}

</style>
