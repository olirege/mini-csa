<template>
    <div class="col- h100 w100 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
            <i class="bi bi-person-lines-fill"></i>
            <h3 >Item Reviews</h3>
        </span>
        <div class='h100 col- oflow-y-auto pd05'>
            <table v-if="reviewList">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Item</th>
                        <th>Review</th>
                        <th>Replied</th>
                        <th>Rating</th>
                        <th>Review Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                    v-for="(review,index) of reviewList" :key="index" :class="{'bg-gry-lgt': index % 2 == 0}"
                    @mouseover="onOverRow(index)"
                    @mouseleave="onLeaveRow()">
                        <td>{{ review.uid }}</td>
                        <td>{{storeItems[review.iid].name}}</td>
                        <td>{{formatString(review.content,0,40)}}</td>
                        <td><TheTag :text="hasReply(review)" :code="hasReply(review)? colors.success : colors.danger " /></td>
                        <td>
                            <i class="bi bi-star-fill" v-for="i of review.rating" :key="i"></i>
                        </td>
                        <td>{{formatTimestamp(review.timestamp)}}</td>
                        <td class="add-on" v-if="inAddonBox(index)" @click="onShowReview(review)">
                            <i class="bi bi-chat-left-text-fill"></i>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
    <ReplyModal v-if="showReplyBox" :review="selectedReview" @on-close="showReplyBox = false"/>
</template>
<script>
import {computed,ref,reactive} from 'vue'
import {useProductStore} from '../../stores/products'
import {useHelperStore} from '../../stores/helpers'
import TheTag from '../../components/common/TheTag.vue'
import ReplyModal from './ReplyModal.vue'
export default({
    components: {
        TheTag,
        ReplyModal,
    },
    props:{
        reviewList:{
            type:Array,
            default:()=>{}
        },
    },
    setup() {
        const productStore = useProductStore()
        const helperStore = useHelperStore()
        const showAddonBox = ref(false)
        const addonBox = ref([])
        const showReplyBox = ref(false)
        const onOverRow = (index) => {
            addonBox.value.push(index)
            showAddonBox.value = true
        }
        const onLeaveRow = () => {
            showAddonBox.value = false
            addonBox.value = []
        }
        const inAddonBox = (index) => {
            return addonBox.value.includes(index)
        }
        function onShowReview(review){
            showReplyBox.value = true
            Object.assign(selectedReview,review)
        }
        const selectedReview = reactive({})
        const colors = helperStore.colorCodes
        
        function hasReply(review){
            if(review.reply && review.reply.from){
                return true
            }else{
                return false
            }
        }
        
        const items = computed(() => {
            return productStore.items
        })
        return {
            hasReply,
            storeItems: items,
            formatString: helperStore.formatStringToSubstring,
            formatTimestamp: helperStore.timestampFormatter,
            colors,
            onOverRow,
            onLeaveRow,
            inAddonBox,
            showAddonBox,
            addonBox,
            showReplyBox,
            selectedReview,
            onShowReview,
        }
    },
})
</script>
<style scoped>
table {
        width: 100%;
        border-collapse: collapse;
        border-top: 1px solid var(--color-border);
        white-space: nowrap;
    }
    th, td {
        border-bottom: 1px solid var(--color-border);
        height:2.4rem;
        padding:0.2rem;
    }
    th {
        text-align: left;
    }
    tfoot td {
        font-weight: 450;
    }
    tbody{
        height:100%;
        overflow-y: auto;
    }
.add-on{
    position:absolute;
    right:0;
    top:0;
    width: 2.4rem;
    height: 2.4rem;
    background-color: var(--color-primary);
    border-radius: 50%;
    color: var(--color-white);
    text-align: center;
    line-height: 2.4rem;
    font-size: 1.2rem;
    cursor: pointer;
}
</style>
