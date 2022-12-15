<template>
    <Teleport to="body">
        <AlertDropComponent :message="alertMessage" :code="alertCode" v-if="showAlert" @close-alert="showAlert = !showAlert"/>
    </Teleport>
    <CRUDEditor :mode="'edit'"
        :object="'Category'"
        :icon="'bi bi-pen-fill'">
        <template #title>Edit Category</template>
        <template #preview>
            <div class="w100 h100 pd1 flex center gap1">
                <div class="section-header">
                    <img v-if="imageBuffer && imageBuffer.storeImage" class="section-image" alt='Image Preview' :src="imageBuffer.storeImage"/>
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
        <template #edit>
            <SelectComponent :elementId="'productCategory'"
                    :label="'Category'"
                    :isRow="false"
                    :isWidth100="true"
                    :field="'name'"
                    :options= "products"
                    :isObject="true"
                    :returnKeyVal="false"
                    v-model:choice="formBuffer.pid"
                    @change="loadItemToBuffer" />
        </template>
        <template #form>
            <InputFileComponent :elementId="'categoryImage'"
                :label="'Category Image'"
                :isRow="false"
                :isWidth100="true"
                :acceptType="'image/jpeg'"
                v-model:data="formBuffer.upload"/>
            <InputComponent :elementId="'CategoryName'"
                :label="'Category Name'"
                :placeholder="'Enter Category name'"
                :isRow="false"
                :isWidth100="true"
                :inputType="'text'"
                :min="0"
                :max="50"
                :sanitize="true"
                :input="formBuffer.name"
                :toggleDisable="true"
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
                :toggleDisable="true"
                :input="formBuffer.description"
                v-model:output.capitalize="formBuffer.description"/>
        </template>
        <template #buttons>
            <ButtonComponent :classes="'w100 h2rem'" :text="'Edit'" :code="7" :shade="'dark'" @click=onAction />
            <ButtonComponent :classes="'w100 h2rem'" :text="'Revert'" :code="3" :shade="'dark'" @click=onRevert />
            <ButtonComponent :classes="'w100 h2rem'" :text="'Delete'" :code="1" :shade="'dark'" @click="showModal = !showModal" />
        </template>
    </CRUDEditor>
    <Teleport to="body">
        <TheModal v-if="showModal && formBuffer.pid" @close-modal="showModal = !showModal" :code="alertTypes.error" :modalHeight="'auto'">
            <template #header>
                <h3>Are you sure?</h3>
            </template>
            <template #body>
                <p>Are you sure you want to delete {{formBuffer.name}}?</p>
                <br/>
                <p>There are {{products[formBuffer.pid].items.length > 0 ? products[formBuffer.pid].items.length : 'no '}} items in this category.</p>
                <br/>
                <p>This action is irreversable.</p>
            </template>
            <template #buttons>
                <div class="custom-modal-extras col- w100 h100 gap05">
                    <span class="w100 h100 col- gap025">
                        <p>Type "{{formBuffer.name}}" to delete the category</p>
                        <input v-model="deleteConfirmInput"/>
                    </span>
                    <span class="row-">
                        <ButtonComponent :classes="'w100 h2rem'" :text="'Delete'" :code="1" :shade="'dark'" @click="onDelete"/>
                        <ButtonComponent :classes="'w100 h2rem'" :text="'Cancel'" :code="0" :shade="'dark'" @click="showModal = !showModal" />
                    </span>
                </div>
            </template>
        </TheModal>
    </Teleport>
</template>
<script>
import {reactive, computed, ref, watch} from 'vue'
import {useHelperStore} from '../../../stores/helpers'
import {useProductStore} from '../../../stores/products'
import CRUDEditor from '../../../components/crud_components/CRUDEditor.vue'
import InputComponent from '../../../components/common/InputComponent.vue'
import InputFileComponent from '../../../components/common/InputFileComponent.vue'
import SelectComponent from '../../../components/common/SelectComponent.vue'
import ButtonComponent from '../../../components/common/ButtonComponent.vue'
import AlertDropComponent from '../../../components/common/AlertDropComponent.vue'
import TheModal from '../../../components/common/TheModal.vue'
export default ({
    components: {
        CRUDEditor,
        InputComponent,
        InputFileComponent,
        ButtonComponent,
        AlertDropComponent,
        SelectComponent,
        TheModal,
    },
    setup() {
        const helperStore = useHelperStore()
        const productStore = useProductStore()
        const products = computed(() => productStore.products)
        const showAlert = ref(false)
        const alertMessage = ref('')
        const alertTypes = {success: 7, error: 1, warning:4}
        const alertCode = ref(0)
        const showModal = ref(false)
        const deleteConfirmInput = ref('')
        const imageBuffer = reactive({
        })
        const formBuffer = reactive({
        })
        const sanitizedFormBuffer = computed(() => {
            return helperStore.lazySanitizeObject(formBuffer)
        })
       
        function loadItemToBuffer(e){
            if(e.target.value != '') {
                const product = products.value[formBuffer.pid]
                Object.assign(formBuffer, product)
            }
            if(formBuffer.upload){
                delete formBuffer.upload
                imageBuffer.storeImage = ''
            }
        }
        watch(formBuffer, (oldVal,newVal) => {
            if(formBuffer.storeImage && !formBuffer.upload) {
                imageBuffer.storeImage = formBuffer.storeImage;
            }
            else if(formBuffer.upload) {
                imageBuffer.storeImage = formBuffer.upload.preview;
            }
        })
        
        const onAction = async () => {
            let frozenBuffer = {...sanitizedFormBuffer.value}
            Object.freeze(frozenBuffer)
            const resp = await productStore.updateProduct(frozenBuffer)
            if(resp){
                alertMessage.value = 'Category updated! Continue with another category or close the editor'
                alertCode.value = alertTypes.success
                showAlert.value = true
            }
            else{
                alertMessage.value = 'Failed to update category!'
                alertCode.value = alertTypes.error
                showAlert.value = true
            }
        }
        const clearInputs = (exception = '') => {
            Object.keys(formBuffer).forEach(key => {
                if(key != exception) {
                    delete formBuffer[key]
                }
            })
            imageBuffer.storeImage = ''
        }
        const onRevert = () => {
            const product = products.value[formBuffer.pid]
            delete formBuffer.upload
            Object.assign(formBuffer, product)
        }
        const onDelete = async () => {
            if(deleteConfirmInput.value == formBuffer.name){
                const resp = await productStore.deleteProduct(formBuffer.pid)
                showModal.value = false
                if(resp) {
                    alertMessage.value = 'Category Deleted Successfully!'
                    alertCode.value = alertTypes.success
                    showAlert.value = true
                    clearInputs()
                }else{
                    alertMessage.value = 'Category Deletion Failed!'
                    alertCode.value = alertTypes.error
                    showAlert.value = true
                }
            }else{
                alertMessage.value = 'Category Deletion Failed! Input did not match category name'
                alertCode.value = alertTypes.error
                showAlert.value = true
            }    
            
        }

        return {
            formBuffer,
            sanitizedFormBuffer,
            onAction,
            onRevert,
            onDelete,
            formatNumber: helperStore.formatNumberToCurrency,
            formatString: helperStore.formatStringToSubstring,
            products,
            showAlert,
            alertMessage,
            alertCode,
            alertTypes,
            loadItemToBuffer,
            imageBuffer,
            showModal,
            deleteConfirmInput,
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
