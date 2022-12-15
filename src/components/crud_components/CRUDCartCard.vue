<template>
    <div class="cart-card-wrapper">
        <TheCard :isSmall="true">
            <template #overlay>
                <p class="qty"> {{productQty}} </p>
            </template>
            <template #image>
                <img v-if="image" id="card-image" :src= image alt="Product thumbnail">
                <div class="flex center h100 w100" v-else>
                    <i class="bi bi-image"></i>
                </div>
            </template>
            <template #title>
                <span class="card-title">
                    <h3>{{formatString(productName, 0, 13, true, false, 'end')}}</h3>
                    <p>{{formatNumber(productPrice)}}/{{productUnit}}</p>
                </span>
            </template>
            <template #body>
                <span>
                    <p>{{formatNumber(productQty * productPrice)}}</p>
                </span>
            </template>
            <template #extras>
                <i class="bi bi-plus"></i>
                <i class="bi bi-dash"></i>
            </template>
        </TheCard>
    </div>
</template>
<script>
import { useHelperStore } from '../../stores/helpers'
import TheCard from '../common/TheCard.vue'
export default {
    components: {
        TheCard,
    },
    props: {
        image: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        productPrice: {
            type: Number,
            required: true
        },
        productUnit: {
            type: String,
            required: true
        },
        productQty: {
            type: Number,
            required: true
        },

    },
    setup() {
        const helperStore = useHelperStore()
        const formatString = helperStore.formatStringToSubstring
        const formatNumber = helperStore.formatNumberToCurrency
        return {
            formatString,
            formatNumber,
        }
    }
}
</script>

<style scoped>
.cart-card-wrapper{
    width: 8rem;
    height: 246px;
    overflow: hidden;
}
#card-image{
    width: 100%;
    height: 100%;
    object-fit: cover;
    color: var(--vt-c-white-mute);
    text-align: center ;
    
}
.cart-card-wrapper img{
    border-radius:  5px 0 0;
    max-height: 100px;
}
.cart-card-wrapper .qty {
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