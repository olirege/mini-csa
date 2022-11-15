<template>
    <div class='page-wrapper'>
    <div>
        <h2>Reviews</h2>
    </div>
        <div class='content' v-if="reviews">
            <div class="review-wrapper" v-for="(review,key,index) in reviews" :key="index">
                <div class="review-card">
                    <div>{{review.timestamp.toDate()}}</div>
                    <span>
                        <h5>{{review.from}}</h5>
                        <h5>{{review.iid}}</h5>
                    </span>
                    <p>{{review.content}}</p>
                    <div>{{review.rating}}</div>
                    <button @click="showReplyBox">Reply</button>
                    <div class="replybox">
                        <textarea v-model="replyText.content" placeholder="Write your review here"></textarea>
                        <button @click="onSendAddReply($event,key)">Send</button>
                    </div>
                </div>
                <div v-if="review.reply">
                    {{review.reply}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, computed } from 'vue'
import { useReviewsStore } from '../../stores/reviews'
import { useUserStore } from '../../stores/user'
export default({
    setup() {
        const reviewsStore = useReviewsStore()
        const userStore = useUserStore()
        reviewsStore.loadReviews();
        const reviews = computed(() => reviewsStore.reviews)
        const replyText = reactive({
            from: userStore.user.uid,
            content: '',
        })
        function showReplyBox(e){
            if(e.target.nextElementSibling.style.display == 'none'){
                e.target.nextElementSibling.style.display = 'block'
            }
            else{
                e.target.nextElementSibling.style.display = 'none'
            }
        }
        function onSendAddReply(e,rid){
            const ids = {
                rid: rid,
                iid: reviews.value[rid].iid,
                pid: reviews.value[rid].pid
            }
            const unreactiveReply = {
                from: replyText.from,
                content: replyText.content,
                timestamp: Date.now()
            }
            reviewsStore.addReply(ids,unreactiveReply)
            replyText.content = ''
            e.target.parentElement.style.display = 'none'
        }
        return {
            reviews,
            showReplyBox,
            replyText,
            onSendAddReply,
        }
    }
})
</script>
<style scoped>
    .page-wrapper {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        height: 100%;
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .review-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid black;
        margin: 10px;
        padding: 10px;
    }
    .review-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid black;
        border-radius: 5px;
        padding: 10px;
        margin: 10px;
    }
    .review-card > span{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    .replybox{
        display:none;
    }
</style>