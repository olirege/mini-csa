<template>
    <ThePage>
        <template #content>
            <div class="content">
                <div class="menu">
                    <div v-for='(option,key,index) in options' :key="index" class="menu-item">
                        <p>{{key}}</p>
                        <div v-for="(item,itemIndex) in option" :key="itemIndex" class="option" @click="selectedOption = options[key][itemIndex]">
                            <p>{{item}}</p>
                        </div>  
                    </div>
                </div>
                <div class="work-panel">
                    <div class="panel"
                        v-if="selectedOption === 'Add Category'">
                        <AddCategory/>
                    </div>
                    <div class="panel"
                        v-if="selectedOption === 'Edit Category'">
                        <EditCategory/>
                    </div>
                    <div class="panel"
                        v-if="selectedOption === 'Edit Product'">
                        <EditProduct/>
                    </div>
                    <div class="panel"
                        v-if="selectedOption === 'Add Product'">
                        <AddProduct/>
                    </div>
                </div>
            </div>
        </template>
    </ThePage>
</template>
<script>
import {ref} from 'vue'   
import ThePage from '../../components/common/ThePage.vue'
import AddProduct from '../../views/employee/CRUD/AddProductView.vue'
import EditProduct from '../../views/employee/CRUD/EditProductView.vue'
import AddCategory from '../../views/employee/CRUD/AddCategoryView.vue'
import EditCategory from '../../views/employee/CRUD/EditCategoryView.vue'
export default ({
    components: {
        ThePage,
        AddProduct,
        EditProduct,
        AddCategory,
        EditCategory
    },
    setup() {
        const options = {
            "Category": [
                "Add Category", 
                "Edit Category", 
            ],
            "Product": [
                "Add Product", 
                "Edit Product",
            ]}
        const selectedOption = ref("Add Category")
        return {
            selectedOption,
            options,
        }
    },
})
</script>
<style scoped>
.content{
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
}
.menu{
    display: flex;
    position:absolute;
    top: 0;
    left: 0;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height:100%;
    width: 20%;
    background-color: #f1f1f1;
}
.menu-item{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-bottom: 1px solid #ccc;
    padding-left: 0.5rem;
}
.option {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
}
.option:hover {
    background-color: #ddd;
}
.option:last-child {
    border-bottom: none;
}
.work-panel{
    display: flex;
    flex-direction: column;
    width: 80%;
    height: auto;
    margin-left: 20%;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    padding: 1rem;
}
.panel{
    height: 100%;
}
</style>
