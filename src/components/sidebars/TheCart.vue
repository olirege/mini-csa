<template>
    <div class="wrapper">
        <div class="content" v-if="userStore.isLogged">
            <div class="header" v-if="isCartActive && timestamps">
                <span class="txt-wht txt-sml col- center">
                    <Countdown :start='timestamps.closesOn.toDate()'/>
                    <p>until cart is closed</p>
                </span>
                <i class="bi bi-cart4" ></i>
                <h3>Total: {{formatNumberToCurrency(total)}}</h3>
            </div>
            <div class="header" v-else-if="isCartDisabled">
                <i class="bi bi-cart-x" ></i>
            </div>
            <div class="cart" v-if="cart && isCartActive">
                <CartCard v-for='item in cart' :key='item.iid' :item='item'/>
            </div>
            <div v-else-if="isCartDisabled && timestamps" class="txt-wht txt-sml col- center">
                <p>Store will open on:</p> 
                <p>{{formatTimestamp(timestamps.opensOn)}}</p>
                <i class="bi bi-hourglass-split"></i>
                <Countdown :start='timestamps.opensOn.toDate()' />
                <p>from now.</p>
            </div>
            <div v-else class="col- center">
                <Spinner/>
            </div>
        </div>
    </div>
</template>
<script>
import { useCartStore } from '../../stores/cart'
import { useUserStore } from '../../stores/user'
import { useHelperStore } from '../../stores/helpers'
import { computed } from 'vue'
import CartCard from '../cart_components/CartCard.vue'
import Spinner from '../common/Spinner.vue'
import Countdown from '../common/CountdownComponent.vue'
export default {
    components: {
        CartCard,
        Spinner,
        Countdown
    },
    setup() {
        const cartStore = useCartStore()
        const timestamps = computed(() => cartStore.cartTimeStamps)
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        const cart = computed(() => cartStore.cart)
        const total = computed(() => cartStore.cartTotal())
        return {
            cart,
            total,
            userStore,
            isCartActive: computed(()=>cartStore.isCartActive),
            isCartDisabled: computed(()=>cartStore.isCartDisabled),
            timestamps,
            formatNumberToCurrency: helperStore.formatNumberToCurrency,
            formatTimestamp: helperStore.timestampFormatter,
            formatTimestamp: helperStore.timestampFormatter,

        }
    },
}
</script>
<style scoped>
.wrapper {
    position: fixed;
    top: var(--header-height);
    right: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 8rem;
    background-color: var(--color-cart-bg);
    border-left: 1px solid black;
}
.wrapper h3{
    color: var(--color-cart-text);
}
.content{
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
}
.content > .header > i {
    font-size: 2.2rem;
    color: var(--color-cart-text);
}
.content > .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width:100%;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--color-border)
}
.header> h3 {
    font-size: 0.7rem;
}
.cart{
    display:flex;
    width: 100%;
    flex-direction: column;
    gap:0.3rem;
}
</style>