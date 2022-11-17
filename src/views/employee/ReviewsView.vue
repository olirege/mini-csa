<template>
    <div class='page-wrapper'>
    <div>
        <h2>Reviews</h2>
    </div>
        <div class='content' v-if="allReviews">
            <div class="review-wrapper" v-for="(reviews,item,index) in allReviews" :key="index">
                <div class="review-card">
                    {{item}}
                    <div v-for="(review,uid,index) in reviews" :key="index">
                        <span>
                            <h5>{{uid}}</h5>
                            <h5>{{review.timestamp}}</h5>
                        </span>
                        <p>{{review.rating}}</p>
                        <p>{{review.content}}</p>
                        <button @click="showReplyBox">Reply</button>
                        <div class="replybox">
                            <textarea v-model="replyText.content" placeholder="Write your review here"></textarea>
                            <button @click="onSendAddReply($event,item,uid)">Send</button>
                        </div>
                        <div v-if="review.reply">
                            {{review.reply}}
                        </div>
                    </div>
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
        const allReviews = computed(() => reviewsStore.reviews)
        const replyText = reactive({
            from: userStore.user.uid,
            content: '',
        })
        function showReplyBox(e){
            e.target.parentNode.querySelector('.replybox').style.display = 'block'
        }
        function onSendAddReply(e,iid,uid){
            const ids = {
                iid: iid,
                uid: uid
            }
            const unreactiveReply = {
                from: replyText.from,
                content: replyText.content,
                timestamp: Date.now()
            }
            reviewsStore.addReply(ids,unreactiveReply)
            replyText.content = ''
            e.target.parentNode.style.display = 'none'

        }
        return {
            allReviews,
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