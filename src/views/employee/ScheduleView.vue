<template>
    <ThePage>
        <template #content>
        <div class="content">
            <TheCard :hasImage="false" v-if="weeklyCartsSummary">
                <template #title>
                    <h3 class="custom-card-title" :style="{backgroundColor: colors[1].dark}">Summary</h3>
                </template>
                <template #body>
                    <div class="custom-card-body">
                        {{weeklyCartsSummary}}
                    </div>
                </template>
            </TheCard>
            <TheCard v-for="(cart,date,index) in cartsDue" :key="index" :hasImage="false" class="custom-card-wrapper">
                <template #title>
                    <h3 class="custom-card-title" :style="{backgroundColor: colors[index].dark}">{{date}}</h3>
                </template>
                <template #body v-if="dailyCartsSummaries && dailyCartsSummaries[index]">
                    <div class="custom-card-body" v-if="cart.length > 0">
                        <span class="data-bubbles">
                            <h2 class="data-bubble" :style="{backgroundColor: colors[index].light}">{{cart.length}} carts due</h2>
                            <h2 class="data-bubble" :style="{backgroundColor: colors[index].light}">{{formatNumber(dailyCartsSummaries[index].total)}}</h2>
                        </span>
                        <span>
                            <p v-for="(item,name,index) of dailyCartsSummaries[index].items"
                                :key="index">
                                {{name}}:{{item.qty}} x {{formatNumber(item.price)}} = {{formatNumber(item.total)}}
                            </p>
                        </span>
                    </div>
                    <div v-else>
                        <p>No carts due</p>
                    </div>
                </template>
                <template #body v-else>
                    <p>
                        loading..
                    </p>
                </template>
            </TheCard>
        </div>
        </template>
    </ThePage>
</template>
<script>
import {computed} from 'vue'
import { useCartStore } from '../../stores/cart'
import ThePage from '../../components/common/ThePage.vue'
import TheCard from '../../components/common/TheCard.vue'
import {useHelperStore} from '../../stores/helpers'
export default ({
    components: {
        TheCard,
        ThePage
    },
    setup() {
        const cartStore = useCartStore()
        const helperStore = useHelperStore()
        const cartsDue = computed(() => cartStore.cartsDue)
        cartStore.summarizeItemsQtyAndPriceOfCartsOnADate().then(
            () =>{
                cartStore.summarizeItemsQtyAndTotalOfCartsOfWeek();
            }
        )
        const weeklyCartsSummary = computed(() => cartStore.weeklyCartsSummary)
        const dailyCartsSummaries = computed(() => cartStore.dailyCartsSummaries)
        return {
            cartsDue,
            formatNumber: helperStore.formatNumberToCurrency,
            weeklyCartsSummary,
            colors: helperStore.colors,
            dailyCartsSummaries
        }
    },
})
</script>
<style scoped>
.content{
    display:flex;
    flex-direction: column;
    gap:1rem;
}
.custom-card-wrapper{
    width: 100%;
    height: 100%;
}
.custom-card-title{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 400;
    border-radius: 5px 5px 0 0;
    width:100%;
    gap:0.5rem;
    height:100%;
    padding-left: 0.5rem;
    color: var(--vt-c-white);
}
.custom-card-body{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
}
.custom-card-body > .data-bubbles{
    display:flex;
    flex-direction: row;
    gap: 1rem;  
}
.data-bubble{
    border-radius: 50%;
    width: 8rem;
    height: 8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 0.5rem;
}
</style>