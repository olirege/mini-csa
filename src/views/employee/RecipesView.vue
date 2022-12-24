<template>
    <Teleport to="body">
        <AlertDropComponent :message="alertMessage" :code="alertCode" v-if="alertShow" @close-alert="alertShow = !alertShow"/>
    </Teleport>
    <ThePage>
        <template #content>
            <div id='content' class="w100 h100 row- gap1">
                <ItemListComponent :items="items" 
                @load-drafts="loadDrafts"
                :selectedItem="selectedItem"/>
                <DraftListComponent 
                :selectedItem="selectedItem" 
                :drafts="drafts" 
                :isLoading="isLoading"
                @on-create-draft="onCreateDraft" 
                @on-select-draft="onClickDraft"/>
                <CookBookComponent
                :selectedItem="selectedItem"
                :selectedDraft="selectedDraft"
                :ingredients="ingredients"
                :draftName="draftName"
                @on-save-draft="onSaveDraft"
                @on-delete-draft="onDeleteDraft"
                />
            </div>
        </template>
    </ThePage>
</template>
<script>
import ThePage from '../../components/common/ThePage.vue'
import Spinner from '../../components/common/Spinner.vue'
import AlertDropComponent from '../../components/common/AlertDropComponent.vue'
import ItemListComponent from '../../components/recipes_components/ItemListComponent.vue'
import DraftListComponent from '../../components/recipes_components/DraftListComponent.vue'
import CookBookComponent from '../../components/recipes_components/CookBookComponent.vue'
import InputComponent from '../../components/common/InputComponent.vue'
import { useRecipeStore } from '../../stores/recipes'
import { useHelperStore } from '../../stores/helpers'
import { useProductStore } from '../../stores/products'
import { useIngredientStore } from '../../stores/ingredients'
import {computed, ref, reactive} from 'vue'
export default({
    components: {
        ThePage,
        Spinner,
        AlertDropComponent,
        InputComponent,
        ItemListComponent,
        DraftListComponent,
        CookBookComponent,
    },
    setup() {
        const helperStore = useHelperStore()
        const colors = helperStore.colorCodes
        const alertShow = ref(false)
        const alertMessage = ref('')
        const alertCode = ref('')
        const productStore = useProductStore()
        const ingredientStore = useIngredientStore()
        const recipeStore = useRecipeStore()
        const isLoading = ref(false)
        const selectedItem = reactive({})
        const selectedDraft = reactive({})
        const draftName = ref('')
        const drafts = computed(() => {
            return recipeStore.drafts
        })
        async function loadDrafts(item) {
            Object.assign(selectedItem, item)
            isLoading.value = true
            await recipeStore.loadDrafts(item.key)
            isLoading.value = false
        }
        function onClickDraft(draft) {
            Object.assign(selectedDraft, draft)
            draftName.value = draft.data.name
        }
        const selectedRecipe = computed(() => {
            if(selectedItem) {
            const recipe = recipeStore.recipes[selectedItem.key]
                const sorted = Object.entries(recipe).slice().sort((a,b)=>{
                a = a[0];
                b = b[0];
                return ( a == b ? 0 : a > b ? 1: -1);
            })
            return Object.fromEntries(sorted)
            }
        })
        const recipes = computed(() => {
            return recipeStore.recipes
        })
        const items = computed(() => {
            return productStore.items
        })
        const ingredients = computed(() => {
            return ingredientStore.ingredients
        })
        async function onCreateDraft(){
            const did  = await recipeStore.createDraft(selectedItem.key)
            if(did){
                Object.assign(selectedDraft,drafts[did])
            }else{
                alertShow.value = true
                alertMessage.value = 'Error during draft creation'
                alertCode.value = colors.danger
            }
        }
        async function onSaveDraft() {
            if(draftName != selectedDraft.data.name){
                selectedDraft.data.name = draftName.value
            }
            selectedDraft.data.updated = helperStore.timestampFactory();
            const resp = await recipeStore.saveDraft(selectedItem.key,selectedDraft)
            if(resp) {
                alertShow.value = true
                alertMessage.value = 'Draft saved'
                alertCode.value = colors.success
            }else{
                alertShow.value = true
                alertMessage.value = 'Error saving draft'
                alertCode.value = colors.danger
            }
        }
        async function onDeleteDraft(){
            const resp = await recipeStore.deleteDraft(selectedItem.key,selectedDraft)
            if(resp) {
                alertShow.value = true
                alertMessage.value = 'Draft deleted'
                alertCode.value = colors.success
                Object.assign(selectedDraft, {})
            }else{
                alertShow.value = true
                alertMessage.value = 'Error deleting draft'
                alertCode.value = colors.danger
            }
        }
        return {
            isLoading,
            recipes,
            items,
            units: recipeStore.units,
            ingredients,
            selectedItem,
            selectedRecipe,
            loadDrafts,
            onClickDraft,
            drafts,
            onCreateDraft,
            selectedDraft,
            onSaveDraft,
            alertShow,
            alertMessage,
            alertCode,
            draftName,
            onDeleteDraft,
        }  
    },
})
</script>
<style scoped>
#content {
    height: calc(100% - var(--header-height));
}
</style>
