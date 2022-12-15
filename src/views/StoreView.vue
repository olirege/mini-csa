<template>
    <ThePage :hasCartBar="true">
        <template #content v-if="globalLoading">
            <section v-for="(product,pid,index) in products" :key="index" :id="pid">
                <div class="section-header">
                    <img class="section-image" :src="product.storeImage"/>
                    <span class="col- gap05">
                        <h2 class='row- w100 border-bottom-lg pd05 bg-blk-lgtr border-radius-mix1'>
                            {{product.name}}
                        </h2>
                        <p class='row- w100 border-bottom-lg pd05 pd1lft italic bg-wht border-radius-mix2'>
                        {{product.description}}
                        </p>
                    </span>
                </div>
                <div class="content" v-if= "product.items">
                    <StoreCard 
                    v-for='(item,iid,itemIndex) in product.items' 
                    :key='itemIndex' 
                    :pid="pid" 
                    :iid="iid" 
                    :item="item" 
                    />
                </div>
            </section>
        </template>
        <template #content v-else>
            <SectionSkeleton/>
            <div class="content">
                <StoreCardSkeleton v-for="n in 15" :key="n"/>
            </div>
        </template>
    </ThePage>
    <TheCart></TheCart>
</template>
<script>
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useUserStore } from '../stores/user'
import { useHelperStore } from '../stores/helpers';
import { computed } from 'vue';
import TheCard from '../components/common/TheCard.vue'
import TheCart from '../components/sidebars/TheCart.vue';
import ThePage from '../components/common/ThePage.vue';
import StoreCard from '../components/store_components/StoreCard.vue';
import StoreCardSkeleton from '../components/store_components/StoreCardSkeleton.vue';
import SectionSkeleton from '../components/store_components/SectionSkeleton.vue';
export default ({
    components: {
        TheCard,
        TheCart,
        ThePage,
        StoreCard,
        StoreCardSkeleton,
        SectionSkeleton
    },
    setup() {
        const productStore = useProductStore()
        const cartStore = useCartStore()
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        const cart = computed(() => cartStore.cart)

    return {
        products: productStore.products,
        cart,
        formatNumber: helperStore.formatNumberToCurrency,
        formatString: helperStore.formatStringToSubstring,
        userStore,
        globalLoading: helperStore.globalLoading
        }
    },
})
</script>
<style scoped>
section{
    width:100%;
}
.section-header{
    display:flex;
    flex-direction: column;
}
.section-image{
    height: 15rem;
    object-fit: cover;
    border-radius: 10px 0px;
    width:100%;
}
.content{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(250px, 250px));
    grid-gap: 1rem;
    width: 100%;
    height: 100%;
    padding: 1rem 0;
    margin-bottom: 3rem;
}
</style>
