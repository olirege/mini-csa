<template>
    <div class="row- w100 border-with-radius border-radius-lrg gap1 pd1">
        <div class="col- center">
            {{productRatingAvg}}
            <i class="bi bi-star-fill txt-lrgr"></i>
        </div>
        <div class="col- w100">
            <div v-for="(rating,index) in productRatingsReversed" :key="index" class="row- gap05 center">
                <p>{{reverseIndex[index]}}</p>
                <progress class="w100" :max="productRatingsReversed[0]" :value="rating"></progress>
                <p>{{rating}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import {computed} from 'vue'
export default ({
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    setup(props){

        const productRatingsReversed = computed(() => {
            const rating = props.product.rating
            const ratingReversed = rating.slice().reverse()
            return ratingReversed
            })
        const productRatingAvg = computed(()=>{
            const ratings = props.product.rating
            .map((value, index) => (index + 1) * value)
            .reduce((total, value) => total + value, 0);
            const totalReviews = props.product.rating.reduce((total, value) => total + value, 0);
            const average = ratings / totalReviews;
            return average.toFixed(1)
        })
        return{
            productRatingsReversed,
            productRatingAvg,
            reverseIndex: [5,4,3,2,1],
        }
    }

})
</script>