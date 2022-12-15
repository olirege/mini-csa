<template>
    <TheCard :hasImage="false" :hasExtras="false" class="w100">
        <template #title>
            <span class="w100 row- center-space-between pd1">
                <h2>Payment Information:</h2>
                <TheTag :code="colorCodes.success" @click="$emit('show-modal')" :text="'Add card'" />
            </span>
        </template>
        <template #body>
            <div class="row- pd05 gap1 oflow-x-auto w100">
                <TheCard :hasImage="false"
                :isHeightDynamic="true"
                v-for="(card,index) in profile.cc" :key="index">
                    <template #body>
                        <div class="col- pd025 gap025">
                            <div class='field row- gap1 center'>
                                <h4 class="w100">Card Holder:</h4>
                                <p>{{card.SAVED_PMT_NAME}}</p>
                            </div>
                            <div class='field row- gap1 center'>
                                <h4 class="w100">Card Type:</h4>
                                <p>{{card.SAVED_PMT_TYPE}}</p>
                            </div>
                            <div class='field row- gap1 center'>
                                <h4 class="w100">Card Number:</h4>
                                <p>{{card.SAVED_PMT_DIGITS}}</p>
                            </div>
                            <div class='field row- gap1 center'>
                                <h4 class="w100">Card Expiration Date:</h4>
                                <p>{{card.SAVED_PMT_EXPDATE}}</p>
                            </div>
                        </div>
                    </template>
                    <template #extras>
                        <div class="row- w100 center-space-between">
                            <i class="bi bi-check2-circle txt-grn" v-if="card.isSelectedCC"></i>
                            <i class="bi bi-circle" v-if="!card.isSelectedCC" @click="$emit('on-activate',card)"></i>
                            <span class="row- flex-end gap1">
                                <i class="bi bi-trash-fill" @click="$emit('on-delete',card)"></i>
                            </span>
                        </div>
                    </template>
                </TheCard>
            </div>
        </template>
    </TheCard>
</template>
<script>
import {computed } from 'vue'
import TheCard from '../common/TheCard.vue'
import TheTag from '../common/TheTag.vue'
import { useUserStore } from '../../stores/user'
import { useHelperStore } from '../../stores/helpers'

export default({
    emits: ['on-delete','on-activate','show-modal'],
    components: {
        TheCard,
        TheTag,
    },
    setup() {
        const userStore = useUserStore()
        const profile = computed(()=> userStore.userProfile)
        const colorCodes = useHelperStore().colorCodes
        return {
            profile,
            colorCodes,
        }
    },
})
</script>
