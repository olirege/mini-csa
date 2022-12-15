<template>
    <TheCard :hasImage="false" :hasExtras="false" class="w60" :bodyStyle="'align-start'">
        <template #title>
            <h2 class="pd1">Order History:</h2>
        </template>
        <template #body>
            <div class="col- w100">
                <div class="col- pd05 w100" v-if="cartHistory">
                    <div class="row- w100 center-space-between border-bottom mg1bot">
                        <h4 class="w100">Order Number:</h4>
                        <h4 class="w100">Order Date:</h4>
                        <h4 class="w100">Total:</h4>
                    </div>
                    <div class='row- w100 center-space-between' v-for="(cart,id,index) in cartHistory" :key="index">
                        <div class="row- w100 center-space-between">
                            <router-link :to="'/order/view/' + id" class="w100"><p class="w100">{{id}}</p></router-link>
                            <p class="w100">{{formatTimestamp(cart.closedOn)}}</p>
                            <p class="w100">{{cart.checkoutTotal}}$</p>
                        </div>
                    </div>
                </div>
                <div class="col- pd05 w100" v-else>
                    "No orders yet"
                </div>
            </div>                            
        </template>
    </TheCard>
</template>
<script>
import TheCard from '../common/TheCard.vue';
import { useCartStore } from '../../stores/cart';
import { useHelperStore } from '../../stores/helpers';
import { computed } from 'vue';
export default ({
    components: {
        TheCard,
    },
    setup() {
        const cartStore = useCartStore();
        const helperStore = useHelperStore();
        const colorCodes = helperStore.colorCodes;
        const cartHistory = computed(() => cartStore.cartHistory);
        const formatTimestamp = (timestamp) => {
            return helperStore.timestampFormatter(timestamp)
        }
        return {
            cartHistory,
            formatTimestamp,
            colorCodes,
        }
    },
})
</script>
