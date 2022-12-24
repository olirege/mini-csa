<template>
    <TheTable
    :data="ingredients"
    :columnsList="columns"
    :defaultFilter="'name'"
    :defaultSort="'name'"
    :hasTotal="true"
    :totalFields="['qty','cost']"
    @on-edit="(data)=>onEdit(data)"
     />
    <Teleport to="body">
        <EditIngredientModal
        :data = ingredient 
        v-if="showModal" @on-close="showModal = false"/>
    </Teleport>
</template>
<script>
import TheTable from '../../components/common/TheTable.vue'
import EditIngredientModal from '../../components/ingredients_components/EditIngredientModal.vue'
import { ref } from 'vue'
export default({
    components:{
        TheTable,
        EditIngredientModal,
    },
    props:{
        ingredients:{
            type: Object,
            required:true,
        },
    },
    setup() {
        const ingredient = ref({})
        const showModal = ref(false)
        const columns = [
            {name:'name', label:'Name'},
            {name:'qty', label:'Qty'},
            {name:'cost', label:'Cost'},
            {name:'unit', label:'Unit'},
        ]
        function onEdit(data){
            ingredient.value = data
            showModal.value = true
        }
        
        return {
            onEdit,
            ingredient,
            showModal,
            columns
        }
    },
})
</script>
