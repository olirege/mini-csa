<template>
    <ThePage>
        <template #content>
            <div class="content">
                <h2>To Scan</h2>
                <div class="cards-wrapper" v-if="Object.keys(carts).length > 0">
                    <TheCard v-for="(cart,oid,index) in carts" :key="index" :hasImage='false' :isHeightDynamic="true">
                        <template #overlay>
                            <div class="custom-card-overlay">{{oid}}</div>
                            <input class="custom-card-overlay-input" placeholder="Scan barcode here" @change="onScanned($event, cart, oid)"/>
                        </template>
                        <template #title>
                            <div class="custom-card-title">
                                <div>
                                    <h2>Cart Items</h2>
                                </div>
                                <div>
                                    <h2>Scanned Items</h2>
                                </div>
                            </div>
                        </template>
                        <template #body>
                            <div class="query-wrapper">
                                <div class='query'>
                                    <TheCard v-for="(item,index) in cart.data.items" :key="index" :isSideways="true">
                                        <template #image>
                                            <img :src="getImageUrl(item)" alt="item image">
                                        </template>
                                        <template #title>
                                            <p>
                                                {{item.name}}
                                            </p>
                                        </template>
                                        <template #body>
                                            <span class="custom-card-body">
                                                <div class="bubble" :style="{backgroundColor: colors[2].dark}">
                                                    <p>{{item.qty}}</p>
                                                </div>
                                                <p>x</p>
                                                <div class="tag" :style="{backgroundColor: colors[0].dark}">
                                                    <p>{{formatNumber(item.price)}}</p>
                                                </div>
                                                <p>=</p>
                                                <div class="tag" :style="{backgroundColor: colors[0].light}">
                                                    <p>{{formatNumber(item.qty * item.price)}}</p>
                                                </div>
                                            </span>
                                        </template>
                                        <template #extras>
                                            <div class='tag' 
                                            :id="oid + item.bid"
                                            :style="{backgroundColor:matchCodeWithItem(cart.data.scannedItems,item.bid)
                                                ? colors[7].light : colors[1].dark}">
                                                <p>{{item.bid}}</p>
                                            </div>
                                        </template>
                                    </TheCard>
                                </div>
                                <div class="scanned-items">
                                    <TheCard :hasImage='false' 
                                    :hasTitle="false" 
                                    :hasExtras="false" 
                                    :isSideways="true" 
                                    v-for="(item,index) in cart.data.scannedItems" 
                                    :key="index">
                                        <template #body>
                                            <span class="scanned-item">
                                                <p class="tag" 
                                                :id="item.bid + oid"
                                                :style="{backgroundColor:matchCodeWithItem(cart.data.items,item.bid)
                                                ? colors[7].light : colors[1].dark}">{{item.bid}}</p>
                                                <span v-if="!matchCodeWithItem(cart.data.items,item.bid)">
                                                    <p> => </p>
                                                    <select v-model="item.substitute">
                                                        <option v-for="(item,index) in cart.data.items" :key="index">{{item.bid}}</option>
                                                    </select>
                                                </span>
                                                <p class="bubble" 
                                                :style="{backgroundColor:isScannedItemQtyOverItemQty(cart,item.bid) 
                                                ? colors[1].dark : colors[7].light}">
                                                {{item.qty}}</p>
                                            </span>
                                            <div class="tags"
                                            :id="'card_' + item.bid + oid">
                                                <span 
                                                v-for="(price,index) in item.prices" 
                                                :key='index'>
                                                <p class="tag">{{formatNumber(price/100)}}</p>
                                                <div @click="onRemove(cart.data.scannedItems,item,index)">
                                                    <i class="bi bi-x"></i>
                                                </div>
                                                </span>
                                            </div>
                                        </template>
                                    </TheCard>
                                </div>
                            </div>
                        </template>
                        <template #extras>
                            <div class="custom-card-extras">
                                <div class="totals">
                                    <div>
                                        <p>
                                            {{formatNumber(cart.data.checkoutTotal)}}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            {{cart.data.scannedItems[0]? formatNumber(totalOfScannedItems(cart.data.scannedItems)): formatNumber(0)}}
                                        </p>
                                        <p>
                                            Customer balance: {{formatNumber((cart.data.checkoutTotal)-totalOfScannedItems(cart.data.scannedItems))}}
                                        </p>
                                    </div>
                                </div>
                                <div class="buttons">
                                    <button @click="onCancel(cart)" :style="{backgroundColor: colors[0].light}">Cancel</button>
                                    <button @click="onConfirm(cart,oid)" :style="{backgroundColor: colors[7].dark}">Confirm</button>
                                </div>
                            </div>
                        </template>
                    </TheCard>
                </div>
                <div v-else>
                    <p>No carts to scan</p>
                </div>
            </div>
            <div class="content">
                <h2>Scanned orders</h2>
                <div class="cards-wrapper" v-if="Object.keys(ordersReadyForPickup).length > 0">
                    <TheCard v-for="(cart,oid,index) in ordersReadyForPickup" 
                    :key="index" 
                    :hasImage='false' 
                    :isHeightDynamic="true">
                        <template #body>
                            <h3>{{oid}}</h3> 
                            <h3>{{cart.data.scannedItems.length}} items </h3>
                            <h3>{{formatNumber(cart.data.scannedTotal)}} </h3>
                            <i class="bi bi-chevron-down" @click="isCollapsed(oid)"></i>
                        </template>
                        <template #extras>    
                            <div v-if="inCollapsed(oid)">
                                <span v-for="(item,index) in cart.data.scannedItems" :key="index">
                                    <p>{{items[item.iid].name}}</p>
                                    <p>{{item.qty}}</p>
                                    <p>{{item.bid}}</p>
                                </span>
                            </div>
                        </template>
                    </TheCard>
                </div>
                <div v-else>
                    <p>No orders scanned ready for pickup</p>
                </div>
            </div>
        </template>
    </ThePage>
