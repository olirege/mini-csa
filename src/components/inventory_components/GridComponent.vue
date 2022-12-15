<template>
    <div class='content'>
        <div class="group">
            <div class="row headers">
                <span class="cell" id="group-name">
                    <i class="bi bi-chevron-down" @click="isCollapsed('all')"></i>
                    <h3>Categories</h3>
                </span>
                <h3 class="cell image">Image</h3>
                <h3 class="cell name header">Items</h3>
                <template v-for="(column,index) in columns" :key="index">
                    <h3 v-if="column.label != 'Categories' ||
                    column.label != 'Image' ||
                    column.label != 'Items'"  
                    class="cell">
                    {{column.label}}</h3>
                </template>
            </div>
        </div>
        <div v-if="(searchOutputValues.length == 0 && !isLoading)">
            <div class="group" v-for="(product, _, index) in sortedProducts" :key="product">
                <div class="row" :class="{'bg-blk-lgtr': index % 2 == 0, 'bg-wht': index % 2 != 0 }">
                    <div class="cell" id="group-name">
                        <i class="bi bi-chevron-down" @click="isCollapsed(product.name)"></i>
                        {{ product.name }}
                    </div>
                    <div class="cell" id="group-items" v-if="!inCollapsed(product.name)">
                        <div class="row" v-for="(item,index) in product.items" :key='index'>
                            <div class="cell image">
                                <img :src="item.images.smallRef" alt="item image">
                            </div>
                            <div class="cell name">
                                {{ item.name }}
                            </div>
                            <div class="cell ">
                                {{ item.bid ? item.bid : "000000" }}
                            </div>
                            <div class="cell">
                                {{ formatNumber(item.price) }}
                            </div>
                            <div class="cell" :class="{'bg-red':item.stock < item.min}">
                                {{ item.stock }}
                            </div>
                            <div class="cell">
                                {{ item.min ? item.min : 0 }}
                            </div>
                            <div class="cell">
                                {{ item.incart ? item.incart : 0 }}
                            </div>
                            <div class="cell">
                                {{ item.toscan ? item.toscan : 0 }}
                            </div>
                            <div class="cell">
                                {{ item.topickup ? item.topickup : 0 }}
                            </div>
                            <div class="cell">
                                {{ item.sold ? item.sold : 0 }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="(searchOutputValues.length > 0 && !isLoading)">
            <div class="row" v-for="(result,index) in searchOutputValues" :key="index">
                <div class="cell" id="group-name">{{productStore.products[result.pid].name}}</div>
                <div class="cell image">
                    <img :src="result.images.smallRef" alt="item image">
                </div>
                <div class="cell name">{{ result.name }}</div>
                <div class="cell">{{result.bid ? result.bid : "000000"}}</div>
                <div class="cell">{{formatNumber(result.price)}}</div>
                <div class="cell" :style="{backgroundColor: result.stock < result.min ? colors[1].dark : 'var(--color-background)'}">{{result.stock ? result.stock : 0}}</div>
                <div class="cell">{{result.min ? result.min : 0}}</div>
                <div class="cell">{{result.incart ? result.incart : 0}}</div>
                <div class="cell">{{result.toscan ?result.toscan : 0}}</div>
                <div class="cell">{{result.topickup ? result.topickup : 0}}</div>
                <div class="cell">{{result.sold ? result.sold : 0}}</div>
            </div>
        </div>
        <div v-else-if="isLoading">
            <div class="w100 h100 flex center">
                <Spinner/>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import { useProductStore } from '../../stores/products'
import { useHelperStore} from '../../stores/helpers'
import Spinner from '../common/Spinner.vue'
export default ({
    name: 'GridComponent',
    props: {
        columns: {
            type: Array,
            required: true,
        },
        isLoading: {
            type: Boolean,
            required: true,
        },
        searchOutputValues: {
            types: [Object,String],
            required: true,
        },
        sortedProducts: {
            type: Object,
            required: true,
        },
    },
    components: {
        Spinner,
    },
    setup() {
        const productStore = useProductStore()
        const helperStore = useHelperStore()
        const colors = helperStore.colors
        const collapsed = ref([])
        function isCollapsed(product) {
            if(product == 'all'){
                if(collapsed.value.includes('all')){
                    collapsed.value = []
                    return
                }
                const products = productStore.products
                for(let key in productStore.products){
                    if(!collapsed.value.includes(products[key].name)){
                        collapsed.value.push(products[key].name)
                    }
                }
                collapsed.value.push('all')
                return
            }
            if (collapsed.value.includes(product)) {
                collapsed.value.splice(collapsed.value.indexOf(product), 1)
            } else {
                collapsed.value.push(product)
            }
        }
        function inCollapsed(product) {
            return collapsed.value.includes(product)
        }
        return {
            isCollapsed,
            inCollapsed,
            collapsed,
            productStore,
            formatNumber: helperStore.formatNumberToCurrency,
            colors,

        }
    },
})
</script>
<style scoped>
.content {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    align-items: center;
}
.content >  div{
 width:100%;
}
.headers {
    border-bottom: 1px solid black;
}
.group{
    display: grid;
    grid-template-columns: auto;
}
.group.special {
    grid-template-columns: 1fr;
}
.cell{
    display: flex;
    flex-direction: column;
    min-width: 6rem;
    height: 100%;
    align-items: flex-end;
    justify-content: center;
    border-right: 1px solid var(--color-border);
    padding-right: 0.5rem;

}
.cell i{
    padding-left: 0.25rem;
}
.cell:last-child{
    border-right: none;
}
.cell.image{
    min-width: 65px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
}
.cell img {
    border-radius: 5px;
}
.cell.name{
    min-width: 9rem;
    font-size: 0.7rem;
    min-height: 1.5rem;
}
.cell.name.header{
    font-size: 1.2rem;
}
.row{
    display: flex;
    flex-direction: row;
    width: 100%;
}

#group-name{
    display: flex;
    flex-direction: row;
    width: 10rem;
    height: 100%;
    font-weight: bold;
    justify-content: space-between;
    align-items: center;
}
#group-id{
    flex-direction: row;
    justify-content: space-between;
}
#actions{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
}
#group-items{
    border: none;
}


</style>
