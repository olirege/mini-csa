<template>
    <main v-if="product">
        <h2 class='page-header'>
            {{product.name}}
        </h2>
        <div class="content-wrapper">
        {{product.description}}
        </div>
        <span>
            <button class="card-button" @click="onAddToCart(pid,iid)">Add to Cart</button>
                <div>{{cartQty}}</div>
            <button class="card-button" @click="onRemoveFromCart(pid,iid)">Remove from Cart</button>
        </span>

    </main>
</template>
<script>
import { ref,computed } from 'vue'
import { useProductStore } from '../stores/products'
import {useCartStore} from '../stores/cart'
export default ({
    props:[
        'id'
    ],
    setup(props) {
        const productStore = useProductStore()
        const pid = props.id.split('&')[0]
        const iid = props.id.split('&')[1]
        const product = productStore.selectedProduct(pid,iid)
        const cartStore = useCartStore()
        const cartQty = computed(() => cartStore.cartQty(iid))
        function onAddToCart(pid,iid) {
            cartStore.addToCart(pid,iid)
        }
        function onRemoveFromCart(pid,iid) {
            cartStore.removeFromCart(pid,iid)
        }  
        return {
            product,
            cartQty,
            onAddToCart,
            onRemoveFromCart,
            pid,
            iid,
        }  
    },
})
</script>
