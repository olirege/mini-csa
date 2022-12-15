<template>
    <alert-drop-component v-if="showAlert"
        :message="alertMessage"
        :code="alertColor"
        />
    <TheModal v-show="showAddCCModal" 
    @close-modal="$emit('close-modal')" 
    :noBackdrop="false" 
    :hasExtras="true"
    :modalHeight="'auto'"
    :modalWidth="'auto'">
        <template #body>
            <div class="w100 h100 flex center">
                <p v-show="isLoading" class="flex center w100 h100">Loading ...</p>
                <div v-show="!isLoading" id="realex-wrapper"></div>
            </div>
        </template>
        <template #extras>
            <span class="flex end w100 pd2rgt">
                <CustomButton class="wauto" @click="$emit('close-modal')" :code="colorCodes.dark" :text="'Close'" />
            </span>
        </template>
    </TheModal>
</template>
<script>
import { ref, reactive } from 'vue'
import TheModal from '../common/TheModal.vue'
import CustomInput from '../common/InputComponent.vue'
import CustomButton from '../common/ButtonComponent.vue'
import { useUserStore } from '../../stores/user'
import { useHelperStore } from '../../stores/helpers'
import AlertDropComponent from '../common/AlertDropComponent.vue'
import initHpp from './scripts/initHpp.vue'


export default ({
    components: {
        TheModal,
        CustomInput,
        CustomButton,
        AlertDropComponent
    },
    props:{
        showAddCCModal: Boolean,
    },
    emits:[
        'close-modal'
    ],
    watch: {
        showAddCCModal: async function (val) {
            if(val){
                this.isLoading = true
                initHpp().then(()=>{
                    setTimeout(() => {
                        this.isLoading = false
                    }, 2000);
                })
            }
        }
    },
    setup(props) {
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        const colorCodes = helperStore.colorCodes
        const showAlert = ref(false)
        const isLoading = ref(props.showAddCCModal.isLoading)
        const alertMessage = ref('')
        const alertColor = ref(0)
        const formBuffer = reactive({
            })
       
        function onSave(){
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
            showAlert,
            alertMessage,
            alertColor,
            isLoading,
        }
    },
})
</script>
<style scoped>
#realex-wrapper >>> #iframeId{
  width: 100%;
  height: 100%;
  border:none;
}
</style>
