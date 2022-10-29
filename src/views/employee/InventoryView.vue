<template>
    <div class="page-wrapper">
        <h2>Inventory</h2>
        <div class="content-wrapper">
            <div class='content'>
                <div class="headers">
                    <h3>Product</h3>
                    <h3>Price</h3>
                    <h3>Quantity</h3>
                    <h3>Actions</h3>
                </div>
                <div class="group" v-for="product in productStore.products" :key="product">
                    <div class="cell" id="group-name" @click="collapse(product.name)">
                        {{ product.name }}
                    </div>
                    <div class="cell" id="group-items" :class="{collapsed:isCollapsed(product.name)}">
                        <div class="row" v-for="item in product.items" :key='item'>
                            <div class="cell" id="item-name">
                                {{ item.name }}
                            </div> 
                            <div class="cell">
                                {{ item.price }}
                            </div>
                            <div class="cell">
                                {{ item.stock }}
                            </div>
                            <div class="cell" id="actions">
                                <button @click="updateItem(item)">Update</button>
                                <button @click="deleteItem(item)">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import { useProductStore } from '../../stores/products'
import {reactive, computed} from 'vue'
export default ({
    setup() {
        const productStore = useProductStore()
        const collapsed = []
        productStore.getItems()
        const items = productStore.items
        const newProduct = reactive({
            name: '',
            price: '',
            description: '',
            image: ''
        })
        function updateProduct(product) {
            productStore.updateProduct(product)
        }
        function deleteProduct(product) {
            productStore.deleteProduct(product)
        }
        function collapse(product) {
            if (collapsed.includes(product)) {
                collapsed.splice(collapsed.indexOf(product), 1)
            } else {
                collapsed.push(product)
            }
        }
        function isCollapsed(product) {
            return collapsed.includes(product)
        }
        
        return {
            productStore,
            items,
            newProduct,
            updateProduct,
            deleteProduct,
            collapse,
            isCollapsed,
            
        }
    },
})
</script>
<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.content-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.headers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: 100%;
    justify-content: space-evenly;
}
.group{
    display: flex;
    flex-direction: column;
    width: 100%;
}
.cell{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
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
}
#actions{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
}
#item-name{
    padding-left:2rem;
}
.collapsed{
    display: none;
}
</style>
