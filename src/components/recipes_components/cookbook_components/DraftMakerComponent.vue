<template>
    <div class="col- w75 h100">
        <h5 class="border-bottom pd05">Draft</h5>
        <span v-if="selectedDraft.key && selectedItem" class="col- h100 pd05">
            <div class="col- h100 gap05">
                <span class="row- center-space-between">
                    <span class="col- gap05 ">
                        <InputComponent
                        :elementId="'draftName'"
                        :placeholder="'Draft Name'"
                        :label="'Draft Name'"
                        :isRow="true"
                        :isWidth100="true"
                        :inputType="'text'"
                        :min="0"
                        :max="50"
                        :sanitize="true"
                        :toggleDisable="true"
                        :input="draftName"
                        v-model:output.capitalize="draftName"/>
                        <h5 class="italic">Last updated: {{formatTimestamp(selectedDraft.data.updated)}}</h5>
                    </span>
                    <span class="col- h100">
                        <button @click="$emit('on-save-draft')">Save</button>
                        <button @click="$emit('on-delete-draft')">Delete</button>
                    </span>
                </span>
                <DraftMakerTable
                :selectedDraft="selectedDraft"
                />
            </div>
        </span>
    </div>
</template>
<script>
import InputComponent from '../../common/InputComponent.vue';
import DraftMakerTable from './draftmaker_components/DraftMakerTable.vue'
import { useHelperStore } from '../../../stores/helpers'
export default({
    emits:[
        'on-save-draft',
        'on-delete-draft'
    ],
    components:{
        InputComponent,
        DraftMakerTable
    },
    props:{
        ingredients:{
            type:Object,
            default:()=>{}
        },
        selectedDraft:{
            type:Object,
            default:()=>{}
        },
        selectedItem:{
            type:Object,
            default:()=>{}
        },
        draftName:{
            type:String,
            default:''
        },
    },
    setup(){
        const helper = useHelperStore();
        return{
            formatTimestamp:helper.timestampFormatter,
        }
    }
})
</script>