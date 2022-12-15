<template>
    <TheCard
    :hasImage="false"
    :hasExtras="false" 
    :isHeightDynamic="true">
        <template #title>
            <div class="col- h100 w100 pdsides1 pd1top">
                <span class="row- center-space-between">
                    <h5>{{uid}}</h5>
                    <span>
                        <i class="bi bi-star-fill" v-for="n in review.rating" :key="n"></i>
                    </span>
                </span>
                <span class="row- border-bottom">
                        <h5>{{formatTimestamp(review.timestamp)}}</h5>
                </span>
            </div>
        </template>
        <template #body>
            <div class="col- h100 w100 pd075 gap05">
                <p class="pd1lft h1rem">{{review.content}}</p>
                <div class="row- bg-gry-lgt border-with-radius h1rem" id="reply" v-if="review.reply">
                    <span class="col- pd1lft">
                        <p>{{review.reply.from}}</p>
                        <p class="pd1lft">{{review.reply.content}}</p>
                    </span>
                </div>
                <!-- <div class="replybox">
                    <input class="w100 h2rem pd05 border-radius" v-model="replyText.content" placeholder="Write your reply here"/>
                    <i  class="bi bi-reply-fill" @click="$emit('reply-sent', replyText)"></i>
                </div> -->
                <MessageInput v-if="hasMsgBox" @message-sent="(message)=>{$emit('message-sent',message)}"/>
            </div>
        </template>
    </TheCard>
</template>
<script>
// import { reactive } from 'vue'
import { useHelperStore } from '../../stores/helpers'
import TheCard from '../common/TheCard.vue'
import MessageInput from './MessageInput.vue'

export default{
    name: 'ReviewCard',
    components: {
        TheCard,
        MessageInput
    },
    props: {
        hasMsgBox: {
            type: Boolean,
            required: true
        },
        review: {
            type: Object,
            required: true
        },
        uid: {
            type: String,
            required: true
        }
    },
    setup(){
        // const replyText = reactive({
        // })
        const helperStore = useHelperStore()
        return {
            // replyText,
            formatTimestamp: helperStore.timestampFormatter
        }
    }
}
</script>
<style scoped>
/* .replybox i{
    position:absolute;
    width: 2rem;
    background-color: var(--vt-c-primary);
    height: 2rem;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius: 0 5px 5px 50%;
    right:0;
    top:0;
    z-index: 99;
    color: var(--vt-c-white);
} */
#line{
    width: 1px;
    height: 100%;
    background-color: var(--vt-c-primary);
}
</style>