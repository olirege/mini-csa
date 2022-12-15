<template>
    <ThePage>
        <template #content>
            <div class='col- w100 h100' v-if="allReviews">
                <TheCard :hasImage="false" 
                :hasExtras="false" 
                :isHeightDynamic="true" 
                v-for="(reviews,item,index) in allReviews" :key="index">
                    <template #title>
                        <h3 class="pd1lft pd1top">{{item}}</h3>
                    </template>
                    <template #body>
                        <div class="col- h100 w100 pd1 gap1">
                            <ReviewCard v-for="(review,uid,index) in reviews" :key="index" :review="review" :uid="uid" @reply-sent="(reply) => {onSendAddReply($event,reply,item,uid)}"/>
                        </div>
                    </template>
                </TheCard>
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
import ReviewCard from '../../components/reviews_components/ReviewCard.vue'
export default({
    components: {
        ThePage,
        TheCard,
        ReviewCard
    },
    setup() {
        const reviewsStore = useReviewsStore()
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        reviewsStore.loadReviews();
        const allReviews = computed(() => reviewsStore.reviews)
        const replyText = reactive({
            from: userStore.user.uid,
            content: '',
        })
        function showReplyBox(e){
            if(e.target.parentNode.querySelector('.replybox').style.display === 'block'){
                return e.target.parentNode.querySelector('.replybox').style.display = 'none'
            }else{
                e.target.parentNode.querySelector('.replybox').style.display = 'block'
            }
        }
        function onSendAddReply(e,reply,iid,uid){
            const ids = {
                iid: iid,
                uid: uid
            }
            const unreactiveReply = {
                from: reply.from,
                content: reply.content,
                timestamp: Date.now()
            }
            reviewsStore.addReply(ids,reply)
            replyText.content = ''
            e.target.parentNode.style.display = 'none'

        }
        return {
            allReviews,
            showReplyBox,
            replyText,
            onSendAddReply,
            formatTimestamp: helperStore.timestampFormatter
        }
    }
})
</script>