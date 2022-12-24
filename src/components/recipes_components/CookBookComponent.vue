<template>
    <div class="col- h100 w50 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
            <i class="bi bi-journal-text"></i>
            <h3 >Cookbook</h3>
        </span>
        <div class='h100'>
            <div class="row- oflow-y-auto h100">
                <IngredientListComponent
                :ingredients="ingredients"
                :selectedDraft="selectedDraft"
                :selectedItem="selectedItem"/>
                <DraftMakerComponent
                :selectedDraft="selectedDraft"
                :selectedItem="selectedItem"
                :draftName="draftName"
                :ingredients="ingredients"
                @on-save-draft="$emit('on-save-draft')"
                @on-delete-draft="$emit('on-delete-draft')"

                />
            </div>
        </div>
    </div>
</template>
<script>
import IngredientListComponent from './cookbook_components/IngredientListComponent.vue'
import DraftMakerComponent from './cookbook_components/DraftMakerComponent.vue';
export default ({
    components:{
    IngredientListComponent,
    DraftMakerComponent,
    },
    emits:[
        'on-save-draft',
        'on-delete-draft',
    ],
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
})
</script>
