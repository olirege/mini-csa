<template>
    <div class="page-wrapper">
        <div class="content">
            <div class='row' v-for="(cart,date,index) in cartsDue" :key="index">
                {{date}}
                <div class='cart-detail' v-for="(data,index) in cart" :key="index">
                    {{data.id}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {computed} from 'vue'
import { useCartStore } from '../../stores/cart'
export default ({

    setup() {
        const cartStore = useCartStore()
        cartStore.getCartsDueForNext7Days()
        const cartsDue = computed(() => cartStore.cartsDue)
        return {
            cartsDue
        }
    },
})
</script>
<style scope>
.cart-detail{
    margin-left:1rem;
}
</style>