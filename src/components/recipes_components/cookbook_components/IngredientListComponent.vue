<template>
    <div class="col- w25 h100 border-right">
        <h5 class="border-bottom pd05">Ingredients</h5>
        <span v-if="selectedDraft.key && selectedItem" class="col- h100">
            <div class="row- center-space-between pd025"
            id="ingredient-row" 
            v-for="(ingredient,ingid,index) in ingredients" 
            :key="index"
            @mouseover="addToShowAddIngredient(index)"
            @mouseleave="removeFromShowAddIngredient()"
            >
                {{ingredient.name}}
                <i v-if='inShowAddIngredient(index)' class="bi bi-plus-circle" @click="addIngredientToDraft(ingid)"></i>
            </div>
        </span>
    </div>
</template>
<script>
import { ref } from 'vue'

export default({
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
        }
    },
    setup(props) {
        const showAddIngredient = ref([])
        function addToShowAddIngredient(index) {
            showAddIngredient.value[0] = index
        }
        function removeFromShowAddIngredient() {
            showAddIngredient.value = []
        }
        function inShowAddIngredient(index) {
            return showAddIngredient.value[0] == index
        }
        function addIngredientToDraft(ingid) {
            props.selectedDraft.data.ingredients.push({ingid:ingid,quantity:0,unit:props.ingredients[ingid].unit})
        }
        return{
            addToShowAddIngredient,
            removeFromShowAddIngredient,
            inShowAddIngredient,
            addIngredientToDraft
        }
    },
})
</script>
<style scoped>
#ingredient-row:hover{
    cursor:pointer;
    background-color: var(--color-border);
}
</style>
