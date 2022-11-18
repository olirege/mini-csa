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
                            <select key="select" v-model="selectedSid">
                                <option v-for="(item,key,index) in supplierStore.suppliers" :key="index" :value="key">
                                    {{ item.name }}
                                </option>
                            </select>
                            <input type="file" accept="image/jpeg" @change="onUploadImage($event,newItem)"/>
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
                            <select key="select" v-model="selectedSid">
                                <option v-for="(item,key,index) in supplierStore.suppliers" :key="index" :value="key">
                                    {{ item.name }}
                                </option>
                            </select>
                            <input type="file" @change="onUploadImage($event,updateItem)"/>
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
import { useSuppliersStore } from '../../stores/suppliers'
import {ref, reactive} from 'vue'   
export default ({
    setup() {
        const productStore = useProductStore()
        const supplierStore = useSuppliersStore()
        const selectedIid = ref(0)
        const selectedPid = ref(0)
        const selectedSid = ref(0)

        const newProduct = reactive({
            name: '',
            description: '',
        })

        const newItem = reactive({
            name: '',
            price: '',
            stock: '',
            description: '',
            image: '',
            supplier: {
                sid: selectedSid,
                name: selectedSid && supplierStore.suppliers[selectedSid] ? supplierStore.suppliers[selectedSid].name : '',
            },
            pid: selectedPid,
        })
        const updateItem = reactive({
            name: '',
            price: '',
            image: '',
            description: '',
            pid: selectedPid,
            supplier: {
                sid: selectedSid,
                name: selectedSid && supplierStore.suppliers[selectedSid] ? supplierStore.suppliers[selectedSid].name : '',
            },
        })
        const updateProduct = reactive({
            name: '',
            description: '',
        })
 
        function resetObjectFields(obj){
            for (const key in obj) {
                obj[key] = ''
            }
        }
        function resetIdsFields(){
            selectedIid.value = 0
            selectedPid.value = 0
            selectedSid.value = 0
        }
        function onCreateItem(){
            if (selectedPid && Object.values(newItem).every((value) => value !== '')) {
                const unReactiveObj =  {...newItem}
                productStore.createItem(unReactiveObj )
            }
            resetObjectFields(newItem)
        }
        function onCreateProduct(){
            if (Object.values(newProduct).every((value) => value !== '')) {
                const unReactiveObj =  {...newProduct}
                productStore.createProduct(unReactiveObj)
            }
            resetObjectFields(newProduct)
        }
        function onUpdateItem(){
            if (selectedPid && selectedIid) {
                const unReactiveObj =  {}
                Object.assign(unReactiveObj, updateItem)
                for (const key in unReactiveObj) {
                    if (unReactiveObj[key] === '') {
                        delete unReactiveObj[key]
                    }
                }
                productStore.updateItem(selectedIid.value, unReactiveObj)
            }
            resetObjectFields(updateItem)
            resetIdsFields()
        }
        function onUpdateProduct(){
            if (selectedPid && selectedIid) {
                const unReactiveObj =  {}
                Object.assign(unReactiveObj, updateProduct)
                for (const key in unReactiveObj) {
                    if (unReactiveObj[key] === '') {
                        delete unReactiveObj[key]
                    }
                }
                productStore.updateProduct(selectedPid.value, unReactiveObj)
            }
            resetObjectFields(updateProduct)
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
        function onUploadImage(e,obj){
            const file = e.target.files[0]
            obj.image = file
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
            supplierStore,
            selectedSid,
            onUploadImage,
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
