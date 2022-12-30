<template>
    <ThePage>
        <template #content>
            <div id='content' class="w100 h100 row- gap1">
                <DateListComponent
                    :dates="cartsDue"
                    :selectedDate = "selectedDate"
                    @on-load-date="loadCartsOfDate"
                    @on-check-weekly-summmary="onCheckWeeklySummary"
                    />
                <DateContentComponent
                :selectedDate="selectedDate"
                :selectedCart="selectedCart"
                @on-load-cart="loadCart"
                @on-check-day-summmary="onCheckDaySummary"/>
                <CartContentComponent v-if="selectedCart.key && !showDaySummary && !showWeeklySummary"
                :selectedCart="selectedCart" />
                <DaySummaryContentComponent 
                v-if="showDaySummary"
                :selectedDate="selectedDate"
                :dailySummary="dailyCartsSummaries[selectedDate.index]"/>
                <WeeklySummaryContentComponent
                v-if="showWeeklySummary"
                :weeklySummary="weeklyCartsSummary"
                />
            </div>
        </template>
    </ThePage>
</template>
<script>
import { computed,ref } from 'vue'
import { useCartStore } from '../../stores/cart'
import ThePage from '../../components/common/ThePage.vue'
import DateListComponent from '../../components/schedule_component/DateListComponent.vue'
import DateContentComponent from '../../components/schedule_component/DateContentComponent.vue'
import CartContentComponent from '../../components/schedule_component/CartContentComponent.vue'
import DaySummaryContentComponent from '../../components/schedule_component/DaySummaryContentComponent.vue'
import WeeklySummaryContentComponent from '../../components/schedule_component/WeeklySummaryContentComponent.vue'
import { useHelperStore } from '../../stores/helpers'
export default ({
    components: {
        ThePage,
        DateListComponent,
        DateContentComponent,
        CartContentComponent,
        DaySummaryContentComponent,
        WeeklySummaryContentComponent,
    },
    setup() {
        const cartStore = useCartStore()
        const helperStore = useHelperStore()
        const selectedDate = ref({})
        const selectedCart = ref({})
        const showDaySummary = ref(false)
        const showWeeklySummary = ref(true)
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
            showDaySummary.value = false
            showWeeklySummary.value = true
            
        }
        function loadCart(cid){
            Object.assign(selectedCart.value,cid)
            showDaySummary.value = false
            showWeeklySummary.value = false
        }
        function onCheckWeeklySummary(){
            showWeeklySummary.value = true
            showDaySummary.value = false
        }
        function onCheckDaySummary(){
            showWeeklySummary.value = false
            showDaySummary.value = true
        }
        return {
            cartsDue,
            formatNumber: helperStore.formatNumberToCurrency,
            weeklyCartsSummary,
            colors: helperStore.colors,
            dailyCartsSummaries,
            showWeeklySummary,
            selectedDate,
            selectedCart,
            loadCartsOfDate,
            loadCart,
            showDaySummary,
            onCheckWeeklySummary,
            onCheckDaySummary,
        }
    },
})
</script>
<style scoped>
#content {
    height: calc(100% - var(--header-height));
}
</style>