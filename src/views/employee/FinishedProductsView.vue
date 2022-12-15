<template>
    <ThePage :hasHeader="true">
        <template #header>
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
        </template>
        <!-- <template v-else #content>
            <Spinner></Spinner>
        </template> -->
    </ThePage>
</template>
<script>
import { useProductStore } from '../../stores/products'
import { useHelperStore } from '../../stores/helpers'
import {reactive, ref, computed} from 'vue'
import ThePage from '../../components/common/ThePage.vue'
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
    },
    setup() {
        const productStore = useProductStore()
        const helperStore = useHelperStore()
        const searchOutputValues = ref('')
        const isLoading = ref(false)
        const sortbyField = ref('')
        const columns = reactive([
            {name: 'bid', label: 'Bid', checked: true},
            {name: 'price', label: 'Price', checked: true},
            {name: 'stock', label: 'Stock', checked: true},
            {name: 'min', label: 'Min', checked: true},
            {name: 'incart', label: 'In Cart', checked: true},
            {name: 'toscan', label: 'To Scan', checked: true},
            {name: 'topickup', label: 'To Pickup', checked: true},
            {name: 'sold', label: 'Sold', checked: true},
        ])

        const sortedProducts = computed(() =>{
            const products = Object.assign({},productStore.products)
            for(let pid in products){
                const product = products[pid]
                if(!product.items) return {}
                const items = Object.entries(product.items)
                if(sortbyField && sortbyField.value.length > 0){
                    items.sort((a,b) =>{
                        return a[1][sortbyField.value] - b[1][sortbyField.value]
                    })
                }else{
                    items.sort((a,b) =>{
                        return a[1].bid - b[1].bid
                    })
                }
                product.items = Object.fromEntries(items)
            }
            return products
        })

        async function onSync(){
            if(isLoading.value) return
            isLoading.value = true
            await productStore.getProductTree()
            isLoading.value = false
        }
  
        return {
            productStore,
            searchOutputValues,
            columns,
            sortbyField,
            sortedProducts,
            isLoading,
            onSync,
            globalLoading: computed(() => helperStore.globalLoading)
        
        }
    },
})
</script>
