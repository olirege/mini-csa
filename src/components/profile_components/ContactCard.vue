<template>
    <TheCard :hasImage="false" :hasExtras="false" :isHeightDynamic="true" class="w100">
        <template #title>
            <div class="row- pd1 gap1 center-space-between w100">
                <h2>Contact Information:</h2>
                <i class="bi bi-pencil-fill " @click="$emit('show-modal')"></i>
            </div>
        </template>
        <template #body>
            <div class="col- pd05 w100">
                <div class='row- gap1 center-space-between'>
                    <h4 class="w100">Phone Number:</h4>
                    <p class="w100">{{formatTelephone(profile.tel)}}</p>
                </div>
                <div class='row- gap1 center-space-between'>
                    <h4 class="w100">Address:</h4>
                    <p class="w100">{{profile.postalCode}}</p>
                </div>
                <div class='row- gap1 center-space-between'>
                    <h4 class="w100">Email:</h4>
                    <p class="w100">{{profile.email}}</p>
                </div>
            </div>
        </template>
    </TheCard>
</template>
<script>

import { ref, computed } from 'vue'
import TheCard from '../common/TheCard.vue'
import { useUserStore } from '../../stores/user'
import { useHelperStore } from '../../stores/helpers'

export default({
    emits: ['show-modal'],
    components: {
        TheCard,
    },
    setup() {
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        const profile = computed(()=> userStore.userProfile)
        const showEditContactModal = ref(false)
        return {
            profile,
            showEditContactModal,
            formatTelephone: helperStore.formatTelephone
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
