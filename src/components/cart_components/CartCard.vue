<template>
     <TheCard :isSmall="true">
        <template #overlay>
            <p class="qty">{{item.qty}}</p>
        </template>
        <template #image>
            <img :src="getImageUrl(item)"/>
        </template>
        <template #title>
            <span class="card-title">
                <h3>{{formatString(item.name, 0, 13, true, false, 'end')}}</h3>
                <p>{{formatNumberToCurrency(item.price)}}/ea</p>
            </span>
        </template>
        <template #body>
            <p>{{formatNumberToCurrency(item.qty * item.price)}}</p>
        </template>
        <template #extras>
            <i class="bi bi-plus" @click="onAddToCart(item.pid,item.iid)"></i>
            <i class="bi bi-dash" @click="onRemoveFromCart(item.pid,item.iid)"></i>
        </template>
    </TheCard>
</template>
<script>
import { useCartStore } from '../../stores/cart'
import { useHelperStore } from '../../stores/helpers'
import { useProductStore } from '../../stores/products'
import TheCard from '../common/TheCard.vue'

export default ({
    name: 'CartCard',
    components: {
        TheCard,
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const cartStore = useCartStore()
        const helperStore = useHelperStore()
        const productStore = useProductStore()
        const products = productStore.products
        function getImageUrl(item){
            if (products[props.item.pid].items[props.item.iid].images){
                return products[props.item.pid].items[props.item.iid].images.thumbnailRef
            }
        }
        return{
            getImageUrl,
            onAddToCart: cartStore.addToCart,
            onRemoveFromCart: cartStore.removeFromCart,
            formatNumberToCurrency: helperStore.formatNumberToCurrency,
            formatString: helperStore.formatStringToSubstring,
            getImageUrl,
        }
    },
})
</script>
<style scoped>
img{
    border-radius: 5px;
    max-height: 100px;
}
.qty {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 25px;
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    z-index: 2;
}
.card-title{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
}
.card-title > h3 {
    height: 0.9rem;
    font-size: 0.7rem;
    margin-bottom: 0.1rem;
    justify-content: flex-start;
    color: var(--color-text-secondary);
}
.card-title p {
    font-size: 0.6rem;
    color: var(--color-text);
    font-style: italic;
    align-self: flex-start;
}
</style>
