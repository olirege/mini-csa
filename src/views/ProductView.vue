<template>
    <ThePage :hasTitle="false">
        <template #content>
            <ProductExploded 
            :product="product" 
            :pid="pid" 
            :iid="iid"/>
            <div class="row- w100 pd1top gap1">
                <div id="custom-width" class="col- gap05">
                    <h5>Ratings</h5>
                    <RatingsDisplay :product="product"/>
                </div>
                <div class="col- h100 w100 gap05">
                    <h5>Reviews</h5>
                    <ReviewsDisplay :iid="iid"/>
                </div>
            </div>
        </template>
    </ThePage>
</template>
<script>
import { useProductStore } from '../stores/products'
import ThePage from '../components/common/ThePage.vue'
import ProductExploded from '../components/product_components/ProductExploded.vue'
import RatingsDisplay from '../components/product_components/RatingsDisplayComponent.vue'
import ReviewsDisplay from '../components/product_components/ReviewsDisplayComponent.vue'
export default ({
    components: {
        ThePage,
        ProductExploded,
        RatingsDisplay,
        ReviewsDisplay
    },
    props:[
        'id'
    ],
    setup(props) {
        const productStore = useProductStore()
        const pid = props.id.split('&')[0]
        const iid = props.id.split('&')[1]
        const product = productStore.selectedProduct(pid,iid)
        return {
            product,
            pid,
            iid,
        } 
    },
})
</script>
<style scoped>
#custom-width{
    min-width: 502px;
}
</style>