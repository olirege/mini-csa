<template>
    <Teleport to="body">
        <AlertDropComponent :message="alertMessage" :code="alertCode" v-if="showAlert" @close-alert="showAlert = !showAlert"/>
    </Teleport>
    <TheModal @close-modal="$emit('on-close')" 
    :hasExtras="true" 
    :modalWidth="'25%'" 
    :code="2"
    :noBackdrop="true">
        <template #header>
            <span class="row- gap05 align-center"> 
                <i class="bi bi-pen-fill"></i>
                <h3>{{formBuffer.name}}</h3>
            </span>
        </template>
        <template #body>
            <div class="col- gap05">
                <template v-for="v,k,i in computedBuffer" 
                :key="i"
                >
                    <InputComponent
                    v-if="k != 'unit' && k != 'costPerUnit'" 
                    :elementId="'data_' + k"
                    :label="capitalize(k)"
                    :placeholder="v"
                    :isRow="true"
                    :isWidth100="true"
                    :inputType="typeof(v) == 'string' ? 'text' : 'number'"
                    :min="0"
                    :step="0.01"
                    :input="formBuffer[k]"
                    :outputModifiers="capitalize"
                    :sanitize="true"
                    v-model:output="formBuffer[k]"
                    />
                    <SelectComponent
                    v-if="k == 'unit'" 
                    :elementId="'data'+ k"
                    :label="capitalize(k)"
                    :isRow="true"
                    :isWidth100="true"
                    :options= "units"
                    :isObject="false"
                    :returnKeyVal="false"
                    :placeholder="formBuffer[k]"
                    v-model:choice="formBuffer[k]"
                    />
                </template>
            </div>
            <span class="row- center-space-between pd1top">
                 <p>Cost per unit:</p><TheTag :code="0" :size="'big'" :text="formatNumber(formBuffer.cost/formBuffer.weight)"/>
                 <p> Total cost: </p> <TheTag :code="0" :size="'big'" :text="formatNumber(formBuffer.qty * formBuffer.cost)" />
            </span>
        </template>
        <template #extras>
            <ButtonComponent :classes="'w100 h2rem'" :text="'Accept'" :code="0" :shade="'dark'" @click="onAccept"/>
            <ButtonComponent :classes="'w100 h2rem'" :text="'Cancel'" :code="1" :shade="'dark'" @click="$emit('on-close')" />
        </template>
    </TheModal>
</template>
<script>
import TheModal from '../common/TheModal.vue'
import TheTag from '../common/TheTag.vue'
import InputComponent from '../common/InputComponent.vue'
import SelectComponent from '../common/SelectComponent.vue'
import ButtonComponent from '../common/ButtonComponent.vue'
import AlertDropComponent from '../common/AlertDropComponent.vue'
import { useHelperStore } from '../../stores/helpers'
import { useIngredientStore } from '../../stores/ingredients'
import { reactive,computed,ref } from 'vue'
export default({
    emits:['on-close'],
    props:{
        data:{
            type:Object,
            required:true,
        }
    },
    components:{
        TheModal,
        InputComponent,
        SelectComponent,
        ButtonComponent,
        TheTag,
        AlertDropComponent
    },
    setup(props,ctx){
        const {key, data} = props.data
        const ingredientStore = useIngredientStore()
        const helper = useHelperStore()
        const colors = helper.colors
        const alertMessage = ref('')
        const alertCode = ref(0)
        const showAlert = ref(false)
        const units = ingredientStore.units
        const formBuffer = reactive({})
        Object.assign(formBuffer,data)
        const computedBuffer = computed(()=>{
            const sorted = Object.entries(data).slice().sort((a,b)=>{
                a = a[0];
                b = b[0];
                return ( a == b ? 0 : a > b ? 1: -1);
            })
            return Object.fromEntries(sorted)
        })
        
        function onAccept(){
            const frozenBuffer = Object.freeze(formBuffer)
            const resp = ingredientStore.updateIngredient(key,frozenBuffer)
            if(resp){
                alertMessage.value = "Ingredient updated successfully!"
                alertCode.value = colors.success
                showAlert.value = true
                ctx.emit('on-close')
            }else{
                alertMessage.value = "Ingredient updated failed!"
                alertCode.value = colors.danger
                showAlert.value = true
            }
        }
        return{
            computedBuffer,
            formBuffer,
            units,
            formatNumber: helper.formatNumberToCurrency,
            capitalize: helper.capitalize,
            onAccept,
            alertCode,
            alertMessage,
            showAlert,
            
        }
    }
})
</script>
