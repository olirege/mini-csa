<template>
    <Teleport to="body">
        <AlertDropComponent :message="alertMessage" :code="alertCode" v-if="showAlert" @close-alert="showAlert = !showAlert"/>
    </Teleport>
    <TheModal @close-modal="$emit('on-close')" 
    :hasExtras="false" 
    :modalWidth="'30%'" 
    :code="2"
    :noBackdrop="true">
        <template #header v-if="review">
            <div class="row- gap1">
                <p>{{ formatTimestamp(review.timestamp) }}</p>
                <span class="row-">
                    <i v-for="n of review.rating" :key="n" class="bi bi-star-fill txt-ylw"></i>
                </span>
            </div>
        </template>
        <template #body v-if="review">
            <span class="w100 h100 gap1 col-">
                <div id="content_box" class="col- border-with-radius pd1 gap025">
                    <i class="bi bi-quote txt-lgr"></i>
                    <p>{{ review.content }}</p>
                    <i class="bi bi-quote flip-x"></i>
                </div>
                <div class="gap05 align-start col-" v-if="review.reply.from">
                    <span class="row- gap05 center">
                        <p>{{ capitalize(review.reply.from) }} - </p>
                        <p class="italic txt-sml">{{ formatTimestamp(review.reply.timestamp) }}</p>
                        <i class="bi bi-pen-fill" @click="editReply"></i>
                    </span>
                    <p class="pd1lft">{{ review.reply.content }}</p>
                </div>
                <MessageInput @message-sent="onReply"/>
            </span>
        </template>
        <template #body v-else>
            <div class="col- w100 h100 center">
                <Spinner/>
            </div>
        </template>
    </TheModal>
</template>
<script>
import TheModal from '../common/TheModal.vue'
import AlertDropComponent from '../common/AlertDropComponent.vue'
import ButtonComponent from '../common/ButtonComponent.vue'
import Spinner from '../common/Spinner.vue'
import MessageInput from './MessageInput.vue'
import { ref } from 'vue'
import { useHelperStore } from '../../stores/helpers'
import { useReviewsStore } from '../../stores/reviews'
import { useUserStore } from '../../stores/user'
export default({
    emits:['on-close'],
    components:{
        TheModal,
        AlertDropComponent,
        ButtonComponent,
        MessageInput,
        Spinner,
    },
    props:{
        review:{
            type:Object,
            default:()=>{}
        },
    },
    setup(props,ctx){
        const showAlert = ref(false)
        const alertMessage = ref('')
        const alertCode = ref(0)
        const helperStore = useHelperStore()
        const reviewsStore = useReviewsStore()
        const colors = helperStore.colorCodes

        async function onReply(reply){
            const uid = useUserStore().user.uid 
            const ids = {
                iid: props.review.iid,
                uid: props.review.uid
            }
            const unreactiveReply = {
                from: uid,
                content: reply.content,
                timestamp: new Date()
            }
            const resp = await reviewsStore.addReply(ids,unreactiveReply)
            if(resp){
                showAlert.value = true
                alertMessage.value = "Reply sent"
                alertCode.value = colors.success
                props.review.reply = unreactiveReply
                ctx.emit('on-close')
            }
            else{
                showAlert.value = true
                alertMessage.value = "Error sending reply, try again later."
                alertCode.value = colors.danger
            }

        }
        return {
            showAlert,
            alertMessage,
            alertCode,
            onReply,
            formatTimestamp: helperStore.timestampFormatter,
            capitalize: helperStore.capitalize,

        }

    }
})
</script>
<style scoped>
#content_box i{
    font-size: 1.5rem;
}
</style>