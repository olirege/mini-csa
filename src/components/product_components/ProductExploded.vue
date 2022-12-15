<template>
    <div id="custom-height" class="row- gap1">
        <div class="col-">
            <img class="border-with-radius" :src="product.images.bigRef" alt="product image">
        </div>
        <div class="col- w100 h100 gap05">
            <span 
            class="row- center-space-between w100 border-bottom-lg pd05 bg-blk-lgtr border-radius-mix1">
                <h3 class="txt-black">{{product.name}}</h3>
                <h5 id='supplier-title' class="txt-blk-lgt italic"> from {{product.supplier.name}}</h5>
            </span>
            <span>
                <TheCard
                    :hasImage="false"
                    :hasExtras="false"
                    :hasTitle="false"  
                    :isHeightDynamic="true"
                    :bodyStyle="'align-start'"
                    :borderRadius="'mix2'"
                    >
                    <template #body>
                        <div class="row- h100">
                            <i class="bi bi-quote txt-lrgr"></i>
                            <h3 class="h100 pd1 txt-blk-dark">{{product.description}}</h3>
                            <i class="bi bi-quote txt-lrgr flex end flip-x"></i>
                        </div>
                    </template>
                </TheCard>
            </span>
            <span class="row-  w100 h100 center gap1">
                <div class="border-with-radius w4rem h4rem pd05 flex center"><p class="txt-sml">{{formatNumber(product.price)}}</p></div>
                <div class="border-with-radius w4rem h4rem pd05 flex center"><p class="txt-sml">$/{{product.unit}}</p></div>
            </span>
            <span class="row- h100 center-end txt-lrgr gap1" v-if="isLogged">
                <i class="bi bi-cart-plus" @click="onAddToCart(pid,iid)"></i>
                    <div class="flex center bg-wht border-with-radius w2_5rem">{{cartQty}}</div>
                <i class="bi bi-cart-dash" @click="onRemoveFromCart(pid,iid)"></i>
            </span>
        </div>
    </div>
</template>
<script>
import TheCard from '../common/TheCard.vue'
import { useCartStore } from '../../stores/cart.js'
import { useHelperStore } from '../../stores/helpers.js'
import { useUserStore } from '../../stores/user.js'
import { computed } from 'vue'
export default ({
    components: {
        TheCard
    },
    props: {
        product: {
            type: Object,
            required: true
        },
        pid: {
            type: String,
            required: true
        },
        iid: {
            type: String,
            required: true
        },
    },
    setup(props){

        const cartStore = useCartStore()
        const helperStore = useHelperStore()
        const userStore = useUserStore()
        const cartQty = computed(() => cartStore.cartQty(props.iid))

        function onAddToCart(pid,iid) {
            cartStore.addToCart(pid,iid)
        }
        function onRemoveFromCart(pid,iid) {
            cartStore.removeFromCart(pid,iid)
        }
        return{
            onAddToCart,
            onRemoveFromCart,
            formatNumber: helperStore.formatNumberToCurrency,
            cartQty,
            isLogged: userStore.isLogged
        }
    }
})
</script>
<style scoped>
#supplier-title{
    position:absolute;
    bottom:0;
    right:0.5rem;
}
#custom-height{
    min-height: 369px;
}
</style>

