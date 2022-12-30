<template>
    <ThePage>
        <template #content>
            <div id="content" class='row- gap1 w100 h100' v-if="allReviews">
                <ReviewContentComponent :reviewList="allReviews"/>
            </div>
        </template>
    </ThePage>
</template>
<script>
import { reactive, computed } from 'vue'
import { useReviewsStore } from '../../stores/reviews'
import { useUserStore } from '../../stores/user'
import { useHelperStore } from '../../stores/helpers'
import ThePage from '../../components/common/ThePage.vue'
import TheCard from '../../components/common/TheCard.vue'
import ReviewContentComponent from '../../components/reviews_components/ReviewContentComponent.vue'
export default({
    components: {
        ThePage,
        TheCard,
        ReviewContentComponent,
    },
    setup() {
        const reviewsStore = useReviewsStore()
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        const allReviews = computed(() => reviewsStore.reviewList)
    
        return {
            allReviews,
            formatTimestamp: helperStore.timestampFormatter,
        }
    }
})
</script>
<style scoped>
#content{
    height: calc(100% - var(--header-height));
}
</style>