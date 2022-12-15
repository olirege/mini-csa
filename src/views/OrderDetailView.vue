<template>
    <ThePage :id="id">
        <template #content>
            <div class="content">
                <TheCard :hasImage="false" :hasExtras="false" :isHeightDynamic="true" class="w100 h100">
                    <template #title>
                        <h3 class="italic pd1">{{formatTimestamp(oldCart.closedOn)}}</h3>
                        <span class="line"></span>
                    </template>
                    <template #body>
                        <div class="col- w100 h75screen">
                            <div class="row- w100 flex-start border-bottom">
                                <h3 class="w100">Item</h3>
                                <h3 class="w100">Quantity</h3>
                                <h3 class="w100">Price</h3>
                                <h3 class="w100">Total on Checkout</h3>
                                <h3 class="w100">Total on Packing</h3>
                            </div>
                            <div class="row- w100" v-for="item in oldCart.items" :key="item.iid">
                                <h4 class="w100">{{item.name}}</h4>
                                <h4 class="w100">{{item.qty}}</h4>
                                <h4 class="w100">{{formatNumber(item.price)}}</h4>
                                <h4 class="w100">{{formatNumber(item.price * item.qty)}}</h4>
                                <h4 class="w100">{{formatNumber(item.price * item.qty)}}</h4>
                            </div>
                            <span class="line"></span>
                            <span class="row- w100">
                                <div class="w100"></div>
                                <div class="w100"></div>
                                <div class="w100"></div>
                                <div class="w100">Total {{formatNumber(oldCart.checkoutTotal)}}</div>
                                <div class="w100">Total {{formatNumber(oldCart.scannedTotal)}}</div>   
                            </span>   
                        </div>
                    </template>
                </TheCard>
            </div>
        </template>
    </ThePage>
</template>
<script>
import { useCartStore } from '../stores/cart'
import ThePage from '../components/common/ThePage.vue'
import TheCard from '../components/common/TheCard.vue'
import { useProductStore } from '../stores/products'
import { useHelperStore } from '../stores/helpers'
import { computed } from 'vue'
export default ({
    components: {
        ThePage,
        TheCard,
    },
    props:[
        'id',
    ],
    setup(props) {
        const productStore = useProductStore()
        const helperStore = useHelperStore()
        const products = productStore.products 
        const cartStore = useCartStore()
        const oldCart = computed(() => cartStore.getOlderCart(props.id))
        return {
            oldCart,
            products,
            formatTimestamp: helperStore.timestampFormatter,
            formatNumber: helperStore.formatNumberToCurrency,
        }
    },

})
</script>
<style scoped>
.content{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width:100%;
    height: 100%;
}
.line{
    width: 100%;
    height: 1px;
    background-color: var(--color-border);
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
