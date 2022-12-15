<template>
    <TheCard :hasImage="false" :hasExtras="false" :isHeightDynamic="true" class="w100">
        <template #title>
            <div class="row- pd1 gap1 center-space-between w100">
                <h2>Shipping:</h2>
                <i class="bi bi-pencil-fill" @click="$emit('show-modal')"></i>
            </div>
        </template>
        <template #body>
            <div class="col- pd05 w100">
                <div class='row- center-space-between'>
                    <h4 class="w100">Pickup:</h4>
                    <p class="w100">{{profile.pickupLocation}}</p>
                </div>
                <div class='row- .center-space-between w100'>
                    <h4 class="w100">Pickup date:</h4>
                    <p class="w100">{{profile.pickupDate}}</p>
                </div>
                <div class='row- .center-space-between w100'>
                    <h4 class="w100">Account Active:</h4>
                    <p class="w100">{{profile.boxActive}}</p>
                </div>
            </div>
        </template>
    </TheCard>
</template>
<script>
import { computed } from 'vue'
import TheCard from '../common/TheCard.vue'
import { useUserStore } from '../../stores/user'

export default ({
    emits: ['show-modal'],
    components: {
        TheCard,
    },
    setup() {
        const userStore = useUserStore()
        const profile = computed(() => userStore.userProfile)
        return{
            profile,
        }
    },
})
</script>
<style scoped>
i:hover {
    cursor: pointer;
    color: var(--vt-c-primary)
}
</style>
