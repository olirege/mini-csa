<template>
    <div>
        <h2>CRUD Products</h2>
        <div class="content-wrapper">
            <div class="content">
                <div class="option" @click="createItem">
                    <h3>Create Item</h3>
                    <div class="create-Item-form">
                        <div>
                            <select key="select" v-model="product">
                                <option v-for="product in productStore.products" :key="product" :value="product">
                                    {{ product.name }}
                                </option>
                            </select>
                            <input type="text" id="name" v-model="newProduct.name" placeholder="Choose a name">
                            <input type="number" id="price" v-model="newProduct.price" placeholder="Pick a price">
                            <input type="text" id="description" v-model="newProduct.description" placeholder="Write a description">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useProductStore } from '../../stores/products'
import {reactive} from 'vue'   
export default ({
    setup() {
        const productStore = useProductStore()
        const newProduct = reactive({
            name: '',
            price: '',
            description: '',
            image: ''
        })
        return {
            productStore,
            newProduct
        }
    },
})
</script>