</template>
<script>
import { useCartStore } from '../../stores/cart'
import { useProductStore } from '../../stores/products'
import { useHelperStore } from '../../stores/helpers'
import {ref, computed} from 'vue'
import ThePage from '../../components/common/ThePage.vue'
import TheCard from '../../components/common/TheCard.vue'
export default ({
    components: {
        ThePage,
        TheCard
    },
    setup() {
        const cartStore = useCartStore()
        const productStore = useProductStore()
        const helperStore = useHelperStore()
        const products = computed(() => productStore.products)
        const items = computed(() => productStore.items)
        const carts = computed(() => cartStore.carts)
        const ordersReadyForPickup = computed(() => cartStore.ordersReadyForPickup)
        const search = ref(null)
        const colors = helperStore.colors
        const collapsed = ref([])

        function inCollapsed(oid) {
            return collapsed.value.includes(oid)
        }
        function isCollapsed(oid) {
            if (collapsed.value.includes(oid)) {
                collapsed.value = collapsed.value.filter(item => item !== oid)
            } else {
                collapsed.value[0] = oid
            }
        }
        function getImageUrl(item){
            if (products.value[item.pid].items[item.iid] && products.value[item.pid].items[item.iid].images){
                return products.value[item.pid].items[item.iid].images.smallRef
            }
            else{
                return null
            }
        }
        function onScanned(e,cart,oid){
            console.log(e.target.value)
            const id = e.target.value
            if(id.length == 12){
                const {bid,price,_}  = barCodeParser(id)
                resetInput(e.target)
                if(isAlreadyScanned(bid,cart)){
                    const indx = cart.data.scannedItems.findIndex(item => item.bid == bid)
                    cart.data.scannedItems[indx].qty++
                    cart.data.scannedItems[indx].prices.push(price)
                }
                else{
                    cart.data.scannedItems.push({
                        iid: cartStore.returnIid(bid),
                        bid,
                        substitute: null,
                        qty: 1,
                        prices: [price]
                    })
                }
            }
        }
        function onCancel(cart){
            cart.data.scannedItems = []
        }
        function onConfirm(cart,oid){
            if(!cartStore.isOrderCompleted(oid)){
                cart.data.scannedTotal = totalOfScannedItems(cart.data.scannedItems)
                cartStore.ordersReadyForPickup[oid] = cart
                cart.data.cartStatus = "ready-for-pickup"
                cartStore.updateOrder(cart,oid)
                delete carts.value[oid]                
            }
        }
        function totalOfCart(items){
            let total = 0
            items.forEach(item => {
                total += item.qty * item.price
            })
            return total
        }
        function totalOfScannedItems(scannedItems){
            let total = 0
            scannedItems.forEach(item => {
                item.prices.forEach(price => {
                    total += price/100
                })
            })
            return total
        }
        function onRemove(scannedItems,item,index){
            item.prices.splice(index,1)
            item.qty--
            if(item.prices.length == 0 && item.qty == 0){
                scannedItems.splice(scannedItems.indexOf(item),1)
            }
        }
        function isScannedItemQtyOverItemQty(cart,bid){
            const item = cart.data.items.find(item => item.bid == bid)
            const scannedItem = cart.data.scannedItems.find(item => item.bid == bid)
            if(item && scannedItem && scannedItem.qty > item.qty){
                return true
            }
            return false
        }
        function matchCodeWithItem(array,bid){
            const item = array.find(item => item.bid == bid)
            if(item){
                return true
            }
            return false
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
        return {
            cartStore,
            carts,
            search,
            getImageUrl,
            onScanned,
            formatNumber: helperStore.formatNumberToCurrency,
            colors,
            onRemove,
            totalOfCart,
            totalOfScannedItems,
            onCancel,
            onConfirm,
            isScannedItemQtyOverItemQty,
            matchCodeWithItem,
            ordersReadyForPickup,
            isCollapsed,
            inCollapsed,
            items,
        }
    },
})
</script>
<style scoped>
.content{
    display: flex;
    flex-direction: column;
    gap:3rem;
    margin-top: 2rem;
}
.custom-card-overlay{
    position:absolute;
    top:-2rem;
    left:0;
    background-color: #3c8dbc;
    align-items: center;
    justify-content: flex-start;
    display:flex;
    color: var(--vt-c-white);
    z-index: 4;
    height: 2rem;
    border-radius: 5px 5px 0 0;
    padding: 0 1rem;
}
.custom-card-overlay-input{
    position:absolute;
    top: -2rem;
    right: 0;
    width: 10rem;
}
.custom-card-body{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    width: 100%;
}
.query-wrapper{
    display:flex;
    flex-direction: row;
    gap:1rem;
    width:100%;
    padding:0.5rem;
}
.query-wrapper input{
    width: 8rem;
}
.query{
    display:flex;
    flex-direction: column;
    height:100%;
    width:100%;
}
.scanned-items{
    display:flex;
    flex-direction: column;
    height:100%;
    width:100%;
}
.scanned-item{
    display:flex;
    flex-direction: row;
    height:100%;
    width:100%;
    justify-content: space-between;
    align-self: flex-start;
    padding-right: 2rem;
}
.scanned-item:first-child{
    margin-top: 0.3rem;
}
.scanned-item > span{
    display:flex;
    flex-direction: row;
    gap: 2.2rem;
}
.scanned-item > span > p{
    display:flex;
    align-items: center;
}

.bubble{
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--vt-c-primary);
    color: var(--vt-c-white);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
}
.tag{
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--vt-c-primary);
    color: var(--vt-c-white);
    border-radius: 10px;
    width: 5rem;
    height: 2rem;
}
.tags{
    display:flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.3rem 0;
}
.tags span{
    display:flex;
    flex-direction: row;
    gap: 0.5rem;
}
.tags span > div{
    display:flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
}
.custom-card-extras {
    display:flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width:100%;
    padding: 0 0.5rem;
}
.totals,
.custom-card-title{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    width:100%;
    padding: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0;
}
.custom-card-title > div,
.custom-card-title > div > h2{
    width:100%;
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
}

.totals > div,
.totals > div{
    width:100%;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
}
.totals > div > p{
    width:auto;
    white-space: nowrap;
}
.custom-card-extras > .buttons{
    display:flex;
    flex-direction: row;
    justify-content: flex-end;
    align-self: flex-end;
    gap: 1rem;
    width:20%;
}
</style>
