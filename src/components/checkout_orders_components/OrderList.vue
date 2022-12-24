<template>
    <div class="col- w15 gap1">
        <span class="h50 border-with-radius oflow-hidden">
            <h3 class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">Orders Due</h3>
            <div class="col- oflow-y-auto h100" v-if="Object.keys(carts).length > 0">
                <div class="row- center-space-between border-bottom pd05"
                v-for="(cart,oid,index) in carts" :key="index"
                :cart="cart"
                :oid="oid"
                id="item-row"
                @click="$emit('order-selected', oid)"
                :class="{active: selectedOrder.oid == oid}">
                <span class="row- w100 center-space-between">
                    <h5>{{oid}}</h5>
                    <h5>{{cart.data.checkoutTotal? formatNumber(cart.data.checkoutTotal): formatNumber(0)}}</h5>
                </span>
                </div>
            </div>
        </span>
        <span class="h50 border-with-radius oflow-hidden">
            <h3 class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">Orders Completed</h3>
            <div class="col- h100 oflow-y-auto" v-if="Object.keys(carts).length > 0">
                <div class="row- center-space-between border-bottom pd05"
                v-for="(cart,oid,index) in ordersReadyForPickup" :key="index"
                :cart="cart"
                :oid="oid"
                id="item-row"
                @click="$emit('order-selected', oid)"
                :class="{active: selectedOrder.oid == oid}">
                <span class="row- w100 center-space-between">
                    <h5>{{oid}}</h5>
                    <h5>{{cart.data.checkoutTotal? formatNumber(cart.data.scannedTotal): formatNumber(0)}}</h5>
                </span>
                </div>
            </div>
        </span>
    </div>
</template>
<script>
import {useHelperStore} from '../../stores/helpers'
export default({
    emits:[
        'order-selected'
    ],
    props: {
        carts: {
            type: Object,
            required: true
        },
        selectedOrder: {
            type: Object,
            required: true
        },
        ordersReadyForPickup: {
            type: Object,
            required: true
        }
    },
    setup(){
        const helper = useHelperStore()
        return{
            formatNumber: helper.formatNumberToCurrency
        }
    }
})
</script>
<style scoped>
.active,
#item-row:hover{
    cursor:pointer;
    background-color: var(--color-border);
}
</style>