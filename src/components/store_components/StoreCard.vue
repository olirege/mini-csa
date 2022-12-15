<template>
    <div class="store-card-wrapper">
        <TheCard :isActive="itemInCart(iid)">
            <template #overlay v-if="itemInCart(iid)"><i class="bi bi-cart-check"></i></template>
            <template #image>
                <router-link :to="'/product/' + pid + '&' + iid">
                    <img id="card-image" v-if ="item.images" :src="item.images.bigRef" alt="product thumbnail">
                    <span v-else>{{item.name}}</span>
                </router-link>
            </template>
            <template #title>
                <span class="custom-card-title">
                    <h3>{{formatString(item.name, 0, 25, true,false,'end')}}</h3>
                    <h5 v-if="item.supplier">{{item.supplier.name}}</h5>
                </span>
            </template>
            <template #body>
                <span class="h100 w100">
                    <p class="w100 row- align-start">{{item.blurb}}</p>
                    <span class="row- w100 gap025 flex-end">
                        <TheTag :code="colorCodes.warning" :size="'sml'" :text="formatNumber(item.price)"></TheTag>
                        <TheTag :code="colorCodes.success" :size="'sml'" :text="'$/' + item.unit"></TheTag>
                    </span>
                </span>
            </template>
            <template #extras>
                <span class="custom-buttons">
                    <button class="custom-button" @click="onAddToCart(pid,iid)">
                        <i class="bi bi-cart-plus"></i>
                    </button>
                    <button class="custom-button" @click="onRemoveFromCart(pid,iid)">
                        <i class="bi bi-cart-dash"></i>
                    </button>
                </span>
            </template>
        </TheCard>
    </div>
</template>
<script>
import { useHelperStore } from '../../stores/helpers'
import { useCartStore } from '../../stores/cart'
import TheCard from '../common/TheCard.vue'
import TheTag from '../common/TheTag.vue'
export default {
    components: {
        TheCard,
        TheTag,
    },
    props: {
        pid: {
            type: String,
            required: true
        },
        iid: {
            type: String,
            required: true
        }, 
        item: {
            type: Object,
            required: true
        },
    },
    setup() {
        const helperStore = useHelperStore()
        const cartStore = useCartStore()

        return {
            onAddToCart: cartStore.addToCart,
            onRemoveFromCart: cartStore.removeFromCart,
            itemInCart: cartStore.itemInCart,
            formatString: helperStore.formatStringToSubstring,
            formatNumber: helperStore.formatNumberToCurrency,
            colorCodes: helperStore.colorCodes,


        }
    }
}
</script>

<style scoped>
#card-image{
    width: 100%;
    height: 100%;
    object-fit: cover;
    color: var(--vt-c-white-mute);
    text-align: center ;
    
}
.custom-buttons{
    display:flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    width:100%;
    height: 2rem;
}
.custom-button{
    width: 100%;
    height: 100%;
    background-color: var(--vt-c-white);
    color: var(--vt-c-black);
    border: 1.3px solid var(--color-border);
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
}
.content > i{
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1.5rem;
    color:var(--vt-c-white);
    z-index: 2;
}
.content >  a{
    width: 100%;
    height: 100%;
}
</style>