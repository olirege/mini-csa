<template>
    <div class="col- h100 w25 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
            <i class="bi bi-journals"></i>
            <h3 class="">Drafts</h3>
        </span>
        <div v-if="selectedItem && selectedItem.item">
            <div class="col- oflow-y-auto h100">
                <div id="create-draft-row" class="row- gap025 pd025 border-bottom" @click="$emit('on-create-draft')">
                    <i class="bi bi-plus"></i>
                    <h5>Create a draft</h5>
                </div>
                <div v-if="drafts && !isLoading">
                    <div id='draft-row' class="row- center-space-between border-bottom pd05" 
                    v-for="(draft,key,index) in drafts" 
                    :key="index"
                    @click="$emit('on-select-draft',{key:key,data:draft})">
                        <h5>{{draft.name}}</h5>
                        <h5>{{draft.totalCost? formatNumber(draft.totalCost): formatNumber(0)}}</h5>
                    </div>
                </div>
                <div class="col- w100 h100" v-else-if="isLoading">
                    <Spinner />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Spinner from '../common/Spinner.vue'
import { useHelperStore } from '../../stores/helpers'
export default({
    emits: [
        'on-create-draft',
        'on-select-draft'
    ],
    props:{
        selectedItem:
        {
            type:Object,
            default:()=>{}
        },
        drafts:{
            type:Object,
            default:()=>{}
        },
        isLoading:{
            type:Boolean,
            default:false
        }
    },
    components:{
        Spinner
    },
    setup(){
        const helper = useHelperStore()
        return{
            formatNumber: helper.formatNumberToCurrency
        }
    }
})
</script>
<style scoped>
#create-draft-row{
    cursor:pointer;
    color: var(--vt-c-primary);
    font-weight: bolder;
    font-size: 1.2rem;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:flex-start;
}
#create-draft-row:hover{
    color: var(--vt-c-white);
    background-color: var(--color-border);
}
#create-draft-row i{
    font-size: 1.5rem;
}
#draft-row:hover{
    cursor:pointer;
    background-color: var(--color-border);
}
</style>