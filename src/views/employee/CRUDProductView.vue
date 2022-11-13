<template>
    <div>
        <h2>CRUD Products</h2>
        <div class="content-wrapper">
            <div class="content">
                <div class='option'>
                    <h3>Create Product</h3>
                    <div class="item-form">
                        <input type="text" id="name" v-model="newProduct.name" placeholder="Choose a name">
                        <input type="text" id="description" v-model="newProduct.description" placeholder="Write a description">
                        <button @click="onCreateProduct">Create Product</button>
                    </div>
                </div>
                <div class="option">
                    <h3>Create Item</h3>
                    <div class="item-form">
                        <div>
                            <select key="select" v-model="selectedPid">
                                <option v-for="(product,key,index) in productStore.products" :key="index" :value="key">
                                    {{ product.name }}
                                </option>
                            </select>
                            <input type="text" id="name" v-model="newItem.name" placeholder="Choose a name">
                            <input type="number" id="price" v-model="newItem.price" placeholder="Pick a price">
                            <input type="text" id="description" v-model="newItem.description" placeholder="Write a description">
                            <input type="number" id="stock" v-model="newItem.stock" placeholder="Enter Stock Level">
                        </div>
                        <button @click="onCreateItem">Create Item</button>
                    </div>
                </div>
                <div class='option'>
                    <h3>Update Product</h3>
                    <div class="item-form">
                        <div>
                            <select key="select" v-model="selectedPid">
                                <option v-for="(product,key,index) in productStore.products" :key="index" :value="key">
                                    {{ product.name }}
                                </option>
                            </select>
                            <input type="text" id="name" v-model="updateProduct.name" placeholder="Choose a name">
                            <input type="text" id="description" v-model="updateProduct.description" placeholder="Write a description">
                        </div>
                        <button @click="onUpdateProduct">Update Product</button>
                    </div>
                </div>
                <div class="option">
                    <h3>Update Item</h3>
                    <div class="item-form">
                        <div>
                            <select key="select" v-model="selectedPid">
                                <option v-for="(product,key,index) in productStore.products" :key="index" :value="key">
                                    {{ product.name }}
                                </option>
                            </select>
                            <select key="select" v-model="selectedIid" v-if="selectedPid">
                                <option v-for="(item,key,index) in productStore.products[selectedPid].items" :key="index" :value="key">
                                    {{ item.name }}
                                </option>
                            </select>
                            <input type="text" id="name" v-model="updateItem.name" placeholder="Choose a name">
                            <input type="number" id="price" v-model="updateItem.price" placeholder="Pick a price">
          
                            <input type="text" id="description" v-model="updateItem.description" placeholder="Write a description">
                        </div>
                        <button @click="onUpdateItem">Update Item</button>
                    </div>
                </div>
                <div class='option'>
                    <h3>Delete Product</h3>
                    <div class="item-form">
                        <div>
                            <select key="select" v-model="selectedPid">
                                <option v-for="(product,key,index) in productStore.products" :key="index" :value="key">
                                    {{ product.name }}
                                </option>
                            </select>
                        </div>
                        <button @click="onDeleteProduct">Delete Product</button>
                    </div>
                </div>
                <div class="option">
                    <h3>Delete Item</h3>
                    <div class="item-form">
                        <div>
                            <select key="select" v-model="selectedPid">
                                <option v-for="(product,key,index) in productStore.products" :key="index" :value="key">
                                    {{ product.name }}
                                </option>
                            </select>
                            <select key="select" v-model="selectedIid" v-if="selectedPid">
                                <option v-for="(item,key,index) in productStore.products[selectedPid].items" :key="index" :value="key">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                        <button @click="onDeleteItem">Delete Item</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useProductStore } from '../../stores/products'
import {ref, reactive} from 'vue'   
export default ({
    setup() {
        const productStore = useProductStore()
        const selectedIid = ref(0)

        const newProduct = reactive({
            name: '',
            description: '',
        })

        const newItem = reactive({
            name: '',
            price: '',
            stock: '',
            description: '',
        })
        const updateItem = reactive({
            name: '',
            price: '',
            description: '',
        })
        const updateProduct = reactive({
            name: '',
            description: '',
        })
        const selectedPid = ref('')
        function onCreateItem(){
            if (selectedPid && Object.values(newItem).every((value) => value !== '')) {
                productStore.createItem(selectedPid.value, newItem)
            }
        }
        function onCreateProduct(){
            if (Object.values(newProduct).every((value) => value !== '')) {
                productStore.createProduct(newProduct)
            }
        }
        function onUpdateItem(){
            if (selectedPid && selectedIid && Object.values(updateItem).every((value) => value !== '')) {
                productStore.updateItem(selectedPid.value, selectedIid.value, updateItem)
            }
        }
        function onUpdateProduct(){
            if (selectedPid && Object.values(updateProduct).every((value) => value !== '')) {
                productStore.updateProduct(selectedPid.value, updateProduct)
            }
        }
        function onDeleteProduct(){
            if (selectedPid) {
                productStore.deleteProduct(selectedPid.value)
            }
        }
        function onDeleteItem(){
            if (selectedPid && selectedIid) {
                productStore.deleteItem(selectedPid.value, selectedIid.value)
            }
        }
        return {
            productStore,
            newItem,
            onCreateItem,
            selectedPid,
            selectedIid,
            newProduct,
            onCreateProduct,
            updateItem,
            onUpdateItem,
            updateProduct,
            onUpdateProduct,
            onDeleteProduct,
            onDeleteItem,
        }
    },
})
</script>
<style scope>
.item-form{
    display:flex;
    flex-direction: row;
}
</style>
