<template>
    <alert-drop-component v-if="showAlert"
        :message="alertMessage"
        :code="alertColor"
        />
    <TheModal v-if="showEditShippingModal" 
    @close-modal="$emit('close-modal')" 
    :noBackdrop="false" 
    :hasExtras="true"
    :modalWidth="'50%'"
    >
        <template #body>
            <div class="col- gap1">
                <div class='row- gap1 center-space-between'>
                    <CustomSelect
                        elementId="shippingPickupDate"
                        :label="'Choose your pickup date'"
                        :placeholder="'Select day of the week'"
                        :isObject="false"
                        v-model:choice="formBuffer.pickupDate"
                        :isRow="false"
                        :isWidth100="true"
                        :options="daysOfTheWeek"
                        :returnKeyVal='false'
                        />
                </div>
                <ShippingCalendar
                :selectedDay="formBuffer.pickupDate != 'Select day of the week' ? formBuffer.pickupDate : profile.pickupDate"/>
            </div>
        </template>
        <template #extras>
            <span class="flex end w100">
                <CustomButton class="wauto" @click="$emit('close-modal')" :code="colorCodes.dark" :text="'Close'" />
                <CustomButton class="wauto" @click="onSave" :code="colorCodes.success" :text="'Save'" />
            </span>
        </template>
    </TheModal>
</template>
<script>
import { reactive,ref } from 'vue'
import TheModal from '../common/TheModal.vue'
import CustomInput from '../common/InputComponent.vue'
import CustomButton from '../common/ButtonComponent.vue'
import { useUserStore } from '../../stores/user'
import { useHelperStore } from '../../stores/helpers'
import CustomSelect from '../common/SelectComponent.vue'
import AlertDropComponent from '../common/AlertDropComponent.vue'
import ShippingCalendar from './ShippingCalendarComponent.vue'
export default ({
    components: {
        TheModal,
        CustomInput,
        CustomButton,
        CustomSelect,
        AlertDropComponent,
        ShippingCalendar
    },
    props:{
        showEditShippingModal: Boolean,
    },
    emits:[
        'close-modal'
    ],
    setup(_,ctx) {
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        const colorCodes = helperStore.colorCodes
        const formBuffer = reactive({
            pickupDate: userStore.userProfile.pickupDate
        })
        const showAlert = ref(false)
        const alertMessage = ref('')
        const alertColor = ref(0)
        const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        function onSave(){
                if(!formBuffer.pickupDate){
                    alertColor.value = colorCodes.danger
                    showAlert.value = true
                    alertMessage.value = "Please select a day of the week"
                    setTimeout(() => {
                        showAlert.value = false
                    }, 3000);
                    return
                }
                const resp = userStore.saveProfileChanges(formBuffer)
                if (resp){
                    alertColor.value = colorCodes.success
                    showAlert.value = true
                    alertMessage.value = "Profile changes saved"
                    ctx.emit('close-modal')
                    setTimeout(() => {
                        showAlert.value = false
                    }, 3000);
                }
                else{
                    alertColor.value = colorCodes.danger
                    showAlert.value = true
                    alertMessage.value = "Error saving profile changes"
                    ctx.emit('close-modal')
                    setTimeout(() => {
                        showAlert.value = false
                    }, 3000);
                }

            }
        return{
            colorCodes,
            profile: userStore.userProfile,
            onSave,
            formBuffer,
            daysOfTheWeek,
            showAlert,
            alertMessage,
            alertColor,
        }
    },
})
</script>
