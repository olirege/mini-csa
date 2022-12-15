<template>
    <AlertDropComponent
        :code="alertColor"
        :message="alertMessage"
        @close-alert="showAlert = false"
        v-if="showAlert"
        />
    <TheModal v-show="showEditContactModal" 
    @close-modal="$emit('close-modal')" 
    :noBackdrop="false" 
    :hasExtras="true">
        <template #body>
            <div class="col- gap1">
                {{formBuffer}}
                <div class='row- gap1 center-space-between'>
                    <CustomInput
                        elementId="phoneNumber"
                        :label="'Phone Number'"
                        :inputType="'tel'"
                        :placeholder="formatTelephone(profile.tel)"
                        :toggleDisable="true"
                        :input="formBuffer.tel"
                        v-model:output="formBuffer.tel"
                        :isRow="true"
                        :min="0"
                        :max="10"
                        :sanitize="true"
                        :isWidth100="true"
                    />
                </div>
                <div class='row- gap1 center-space-between'>
                    <CustomInput
                        elementId="userAddress"
                        :label="'Address'"
                        :inputType="'string'"
                        :placeholder="profile.postalCode"
                        :toggleDisable="true"
                        :input="formBuffer.postalCode"
                        v-model:output="formBuffer.postalCode"
                        :isRow="true"
                        :min="0"
                        :max="100"
                        :sanitize="true"
                        :isWidth100="true"
                    />                
                </div>
            </div>
        </template>
        <template #extras>
            <span class="flex end w100 pd2rgt">
                <CustomButton class="wauto" @click="$emit('close-modal')" :code="colorCodes.dark" :text="'Close'" />
                <CustomButton class="wauto" @click="onSave" :code="colorCodes.success" :text="'Save'" />
            </span>
        </template>
    </TheModal>
</template>
<script>
import { reactive, onMounted,ref } from 'vue'
import TheModal from '../common/TheModal.vue'
import AlertDropComponent from '../common/AlertDropComponent.vue'
import CustomInput from '../common/InputComponent.vue'
import CustomButton from '../common/ButtonComponent.vue'
import { useUserStore } from '../../stores/user'
import { useHelperStore } from '../../stores/helpers'
export default ({
    components: {
        TheModal,
        CustomInput,
        CustomButton,
        AlertDropComponent
    },
    props:{
        showEditContactModal: Boolean,
    },
    emits:[
        'close-modal'
    ],
    setup(_, ctx) {
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        const colorCodes = helperStore.colorCodes
        const alertMessage = ref('')
        const alertColor = ref(0)
        const showAlert = ref(false)
        const formBuffer = reactive({
            })
        
        function initAutoCompletePostalCode(){
            var options = {
                types: ['(regions)'],
                componentRestrictions: {country: "ca"}
            };
            var input = document.getElementById('userAddress');
            var autocomplete = new google.maps.places.Autocomplete(input, options);
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                var postalCode = place.address_components.find(function(component){
                    formBuffer.postalCode = input.value;                    
                    return component.types.includes("postal_code")
                })
                if(postalCode){
                    document.getElementById("userAddress").value = postalCode.long_name;
                }
            });
        }

        onMounted(() => {
            formBuffer.tel = userStore.userProfile.tel
            formBuffer.postalCode = userStore.userProfile.postalCode
            initAutoCompletePostalCode();
        });

        async function onSave(){
                const frozenFormBuffer = Object.freeze(formBuffer)
                const resp = await userStore.saveProfileChanges(frozenFormBuffer)
                if(resp){
                    ctx.emit('close-modal')
                    alertColor.value = colorCodes.success
                    alertMessage.value = 'Profile updated successfully'
                    showAlert.value = true
                }else{
                    alertColor.value = colorCodes.danger
                    alertMessage.value = 'Profile update failed'
                    showAlert.value = true
                }

            }
        return{
            colorCodes,
            profile: userStore.userProfile,
            onSave,
            formBuffer,
            formatTelephone: helperStore.formatTelephone,
            showAlert,
            alertColor,
            alertMessage,
            
        }
    },
})
</script>
