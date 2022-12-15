<template>
    <Teleport to="body">
        <AlertDropComponent :message="alertMessage" :code="alertCode" v-if="showAlert" @close-alert="showAlert = !showAlert"/>
    </Teleport>
    <CRUDEditor :mode="'add'"
        :object="'Category'"
        :icon="'bi bi-pen-fill'">
        <template #title>Add Category</template>
        <template #preview>
            <div class="w100 h100 pd1 flex center gap1">
                <div class="section-header">
                    <img v-if="sanitizedFormBuffer.image" class="section-image" alt='Image Preview' :src="sanitizedFormBuffer.image.preview"/>
                    <i class="bi bi-image section-image flex center" v-else></i>
                    <h2 class='section-title'>
                        {{sanitizedFormBuffer.name ? sanitizedFormBuffer.name : 'Category Name'}}
                    </h2>
                    <p class='section-subtitle'>
                        {{sanitizedFormBuffer.description ? sanitizedFormBuffer.description : 'Category Description'}}
                    </p>
                </div>
            </div>
        </template>
        <template #form>
            <InputFileComponent :elementId="'categoryImage'"
                :label="'Category Image'"
                :isRow="false"
                :isWidth100="true"
                :acceptType="'image/jpeg'"
                v-model:data="formBuffer.image"/>
            <InputComponent :elementId="'CategoryName'"
                :label="'Category Name'"
                :placeholder="'Enter Category name'"
                :isRow="false"
                :isWidth100="true"
                :inputType="'text'"
                :min="0"
                :max="50"
                :sanitize="true"
                :toggleDisable="false"
                :input="formBuffer.name"
                v-model:output.capitalize="formBuffer.name"/>
            <InputComponent :elementId="'categoryDescription'"
                :label="'Category Description'"
                :placeholder="'Enter Category Description'"
                :isRow="false"
                :isWidth100="true"
                :inputType="'text'"
                :min="0"
                :max="100"
                :sanitize="true"
                :toggleDisable="false"
                :input="formBuffer.description"
                v-model:output.capitalize="formBuffer.description"/>
        </template>
        <template #buttons>
            <ButtonComponent :classes="'w100 h2rem'" :text="'Create'" :code="7" :shade="'dark'" @click=onAction />
            <ButtonComponent :classes="'w100 h2rem'" :text="'Reset'" :code="1" :shade="'dark'" @click=onReset />
        </template>
    </CRUDEditor>
</template>
<script>
import {reactive, computed, ref} from 'vue'
import {useHelperStore} from '../../../stores/helpers'
import {useProductStore} from '../../../stores/products'
import CRUDEditor from '../../../components/crud_components/CRUDEditor.vue'
import InputComponent from '../../../components/common//InputComponent.vue'
import InputFileComponent from '../../../components/common//InputFileComponent.vue'
import ButtonComponent from '../../../components/common//ButtonComponent.vue'
import AlertDropComponent from '../../../components/common/AlertDropComponent.vue'
export default ({
    components: {
        CRUDEditor,
        InputComponent,
        InputFileComponent,
        ButtonComponent,
        AlertDropComponent,
    },
    setup() {
        const helperStore = useHelperStore()
        const productStore = useProductStore()
        const products = computed(() => productStore.products)
        const showAlert = ref(false)
        const alertMessage = ref('')
        const alertTypes = {success: 7, error: 1, warning:4}
        const alertCode = ref(0)
        const formBuffer = reactive({
        })
        const sanitizedFormBuffer = computed(() => {
            return helperStore.lazySanitizeObject(formBuffer)
        })

        function validateForm(){
            if(!sanitizedFormBuffer.value.name || !sanitizedFormBuffer.value.description || !sanitizedFormBuffer.value.image){
                //check which field is empty
                if(!sanitizedFormBuffer.value.name){
                    alertMessage.value = 'Category name is required'
                }else if(!sanitizedFormBuffer.value.description){
                    alertMessage.value = 'Category description is required'
                }else if(!sanitizedFormBuffer.value.image){
                    alertMessage.value = 'Category image is required'
                }
                alertCode.value = alertTypes.warning
                showAlert.value = true
                return false
            }
            //check if category name already exists
            else if(
                productStore.verifyItemByName(
                    sanitizedFormBuffer.value.name,
                )
            ){
                alertMessage.value = 'Category name already exists'
                alertCode.value = alertTypes.warning
                showAlert.value = true
                return false
            }else{
                return true   
            }
        }
        const onAction = async () => {
            if(validateForm()){
                const resp = await productStore.createProduct(sanitizedFormBuffer.value)
                if(resp){
                    alertMessage.value = 'Category Created! Add items to it in the Add Product section'
                    alertCode.value = alertTypes.success
                    showAlert.value = true
                    onReset()
                }
                else{
                    alertMessage.value = 'Category Creation Failed!'
                    alertCode.value = alertTypes.error
                    showAlert.value = true
                }
            }
        }
        const onReset = () => {
            Object.keys(formBuffer).forEach(key => {
                delete formBuffer[key]
            })            
        }

        return {
            formBuffer,
            sanitizedFormBuffer,
            onAction,
            onReset,
            formatNumber: helperStore.formatNumberToCurrency,
            formatString: helperStore.formatStringToSubstring,
            products,
            showAlert,
            alertMessage,
            alertCode,
        }
        
    },
})
</script>
<style scoped>
.section-title{
    font-size: 2rem;
    font-weight: 400;
    color: #333;
    padding: 0 1rem;
    height: 2.8rem;
}
.section-header{
    display:flex;
    flex-direction: column;
    width:100%;
}
.section-image{
    display:flex;
    height: 15rem;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
    color: var(--color-border);
    margin-bottom: 1rem;
    width:100%;
    overflow: hidden;
}
.section-subtitle{
    font-size: 1rem;
    font-weight: 350;
    font-style: italic;
    color: #333;
    padding: 0 1.5rem;
    margin-bottom: 0.5rem;
}
</style>
