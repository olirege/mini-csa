<template>
    <TheCard :hasImage="false" :hasExtras="false" :isHeightDynamic="true" class="w100">
        <template #title>
            <span class="col- pd1 w100">
                <div class="row- center-space-between w100">
                    <h1>{{capitalize(profile.firstName) + " " + capitalize(profile.lastName) }}</h1>
                    <TheTag :code="colorCodes.success" :text="'Account balance: ' + `${formatNumber(profile.balance)}`" />
                </div>
                <div class="col-">
                        <h4 class="txt-sml">Member since:</h4>
                        <h4 class="italic txt-smlr">{{formatTimestamp(profile.createdAt)}}</h4>
                </div>
                <ShippingCalendar :selectedDay="profile.pickupDate"/>
            </span>
        </template>
    </TheCard>
</template>
<script>
import { computed } from 'vue'
import TheTag from '../common/TheTag.vue'
import TheCard from '../common/TheCard.vue'
import { useUserStore } from '../../stores/user'
import { useHelperStore } from '../../stores/helpers'
import ShippingCalendar from './ShippingCalendarComponent.vue'
export default ({
    components: {
        TheCard,
        TheTag,
        ShippingCalendar
    },
    setup(){
        const userStore = useUserStore()
        const helperStore = useHelperStore()
        const colorCodes = helperStore.colorCodes
        const profile = computed(() => userStore.userProfile)
        const capitalize = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
        const formatTimestamp = (timestamp) => {
            return helperStore.timestampFormatter(timestamp)
        }
        const formatNumber = (number) => {
            return helperStore.formatNumberToCurrency(number)
        }
        return {
            profile,
            colorCodes,
            capitalize,
            formatTimestamp,
            formatNumber
        }
    }
})
</script>