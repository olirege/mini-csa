<template>
    <Teleport to="body">
        <AlertDropComponent :message="alertMessage" :code="alertCode" v-if="showAlert" @close-alert="showAlert = !showAlert"/>
    </Teleport>
    <span v-if="!hasReviewed" class="row- w100 gap05"> 
        <MessageInput   @message-sent="(message)=>{handleMessage(message)}" class="w100"/>
        <span class="nowrap flex center gap025 border-with-radius pdsides1" :class="{has_error: hasError}">
            <i :id="'rating_star_' + n" class="bi bi-star" v-for="n of 5" @mouseover="onStarOver" @click="onStar" :key="n"></i>
        </span>
    </span>
    <span v-else-if="hasReviewed" class="row- w100 gap05"> 
        <h5 class='review'>You've already reviewed this product.</h5>
    </span>
    <div class="reviews-wrapper" v-if="reviewsSelected">
        <ReviewCard 
        v-for="(review,uid,index) in reviewsSelected" 
        :key="index"
        :review="review"
        :uid="uid"
        :hasMsgBox="false">
        {{review}}</ReviewCard>
        <span class="row- w100 center">
            <i class="bi bi-chevron-left" @click="incrementPage(-2)"></i>
            <span class="row- w4rem nowrap gap05 center">
                <p>{{reviewsPageIndex > 0 ? reviewsPageIndex : 1 }}</p> /
                <p>{{reviewsPagesAmount}}</p> 
            </span>
            <i class="bi bi-chevron-right" @click="incrementPage(2)"></i>
        </span>
    </div>
    <div class="reviews-wrapper" v-else-if="!reviewsSelected">
        <h5 class='review'>No reviews for this product yet!</h5>
    </div>
</template>
<script>
import ReviewCard from '../reviews_components/ReviewCard.vue'
import MessageInput from '../reviews_components/MessageInput.vue'
import AlertDropComponent from '../common/AlertDropComponent.vue'
import { ref, computed } from 'vue'
import { useReviewsStore } from '../../stores/reviews'
import { useHelperStore } from '../../stores/helpers'

export default ({
    props:[
        'iid',
    ],
    components: {
        ReviewCard,
        MessageInput,
        AlertDropComponent
    },
    setup(props) {
        const reviewsStore = useReviewsStore()
        const helperStore = useHelperStore()
        const showAlert = ref(false)
        const alertMessage = ref('')
        const alertCode = ref(0)
        const colorCodes = helperStore.colorCodes
        reviewsStore.getItemReviews(props.iid)
        const reviews = computed(() => reviewsStore.itemReviews)
        const hasReviewed = computed(() => reviewsStore.hasUserReviewed())
        
        const reviewsPagesAmount = computed(()=>{
            if(reviews.value){
                return Math.round(Object.keys(reviews.value).length/2)
            }
            else{
                return 0
            }
        })
        
        const reviewsPageIndex = ref(0)
        
        function incrementPage(amount){
            if(reviewsPageIndex.value + amount >= 0 && reviewsPageIndex.value + amount <= reviewsPagesAmount.value){
                reviewsPageIndex.value += amount
            }
        }
        
        const reviewsSelected = computed(() => {
            if(!reviews.value){
                return null
            }
            let reviewsPerPage = 2
            if(reviewsPageIndex.value == reviewsPagesAmount.value - 1){
                reviewsPerPage = 1
            }
            const reviewsKeys = Object.keys(reviews.value).slice(reviewsPageIndex.value, reviewsPageIndex.value + reviewsPerPage)
            const returnReviews = {}
            reviewsKeys.forEach(key => {
                returnReviews[key] = reviews.value[key]
            })
            return returnReviews

        })
        
        const hasError = ref(false)
        
        async function handleMessage(message){
            if(rating.value == 0){
                hasError.value = true
                return
            }
            
            const data = {
                ...message,
                rating:rating.value
                }
            const resp = await reviewsStore.addReview(props.iid, data)
            if(resp){
                alertMessage.value = 'Review added!'
                alertCode.value = colorCodes.success
                showAlert.value = true
            }else{
                alertMessage.value = 'Something went wrong, try later!'
                alertCode.value = colorCodes.error
                showAlert.value = true
            }
            if(hasError){
                hasError.value = false
            }
            rating.value = 0 
        }
        
        const rating = ref(0)
        
        function onStarOver(e){
            const stars = e.target.parentElement.children
            const starIndex = Array.from(stars).indexOf(e.target)
            for(let i = 0; i < stars.length; i++){
                if(i <= starIndex){
                    stars[i].classList.remove('bi-star')
                    stars[i].classList.add('bi-star-fill')
                }
                else{
                    if(stars[i].classList.contains('bi-star-fill')){
                        stars[i].classList.remove('bi-star-fill')
                        stars[i].classList.add('bi-star')
                    }
                }
            }
            rating.value = starIndex + 1
        }
        function onStar(e){
            const stars = e.target.parentElement.children
            const starIndex = Array.from(stars).indexOf(e.target)
            if(starIndex == 0 && stars[0].classList.contains('bi-star-fill')){
                for(let i = 0; i < stars.length; i++){
                    stars[i].classList.remove('bi-star-fill')
                    stars[i].classList.add('bi-star')
                }
                rating.value = 0
            }
        }

        return{
            reviews,
            reviewsSelected,
            reviewsPageIndex,
            reviewsPagesAmount,
            incrementPage,
            handleMessage,
            onStarOver,
            onStar,
            rating,
            hasError,
            showAlert,
            alertMessage,
            alertCode,
            hasReviewed,
        }
    },
})
</script>
<style scoped>
i:hover{
    cursor: pointer;
    color: var(--vt-c-primary);
}
.has_error{
    border: 1px solid red;
}
.reviews-wrapper{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--vt-c-secondary-dark);
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid var(--color-border);
    width:100%;
}
</style>
