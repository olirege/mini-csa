<template>
    <ThePage>
        <!-- <template #header>
            <SearchComponent 
            @search="(searchOutput)=> searchOutputValues = searchOutput"
            @onsort="(sortField) => sortbyField = sortField"
            @onsync="onSync"
            :columns="columns"></SearchComponent>
        </template>
        <template #content>
            <GridComponent
            :columns="columns"
            :isLoading="isLoading"
            :searchOutputValues="searchOutputValues"
            :sortedProducts="sortedProducts"
            ></GridComponent>
        </template> -->
        <!-- <template v-else #content>
            <Spinner></Spinner>
        </template> -->
        <template #content>
            <TheTable
                :data="items"
                :defaultFilter="'name'"
                :defaultSort="'name'"
                :hasTotal="false"
                :columnsList="columns"
                @on-edit="(data)=>onEdit(data)"
                />
        </template>
    </ThePage>
</template>
<script>
import { useProductStore } from '../../stores/products'
import { useHelperStore } from '../../stores/helpers'
import {ref, computed} from 'vue'
import ThePage from '../../components/common/ThePage.vue'
import TheTable from '../../components/common/TheTable.vue'
import TheCard from '../../components/common/TheCard.vue'
import Spinner from '../../components/common/Spinner.vue'
import SearchComponent from '../../components/inventory_components/SearchComponent.vue'
import GridComponent from '../../components/inventory_components/GridComponent.vue'
export default ({
    components: {
        ThePage,
        TheCard,
        SearchComponent,
        GridComponent,
        Spinner,
        TheTable,
    },
    setup() {
        const productStore = useProductStore()
        const helperStore = useHelperStore()
        // const searchOutputValues = ref('')
        // const isLoading = ref(false)
        // const sortbyField = ref('')
        const columns = [
            {name:'images', callback: lookUpImage, html:true , label:'Image'},
            {name:'name', label:'Name'},
            {name:'pid', callback: lookUpProduct, label:'Category', searchBy: searchByCategoryName},
            {name:'bid', label:'ID'},
            {name:'price', callback: helperStore.formatNumberToCurrency, label:'Price'},
            {name:'stock', label:'Stock'},
            {name:'min', label:'Min'},
            {name:'incart', label:'In Cart'},
            {name:'toscan', label:'To Scan'},
            {name:'topickup', label:'To Pickup'},
            {name:'sold', label:'Sold'},
        ]

        function searchByCategoryName(searchInput, item){
            const category = productStore.products
            if(!category) return false
            for(let pid in category){
                const product = category[pid]
                if(product.name.toLowerCase().includes(searchInput.toLowerCase())){
                    return item[1].pid
                }
            }
        }
        function lookUpImage(images){
            if(!images) return ''
            const smallRef =  images.smallRef
            if(!smallRef) return ''
            const html = `<img src="${smallRef}" alt="image">`
            return html
        }

        function lookUpProduct(pid){
            const product = productStore.products[pid]
            if(!product) return {}
            return product.name
        }
        const items = computed(() => productStore.items)
        function onEdit(data){
            console.log(data)
        }
        // const sortedProducts = computed(() =>{
        //     const products = Object.assign({},productStore.products)
        //     for(let pid in products){
        //         const product = products[pid]
        //         if(!product.items) return {}
        //         const items = Object.entries(product.items)
        //         if(sortbyField && sortbyField.value.length > 0){
        //             items.sort((a,b) =>{
        //                 return a[1][sortbyField.value] - b[1][sortbyField.value]
        //             })
        //         }else{
        //             items.sort((a,b) =>{
        //                 return a[1].bid - b[1].bid
        //             })
        //         }
        //         product.items = Object.fromEntries(items)
        //     }
        //     return products
        // })

        // async function onSync(){
        //     if(isLoading.value) return
        //     isLoading.value = true
        //     await productStore.getProductTree()
        //     isLoading.value = false
        // }
  
        return {
            productStore,
            // searchOutputValues,
            columns,
            // sortbyField,
            // sortedProducts,
            // isLoading,
            // onSync,
            // globalLoading: computed(() => helperStore.globalLoading),
            //
            items,
            onEdit,
        
        }
    },
})
</script>
