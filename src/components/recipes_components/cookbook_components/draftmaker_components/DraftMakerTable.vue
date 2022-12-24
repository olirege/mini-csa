<template>
    <table>
        <thead>
            <tr>
                <th v-for="(column,index) in columns" :key="index">{{column}}</th>
            </tr>
        </thead>
        <tbody v-if="selectedDraft.data.ingredients.length > 0">
            <tr v-for="(data,index) in selectedDraft.data.ingredients" :key="index">
                <td>
                    {{ingredients[data.ingid].name}}
                </td>
                <td>
                    <select v-model="data.unit">
                        <option v-for="unit in units" :key="unit">{{unit}}</option>
                    </select>
                </td>
                <td class="qty-column">
                    <input type="number" v-model="data.quantity">
                </td>
                <td>
                    {{formatNumber(calculateCost(data))}}
                </td>
                <td>
                    <i class="bi bi-x-circle" @click="selectedDraft.data.ingredients.splice(index,1)"></i>
                </td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                No ingredients added
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">
                    Total Cost:
                </td>
                <td colspan="2">
                    {{formatNumber(totalCost)}}
                </td>
            </tr>
        </tfoot>
    </table>
</template>
<script>
import { useHelperStore } from '../../../../stores/helpers'
import { computed } from 'vue'
import { useIngredientStore } from '../../../../stores/ingredients'
import { useRecipeStore } from '../../../../stores/recipes'

export default({
    props:{
        selectedDraft:{
            type:Object,
            default:()=>[]
        },
    },
    setup(props){
        const helperStore = useHelperStore()
        const recipeStore = useRecipeStore()
        const ingredientStore = useIngredientStore()
        const ingredients = computed(() => ingredientStore.ingredients)
        const mlConvertionTable = ingredientStore.mlConvertionTable
        const gramsConvertionTable = ingredientStore.gramsConvertionTable
        const columns = ['Ingredient','Unit','Quantity','Cost', '']
        const totalCost = computed(() => {
            let total = 0
            if(props.selectedDraft && props.selectedDraft.data && props.selectedDraft.data.ingredients) {
                props.selectedDraft.data.ingredients.forEach(data => {
                    total += data.cost
                })
            }
            props.selectedDraft.data.totalCost = total
            return total
        })
        function calculateCost(data){
            const ingredient = ingredients.value[data.ingid]
            const quantity = data.quantity
            const unit = data.unit
            if(ingredient.unit == unit) {
                const cost =  quantity * ingredient.costPerUnit
                data.cost = cost
                return cost

            }else if(Object.keys(mlConvertionTable).includes(unit) && Object.keys(gramsConvertionTable).includes(ingredient.unit)) {
                const cost = quantity * mlConvertionTable[unit] * ingredient.density * ingredient.costPerUnit/gramsConvertionTable[ingredient.unit]
                data.cost = cost
                return cost
            }else if(Object.keys(gramsConvertionTable).includes(unit) && Object.keys(mlConvertionTable).includes(ingredient.unit)) {
                const cost = quantity * gramsConvertionTable[unit] / ingredient.density * ingredient.costPerUnit/mlConvertionTable[ingredient.unit]
                data.cost = cost
                return cost

            }else if(Object.keys(gramsConvertionTable).includes(unit) && Object.keys(gramsConvertionTable).includes(ingredient.unit)) {
                const cost =  quantity * ingredient.costPerUnit / gramsConvertionTable[ingredient.unit]
                data.cost = cost
                return cost

            }else if(Object.keys(mlConvertionTable).includes(unit) && Object.keys(mlConvertionTable).includes(ingredient.unit)) {
                const cost = quantity * ingredient.costPerUnit / mlConvertionTable[ingredient.unit]
                data.cost = cost
                return cost
            }
        }
        return{
            calculateCost,
            totalCost,
            formatNumber: helperStore.formatNumberToCurrency,
            units: recipeStore.units,
            columns,
            ingredients
          
        }
    }
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
        padding: 5px;
    }
    th {
        text-align: left;
        padding: 1rem 5px;
    }
    tfoot td {
        font-weight: 450;
        padding: 1rem 5px;
        width:100%;
    }
    .qty-column {
        width: 100px;
    }
</style>
