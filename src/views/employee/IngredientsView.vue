<template>
    <ThePage>
        <template #content v-if="ingredients">
            <div class="content w100 h100">
                <IngredientGrid :ingredients="ingredients"/>
                <div class="w100 h100">
                </div>
            </div>
        </template>
        <template #content v-else>
            <div class="content w100 h100 col- center">
                <Spinner/>
            </div>
        </template>
    </ThePage>    
</template>
<script>
import ThePage from '../../components/common/ThePage.vue'
import Spinner from '../../components/common/Spinner.vue'
import IngredientGrid from '../../components/ingredients_components/IngredientGrid.vue'
import {computed} from 'vue'
import {useIngredientStore} from '../../stores/ingredients'
export default({
    components:{
        ThePage,
        Spinner,
        IngredientGrid,
    },
    setup() {
        const ingredientStore = useIngredientStore()
        const ingredients = computed(()=> ingredientStore.ingredients)
        return {
            ingredients,
        }
    },
})
</script>
