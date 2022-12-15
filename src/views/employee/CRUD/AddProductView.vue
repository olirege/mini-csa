<template>
    <Teleport to="body">
        <AlertDropComponent :message="alertMessage" :code="alertCode" v-if="showAlert" @close-alert="showAlert = !showAlert"/>
    </Teleport>
    <CRUDEditor :mode="'add'"
        :object="'Product'"
        :icon="'bi bi-pen-fill'">
        <template #title>Add Products</template>
        <template #preview>
        <div class="w100 h100 pd1 flex center gap1">
            <TheStoreCard
                :image="sanitizedFormBuffer.image ? sanitizedFormBuffer.image.preview : ''"
                :productName="sanitizedFormBuffer.name ? sanitizedFormBuffer.name : 'Product Name'"
                :productSupplier="sanitizedFormBuffer.supplier ? suppliers[sanitizedFormBuffer.supplier.sid].name : 'Product Supplier'"
                :productBlurb="sanitizedFormBuffer.blurb ? sanitizedFormBuffer.blurb : 'Product Blurb'"
                :productdescription="sanitizedFormBuffer.description ? sanitizedFormBuffer.description : 'Product Description'"
                :productPrice="sanitizedFormBuffer.price ? sanitizedFormBuffer.price : 99.99"
                :productUnit="sanitizedFormBuffer.unit ? sanitizedFormBuffer.unit : 'ea'"
            />
            <TheCartCard
                :image="sanitizedFormBuffer.image ? sanitizedFormBuffer.image.preview : ''"
                :productName="sanitizedFormBuffer.name ? sanitizedFormBuffer.name : 'Product Name'"
                :productPrice="sanitizedFormBuffer.price ? sanitizedFormBuffer.price : 99.99"
                :productUnit="sanitizedFormBuffer.unit ? sanitizedFormBuffer.unit : 'ea'"
                :productQty="sanitizedFormBuffer.qty ? sanitizedFormBuffer.qty : 99"
            />
        </div>
        </template>
        <template #form>
            <SelectComponent :elementId="'productCategory'"
                :label="'Category'"
                :isRow="false"
                :isWidth100="true"
                :field="'name'"
                :options= "products"
                :isObject="true"
                :returnKeyVal="false"
                v-model:choice="formBuffer.pid"/>
            <InputFileComponent :elementId="'productImage'"
                :label="'Product Image'"
                :isRow="false"
                :isWidth100="true"
                :acceptType="'image/jpeg'"
                v-model:data="formBuffer.image"/>
            <span class="row- w100 gap1">
                <InputComponent :elementId="'productName'"
                    :label="'Product Name'"
                    :placeholder="'Enter Product name'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'text'"
                    :min="0"
                    :max="50"
                    :sanitize="true"
                    :input="formBuffer.name"
                    v-model:output.capitalize="formBuffer.name"/>
                <InputComponent :elementId="'productBid'"
                    :label="'Product ID'"
                    :placeholder="'100000'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="100000"
                    :max="999999"
                    :sanitize="true"
                    :input="formBuffer.bid"
                    v-model:output="formBuffer.bid"/>
            </span>
            <InputComponent :elementId="'productDescription'"
                    :label="'Product Description'"
                    :placeholder="'Enter Product Description'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'text'"
                    :min="0"
                    :max="100"
                    :sanitize="true"
                    :input="formBuffer.description"
                    v-model:output.capitalize="formBuffer.description"/>
            <InputComponent :elementId="'productBlurb'"
                    :label="'Product Blurb'"
                    :placeholder="'Enter Product Blurb'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'text'"
                    :min="0"
                    :max="50"
                    :sanitize="true"
                    :input="formBuffer.blurb"
                    v-model:output.capitalize="formBuffer.blurb"/>
            <SelectComponent :elementId="'productSupplier'"
                :label="'Supplier'"
                :isRow="true"
                :isWidth100="true"
                :field="'name'"
                :options= "suppliers"
                :isObject="true"
                :returnKeyVal="false"
                v-model:choice="formBuffer.sid"/>
            <span class="row- w100 gap1">
                <InputComponent :elementId="'productStock'"
                    :label="'Current Stock Level'"
                    :placeholder="'0'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="0"
                    :max="999"
                    :sanitize="true"
                    :input="formBuffer.stock"
                    v-model:output="formBuffer.stock"/>
                <InputComponent :elementId="'productMin'"
                    :label="'Minium Stock Level'"
                    :placeholder="'0'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="0"
                    :max="999"
                    :sanitize="true"
                    :input="formBuffer.min"
                    v-model:output="formBuffer.min"/>
                <InputComponent :elementId="'productQuota'"
                    :label="'Product Quota'"
                    :placeholder="'0'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="0"
                    :max="999"
                    :sanitize="true"
                    :input="formBuffer.quota"
                    v-model:output="formBuffer.quota"/>
            </span>
            <span class="row- w100 gap1">
                <InputComponent :elementId="'productPrice'"
                    :label="'Product Price'"
                    :placeholder="'0.00'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="0"
                    :max="999"
                    :step="0.01"
                    :sanitize="true"
                    :input="formBuffer.price"
                    v-model:output="formBuffer.price"/>
                <SelectComponent :elementId="'productUnit'"
                    :label="'Unit'"
                    :isRow="true"
                    :isWidth100="true"
                    :options= "['ea', 'kg', 'g', 'lb', 'oz', 'ml', 'l']"
                    :isObject="false"
                    :returnKeyVal="false"
                    v-model:choice="formBuffer.unit"/>
            </span>
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
import {useSuppliersStore} from '../../../stores/suppliers'
import CRUDEditor from '../../../components/crud_components/CRUDEditor.vue'
import SelectComponent from '../../../components/common//SelectComponent.vue'
import InputComponent from '../../../components/common//InputComponent.vue'
import InputFileComponent from '../../../components/common//InputFileComponent.vue'
import ButtonComponent from '../../../components/common//ButtonComponent.vue'
import AlertDropComponent from '../../../components/common/AlertDropComponent.vue'
import TheStoreCard from '../../../components/crud_components/CRUDStoreCard.vue'
import TheCartCard from '../../../components/crud_components/CRUDCartCard.vue'
export default ({
    components: {
        CRUDEditor,
        SelectComponent,
        InputComponent,
        InputFileComponent,
        ButtonComponent,
        AlertDropComponent,
        TheStoreCard,
        TheCartCard
    },
    setup() {
        const helperStore = useHelperStore()
        const productStore = useProductStore()
        const products = computed(() => productStore.products)
        const supplierStore = useSuppliersStore()
        const suppliers = supplierStore.suppliers
        const showAlert = ref(false)
        const alertMessage = ref('')
        const alertTypes = {success: 'success', error: 'error', warning:'warning'}
        const alertCode = ref(0)
        const formBuffer = reactive({
        })
        const sanitizedFormBuffer = computed(() => {
            // reformatting data for display
            if(formBuffer.sid) {
                formBuffer.supplier = {}
                formBuffer.supplier.sid = formBuffer.sid
                formBuffer.supplier.name = suppliers[formBuffer.supplier.sid].name
                formBuffer.sid = ''
            }
            return helperStore.lazySanitizeObject(formBuffer)
        })
        const onAction = () => {
            productStore.createItem(sanitizedFormBuffer.value)
            alertMessage.value = 'Product Created'
            alertCode.value = alertTypes.success
            showAlert.value = true
            onReset()
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
            suppliers,
            showAlert,
            alertMessage,
            alertCode,
        }
        
    },
})
</script>