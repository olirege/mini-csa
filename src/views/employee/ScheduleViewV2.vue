<template>
    <ThePage>
        <template #content>
            <div id='content' class="w100 h100 row- gap1">
                <DateListComponent
                    :dates="cartsDue"
                    :selectedDate = "selectedDate"
                    @on-load-date="loadCartsOfDate"
                    />
                <DateContentComponent
                :selectedDate="selectedDate"
                :selectedCart="selectedCart"
                @on-load-cart="loadCart"
                @on-check-day-summmary="showDaySummary = true"/>
                <CartContentComponent v-if="selectedCart.key && !showDaySummary"
                :selectedCart="selectedCart" />
                <DaySummaryContentComponent 
                v-if="showDaySummary"
                :selectedDate="selectedDate"
                :dailySummary="dailyCartsSummaries[selectedDate.index]" />
            </div>
        </template>
    </ThePage>
</template>
<script>
import {computed,ref} from 'vue'
import { useCartStore } from '../../stores/cart'
import ThePage from '../../components/common/ThePage.vue'
import DateListComponent from '../../components/schedule_component/DateListComponent.vue'
import DateContentComponent from '../../components/schedule_component/DateContentComponent.vue'
import CartContentComponent from '../../components/schedule_component/CartContentComponent.vue'
import DaySummaryContentComponent from '../../components/schedule_component/DaySummaryContentComponent.vue'
import {useHelperStore} from '../../stores/helpers'
export default ({
    components: {
        ThePage,
        DateListComponent,
        DateContentComponent,
        CartContentComponent,
        DaySummaryContentComponent,
    },
    setup() {
        const cartStore = useCartStore()
        const helperStore = useHelperStore()
        const selectedDate = ref({})
        const selectedCart = ref({})
        const showDaySummary = ref(false)
        const cartsDue = computed(() => cartStore.cartsDue)
        cartStore.summarizeItemsQtyAndPriceOfCartsOnADate().then(
            () =>{
                cartStore.summarizeItemsQtyAndTotalOfCartsOfWeek();
            }
        )
        const weeklyCartsSummary = computed(() => cartStore.weeklyCartsSummary)
        const dailyCartsSummaries = computed(() => cartStore.dailyCartsSummaries)
        function loadCartsOfDate(date){
            Object.assign(selectedDate.value,date)
            //
        }
        function loadCart(cid){
            Object.assign(selectedCart.value,cid)
        }
        return {
            cartsDue,
            formatNumber: helperStore.formatNumberToCurrency,
            weeklyCartsSummary,
            colors: helperStore.colors,
            dailyCartsSummaries,
            selectedDate,
            selectedCart,
            loadCartsOfDate,
            loadCart,
            showDaySummary,
        }
    },
})
</script>
<style scoped>
#content {
    height: calc(100% - var(--header-height));
}
</style>