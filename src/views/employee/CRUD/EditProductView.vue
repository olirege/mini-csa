<template>
    <Teleport to="body">
        <AlertDropComponent :message="alertMessage" :code="alertCode" v-if="showAlert" @close-alert="showAlert = !showAlert"/>
    </Teleport>
    <CRUDEditor :mode="'edit'"
        :object="'Product'"
        :icon="'bi bi-pen-fill'">
        <template #title>Edit Products</template>
        <template #preview>
        <div class="w100 h100 pd1 flex center gap1">
            <!-- :image="sanitizedFormBuffer.images ? sanitizedFormBuffer.images.bigRef : ''" -->
            <TheStoreCard
                :image="imageBuffer && imageBuffer.storeCard ? imageBuffer.storeCard : ''"
                :productName="sanitizedFormBuffer.name ? sanitizedFormBuffer.name : 'Product Name'"
                :productSupplier="sanitizedFormBuffer.supplier && sanitizedFormBuffer.supplier.sid && suppliers[sanitizedFormBuffer.supplier.sid] ? suppliers[sanitizedFormBuffer.supplier.sid].name : 'Product Supplier'"
                :productBlurb="sanitizedFormBuffer.blurb ? sanitizedFormBuffer.blurb : 'Product Blurb'"
                :productdescription="sanitizedFormBuffer.description ? sanitizedFormBuffer.description : 'Product Description'"
                :productPrice="sanitizedFormBuffer.price ? sanitizedFormBuffer.price : 99.99"
                :productUnit="sanitizedFormBuffer.unit ? sanitizedFormBuffer.unit : 'ea'"
            />
            <!-- :image="sanitizedFormBuffer.images ? sanitizedFormBuffer.images.thumbnailRef : ''" -->
            <TheCartCard
                :image="imageBuffer && imageBuffer.cartCard ? imageBuffer.cartCard : ''"
                :productName="sanitizedFormBuffer.name ? sanitizedFormBuffer.name : 'Product Name'"
                :productPrice="sanitizedFormBuffer.price ? sanitizedFormBuffer.price : 99.99"
                :productUnit="sanitizedFormBuffer.unit ? sanitizedFormBuffer.unit : 'ea'"
                :productQty="sanitizedFormBuffer.qty ? sanitizedFormBuffer.qty : 99"
            />
        </div>
        </template>
        <template #edit>
            <span class="row- gap05 w100 h100">
                <i class="bi bi-1-circle"></i>
                <SelectComponent :elementId="'productCategory'"
                    :label="'Category'"
                    :isRow="false"
                    :isWidth100="true"
                    :field="'name'"
                    :options= "products"
                    :isObject="true"
                    :returnKeyVal="false"
                    v-model:choice="formBuffer.pid"
                    @change="() => {if(formBuffer.iid){clearInputs('pid')}}" />
                <i class="bi bi-2-circle"></i>
                <SelectComponent :elementId="'productItem'"
                    :label="'Item'"
                    :isRow="false"
                    :isWidth100="true"
                    :field="'name'"
                    :options= "itemsWithConditions"
                    :isObject="true"
                    :returnKeyVal="false"
                    v-model:choice="formBuffer.iid"
                    @change="loadItemToBuffer"/>
            </span>
        </template>
        <template #form>
            <InputFileComponent :elementId="'productImage'"
                :label="'Product Image'"
                :isRow="false"
                :isWidth100="true"
                :acceptType="'image/jpeg'"
                v-model:data="formBuffer.upload"/>
            <span class="row- w100 gap1">
                <InputComponent :elementId="'productName'"
                    :label="'Product Name'"
                    :placeholder="formBuffer.name ? formBuffer.name : 'Product Name'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'text'"
                    :min="0"
                    :max="50"
                    :sanitize="true"
                    :toggleDisable="true"
                    :input="formBuffer.name"
                    v-model:output.capitalize="formBuffer.name"/>
                <InputComponent :elementId="'productBid'"
                    :label="'Product ID'"
                    :placeholder="formBuffer.bid ? formBuffer.bid : 'Product ID'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="100000"
                    :max="999999"
                    :sanitize="true"
                    :toggleDisable="true"
                    :input="formBuffer.bid"
                    v-model:output="formBuffer.bid"/>
            </span>
            <InputComponent :elementId="'productDescription'"
                    :label="'Product Description'"
                    :placeholder="formBuffer.description ? formBuffer.description : 'Product Description'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'text'"
                    :min="0"
                    :max="100"
                    :sanitize="true"
                    :toggleDisable="true"
                    :input="formBuffer.description"
                    v-model:output.capitalize="formBuffer.description"/>
            <InputComponent :elementId="'productBlurb'"
                    :label="'Product Blurb'"
                    :placeholder="'Enter Product Blurb'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'text'"
                    :min="0"
                    :max="25"
                    :sanitize="true"
                    :toggleDisable="true"
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
                :placeholder="formBuffer.supplier && formBuffer.supplier.sid && suppliers[formBuffer.supplier.sid] ? suppliers[formBuffer.supplier.sid].name : '---'"
                v-model:choice="formBuffer.sid"/>
            <span class="row- w100 gap1">
                <InputComponent :elementId="'productStock'"
                    :label="'Current Stock Level'"
                    :placeholder="formBuffer.qty ? formBuffer.qty : '0'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="0"
                    :max="999"
                    :sanitize="true"
                    :toggleDisable="true"
                    :input="formBuffer.qty"
                    v-model:output="formBuffer.stock"/>
                <InputComponent :elementId="'productMin'"
                    :label="'Minimum Stock Level'"
                    :placeholder="formBuffer.min ? formBuffer.min : '0'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="0"
                    :max="999"
                    :sanitize="true"
                    :toggleDisable="true"
                    :input="formBuffer.min"
                    v-model:output="formBuffer.min"/>
                <InputComponent :elementId="'productQuota'"
                    :label="'Product Quota'"
                    :placeholder="formBuffer.quota ? formBuffer.quota : '0'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="0"
                    :max="999"
                    :sanitize="true"
                    :toggleDisable="true"
                    :input="formBuffer.quota"
                    v-model:output="formBuffer.quota"/>
            </span>
            <span class="row- w100 gap1">
                <InputComponent :elementId="'productPrice'"
                    :label="'Product Price ($CAD)'"
                    :placeholder="formBuffer.price ? formBuffer.price : '0'"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="'number'"
                    :min="0"
                    :max="999"
                    :step="0.01"
                    :input="formBuffer.price"
                    :sanitize="true"
                    :toggleDisable="true"
                    v-model:output="formBuffer.price"/>
                <SelectComponent :elementId="'productUnit'"
                    :label="'Unit'"
                    :isRow="true"
                    :isWidth100="true"
                    :options= "['ea', 'kg', 'g', 'lb', 'oz', 'ml', 'l']"
                    :isObject="false"
                    :returnKeyVal="false"
                    :placeholder="formBuffer.unit ? formBuffer.unit : 'Unit'"
                    v-model:choice="formBuffer.unit"/>
            </span>
        </template>
        <template #buttons>
            <ButtonComponent :classes="'w100 h2rem'" :text="'Edit'" :code="7" :shade="'dark'" @click=onAction />
            <ButtonComponent :classes="'w100 h2rem'" :text="'Revert'" :code="3" :shade="'dark'" @click=onRevert />
            <ButtonComponent :classes="'w100 h2rem'" :text="'Delete'" :code="1" :shade="'dark'" @click="showModal = !showModal" />
        </template>
    </CRUDEditor>
    <Teleport to="body">
        <TheModal v-if="showModal && formBuffer.iid" @close-modal="showModal = !showModal" :code="alertTypes.error" :modalHeight="'auto'" :hasExtras="true">
            <template #header>
                <h3>Are you sure?</h3>
            </template>
            <template #body>
                <p>Are you sure you want to delete {{formBuffer.name}}?</p>
                <br/>
                <p>There are {{products[formBuffer.pid].items[formBuffer.iid].instock > 0 ? products[formBuffer.pid].items[formBuffer.iid].instock : 'no '}} items in stock.</p>
                <p>There are {{products[formBuffer.pid].items[formBuffer.iid].incart > 0 ? products[formBuffer.pid].items[formBuffer.iid].incart : 'no '}} items in active carts.</p>
                <p>There are {{products[formBuffer.pid].items[formBuffer.iid].toscan > 0 ? products[formBuffer.pid].items[formBuffer.iid].toscan : 'no '}} items waiting to be scanned.</p>
                <p>There are {{products[formBuffer.pid].items[formBuffer.iid].topickup > 0 ? products[formBuffer.pid].items[formBuffer.iid].topickup : 'no '}} items waiting to be pickup.</p>
                <br/>
                <p>This action is irreversable.</p>
            </template>
            <template #extras>
                <div class="custom-modal-extras col- w100 h100 gap05">
                    <span class="w100 h100 col- gap025">
                        <p>Type "{{formBuffer.name}}" to delete the product</p>
                        <input v-model="deleteConfirmInput" />
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
import {reactive, computed, ref,watch} from 'vue'
import {useHelperStore} from '../../../stores/helpers'
import {useProductStore} from '../../../stores/products'
import {useSuppliersStore} from '../../../stores/suppliers'
import CRUDEditor from '../../../components/crud_components/CRUDEditor.vue'
import SelectComponent from '../../../components/common/SelectComponent.vue'
import InputComponent from '../../../components/common/InputComponent.vue'
import InputFileComponent from '../../../components/common/InputFileComponent.vue'
import ButtonComponent from '../../../components/common/ButtonComponent.vue'
import AlertDropComponent from '../../../components/common/AlertDropComponent.vue'
import TheStoreCard from '../../../components/crud_components/CRUDStoreCard.vue'
import TheCartCard from '../../../components/crud_components/CRUDCartCard.vue'
import TheModal from '../../../components/common/TheModal.vue'
export default ({
    components: {
        CRUDEditor,
        SelectComponent,
        InputComponent,
        InputFileComponent,
        ButtonComponent,
        AlertDropComponent,
        TheStoreCard,
        TheCartCard,
        TheModal
    },
    setup() {
        const helperStore = useHelperStore()
        const productStore = useProductStore()
        const products = computed(() => productStore.products)
        const supplierStore = useSuppliersStore()
        const suppliers = supplierStore.suppliers
        const showAlert = ref(false)
        const alertMessage = ref('')
        const alertTypes = helperStore.colorCodes
        const alertCode = ref(0)
        const showModal = ref(false)
        const deleteConfirmInput = ref('')
        const imageBuffer = reactive({
        })
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
        const itemsWithConditions = computed(() => {
            if(formBuffer.pid){
                return products.value[formBuffer.pid].items
            }else{
                return []
            }
        })
        function loadItemToBuffer(e){
            if(e.target.value != '') {
                const item = products.value[formBuffer.pid].items[formBuffer.iid]
                Object.assign(formBuffer, item)
            }
            if(formBuffer.upload){
                delete formBuffer.upload
                imageBuffer.storeCard = ''
                imageBuffer.cartCard = ''            
            }
        }

        watch(formBuffer, (oldVal,newVal) => {
            if(formBuffer.images && !formBuffer.upload) {
                imageBuffer.storeCard = formBuffer.images.bigRef,
                imageBuffer.cartCard= formBuffer.images.thumbnailRef
            }else if(formBuffer.upload) {
                imageBuffer.storeCard = formBuffer.upload.preview,
                imageBuffer.cartCard= formBuffer.upload.preview
                }
            },
        )
        const onAction = async () => {
            let frozenBuffer = {...sanitizedFormBuffer.value}
            Object.freeze(frozenBuffer)
            const resp = await productStore.updateItem(frozenBuffer)
            if(resp){
                alertMessage.value = 'Product Edited Successfully'
                alertCode.value = alertTypes.success
                showAlert.value = true
                imageBuffer.storeCard = ''
                imageBuffer.cartCard = ''
            }else{
                alertMessage.value = 'Product Creation Failed'
                alertCode.value = alertTypes.error
                showAlert.value = true
                imageBuffer.storeCard = ''
                imageBuffer.cartCard = ''
            }
        }

        const clearInputs = (exception = '') => {
            Object.keys(formBuffer).forEach(key => {
                if(key != exception) {
                    delete formBuffer[key]
                }
            })
            imageBuffer.storeCard = ''
            imageBuffer.cartCard = ''
        }

        const onRevert = () => {
            const item = products.value[formBuffer.pid].items[formBuffer.iid]
            delete formBuffer.upload
            Object.assign(formBuffer, item)
        }
        const onDelete = async () => {
            if(deleteConfirmInput.value == formBuffer.name){
                showModal.value = false
                const resp = await productStore.deleteItem(formBuffer.pid, formBuffer.iid)
                if(resp) {
                    alertMessage.value = 'Product Deleted Successfully'
                    alertCode.value = alertTypes.success
                    showAlert.value = true
                    clearInputs()
                }else{
                    alertMessage.value = 'Product Delete Failed'
                    alertCode.value = alertTypes.danger
                    showAlert.value = true
                }
            }else{
                alertMessage.value = 'Product Deletion Failed! Input did not match category name'
                alertCode.value = alertTypes.danger
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
            itemsWithConditions,
            suppliers,
            showAlert,
            alertMessage,
            alertCode,
            loadItemToBuffer,
            imageBuffer,
            clearInputs,
            showModal,
            alertTypes,
            deleteConfirmInput
        }
        
    },
})
</script>