<template>
    <ThePage>
        <template #content>
            <div class="content">
                <OrderList 
                :carts="carts" 
                :selectedOrder="selectedOrder"
                :ordersReadyForPickup="ordersReadyForPickup"
                v-if="carts"
                @order-selected="onOrderSelected"
                />
                <div v-else>
                    <p>No carts to scan</p>
                </div>
                <ScanningTable
                :selectedOrder="selectedOrder"
                @on-scanned='onScanned'
                @on-confirm="onConfirm"
                @on-cancel="onCancel"
                />
            </div>
        </template>
    </ThePage>
</template>
<script>
import { useCartStore } from '../../stores/cart'
import {ref, computed,reactive} from 'vue'
import ThePage from '../../components/common/ThePage.vue'
import OrderList from '../../components/checkout_orders_components/OrderList.vue'
import ScanningTable from '../../components/checkout_orders_components/ScanningTable.vue'
export default ({
    components: {
        ThePage,
        ScanningTable,
        OrderList,
    },
    setup() {
        const cartStore = useCartStore()
        const carts = computed(() => cartStore.carts)
        const ordersReadyForPickup = computed(() => cartStore.ordersReadyForPickup)
        const selectedOrder = reactive({})
        function onOrderSelected(oid){
            Object.assign(selectedOrder,carts.value[oid])
            selectedOrder.oid = oid
        }
        function onScanned(data){
            const e = data[0]

            const id = e.target.value
            if(id.length == 12){
                const {bid,price,_}  = barCodeParser(id)
                resetInput(e.target)
                if(isAlreadyScanned(bid,selectedOrder)){
                    const indx = selectedOrder.data.scannedItems.findIndex(item => item.bid == bid)
                    selectedOrder.data.scannedItems[indx].qty++
                    selectedOrder.data.scannedItems[indx].prices.push(price)
                }
                else{
                    const iid = cartStore.returnIid(bid)
                    if(!iid){
                        alert(`Item with barcode ${bid} not found`)
                        return
                    }else{
                        selectedOrder.data.scannedItems.push({
                            iid: iid ,
                            bid,
                            substitute: 'none',
                            qty: 1,
                            prices: [price]
                        })
                    }
                }
            }
        }
        function isAlreadyScanned(bid,cart){
            const item = cart.data.scannedItems.find(item => item.bid == bid)
            if(item){
                return true
            }
            return false
        }
        function resetInput(target){
            target.value = null
        }
        function barCodeParser(id){
            const bid = id.substring(0,6)
            const price = id.substring(7,11)
            const _ = id.substring(12,13)
            return {bid,price,_}
        }
        function onConfirm(){
            if(checkForErrors()){
                selectedOrder.data.cartStatus = 'ready-for-pickup'
                const completedOrder = Object.assign({},selectedOrder)
                Object.assign(selectedOrder,{})
                delete cartStore.carts[completedOrder.oid]
                cartStore.ordersReadyForPickup[completedOrder.oid] = completedOrder
                cartStore.updateOrder(completedOrder)
            }
        }
        function onCancel(){
            selectedOrder.data.scannedItems = []
            selectedOrder.data.scannedTotal = 0
            cartStore.updateOrder(selectedOrder)
        }
        function checkForErrors(){
            const scannedItems = selectedOrder.data.scannedItems
            const scannedTotal = selectedOrder.data.scannedTotal
            const cartTotal = selectedOrder.data.checkoutTotal
            const cartItems = selectedOrder.data.items
            if(scannedItems.length == 0){
                alert('No items scanned')
                return false
            }
            if(scannedTotal > cartTotal * 1.05 || scannedTotal < cartTotal * 0.95){
                alert('Scanned total does not match cart total by more or less than 5%')
                return false
            }
            if(scannedItems.length != cartItems.length){
                alert('Number of scanned items does not match number of items in cart')
                return false
            }
            // check for item quantity
            for(let i = 0; i < scannedItems.length; i++){

                const cartItem = cartItems.find(item => item.iid == scannedItem.iid)
                if(scannedItem.qty != cartItem.qty || scannedItem.substitute == 'none'){
                    alert(`Quantity of ${cartItem.name} does not match`)
                    return false
                }
            }
            return true
        }
        return {
            cartStore,
            carts,
            onScanned,
            ordersReadyForPickup,
            selectedOrder,
            onOrderSelected,
            onConfirm,
            onCancel,
        }
    },
})
</script>
<style scoped>
.content{
    display: flex;
    flex-direction: row;
    gap:0.5rem;
    height:calc(100vh - var(--header-height) - 6rem);
}
</style>
