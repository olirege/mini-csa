<template>
    <ThePage>
        <template #content>
            <div class= "col- w100 h100 gap1" v-if='profile'>
                <TitleCard/>
                <div class="row- w100 gap1">
                    <ContactCard @show-modal="showEditContactModal=true"/>
                    <ShippingCard @show-modal="showEditShippingModal=true"/>
                </div>
                <div class="row- w100 gap1">
                    <OrderHistoryCard/>
                    <NotificationCard @on-save="(formBuffer) => onSave(formBuffer)"/>
                </div>
                    <CCCard 
                    @show-modal="(showAddCCModal = true)"
                    @on-delete="(card)=>onDelete(card)"
                    @on-activate="(card)=>onActivate(card)"/>
                </div>
                <Teleport to='body'>
                    <EditContactModal
                        :showEditContactModal="showEditContactModal"
                        @close-modal="showEditContactModal = false"
                    />
                    <EditShippingModal
                        :showEditShippingModal="showEditShippingModal"
                        @close-modal="showEditShippingModal = false"
                    />
                    <AddCCModal
                        :showAddCCModal="showAddCCModal"
                        @close-modal="showAddCCModal = false"
                    />
                    <alert-drop-component v-if="showAlert"
                        :message="alertMessage"
                        :code="alertColor"
                        />
                </Teleport>
        </template>
    </ThePage>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useHelperStore } from '../stores/helpers'
import ThePage from '../components/common/ThePage.vue'
import AlertDropComponent from '../components/common/AlertDropComponent.vue'
import EditContactModal from '../components/profile_components/EditContactModal.vue'
import EditShippingModal from '../components/profile_components/EditShippingModal.vue'
import AddCCModal from '../components/profile_components/AddCCModal.vue'
import TitleCard from '../components/profile_components/TitleCard.vue'
import ContactCard from '../components/profile_components/ContactCard.vue'
import ShippingCard from '../components/profile_components/ShippingCard.vue'
import OrderHistoryCard from '../components/profile_components/OrderHistoryCard.vue'
import NotificationCard from '../components/profile_components/NotificationCard.vue'
import CCCard from '../components/profile_components/CCCard.vue'
export default ({
    components: {
        ThePage,
        EditContactModal,
        EditShippingModal,
        AddCCModal,
        AlertDropComponent,
        TitleCard,
        ShippingCard,
        ContactCard,
        OrderHistoryCard,
        NotificationCard,
        CCCard
    },
    setup() {
        const userStore = useUserStore()
        const profile = computed(() => userStore.userProfile)
        const helperStore = useHelperStore()
        const colorCodes =  helperStore.colorCodes
        const showAddCardModal = ref(false)
        const showEditCardModal = ref(false)
        const showEditContactModal = ref(false)
        const showEditShippingModal = ref(false)
        const showAddCCModal = ref(false)
        const showAlert = ref(false)
        const alertMessage = ref('')
        const alertColor = ref(0)
        const formBuffer = reactive({
        })
 
        function onSave(data){
            const resp = userStore.saveProfileChanges(data)
            displayAlert(resp)
        }

        function onActivate(card){
            const select = profile.value.cc.filter((card) => card.isSelectedCC == true)
            select[0].isSelectedCC = false
            card.isSelectedCC = true
            const changes = {cc: profile.value.cc}
            const resp = userStore.saveProfileChanges(changes)
            displayAlert(resp)
        }

        async function onDelete(card){
            const resp = await userStore.removeCC(card)
            displayAlert(resp)
        }
        function displayAlert(resp){
            if(resp){
                alertColor.value = colorCodes.success
                showAlert.value = true
                alertMessage.value = "Profile changes saved"
                setTimeout(() => {
                    showAlert.value = false
                }, 3000);
            }
            else{
                alertColor.value = colorCodes.danger
                showAlert.value = true
                alertMessage.value = "Error saving profile changes"
                setTimeout(() => {
                    showAlert.value = false
                }, 3000);
            }
        }
        return {
            showAddCardModal,
            showEditCardModal,
            onDelete,
            showEditContactModal,
            showEditShippingModal,
            showAddCCModal,
            formBuffer,
            onActivate,
            showAlert,
            alertMessage,
            alertColor,
            onSave,
            profile,
        }
    },
})
</script>
<style scoped>
i:hover{
    cursor: pointer;
    color: var(--vt-c-primary)
}
</style>