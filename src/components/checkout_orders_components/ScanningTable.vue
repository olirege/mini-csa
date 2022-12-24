<template>
    <div id='content' class="col- w85 h100 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
            <h3>Scanning </h3>    
        </span>
        <div class="col- h100" v-if="selectedOrder && selectedOrder.data">
            <span class="row- border-bottom pd05 h10" >
                <span class="col-">
                    <span class="row- gap05">
                        <h5>Client:</h5>
                        <h5>{{selectedOrder.parent}}</h5>
                    </span>
                    <span class="row- gap05">
                        <h5>Order:</h5>
                        <h5>{{selectedOrder.oid}}</h5>
                    </span>
                </span>
            </span>
            <span class="pd05">
                <input
                placeholder="Scan here"
                @change="$emit('on-scanned',[$event])"/>
            </span>
            <div id='tables_wrapper' class="row- w100 pd05 gap1">
                <table class="w50">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                            <th>id</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in selectedOrder.data.items" :key="index">
                            <td>{{ index }}</td>
                            <td>
                                <img :src="getImageUrl(item)" alt="item image">
                            </td>
                            <td>{{item.name}}</td>
                            <td>{{item.qty}}</td>
                            <td>{{formatNumber(item.price)}}</td>
                            <td>{{formatNumber(item.qty * item.price)}}</td>
                            <td >
                                <TheTag :text=item.bid 
                                :code="matchCodeWithItem(selectedOrder.data.scannedItems,item) ? colors.success : colors.danger" />
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="6">Total</td>
                            <td id="table_total">{{formatNumber(selectedOrder.data.checkoutTotal)}}</td>
                        </tr>
                    </tfoot>
                </table>
                <table class="w50" id="scan_table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                            <th>ID</th>
                            <th>Substitute</th>
                        </tr>
                    </thead>
                    <tbody v-if="selectedOrder.data.scannedItems.length > 0">
                        <tr v-for="(item,index) in selectedOrder.data.scannedItems" :key="index">
                            <td>{{ index }}</td>
                            <td :class="{'bg-red': isScannedItemQtyOverItemQty(item.bid)}">{{item.qty}}</td>
                            <td id="prices-cell">
                                <tr v-for="(price,index) in item.prices" :key="index">
                                    <i class="bi bi-x"
                                    @click="onRemove(item,index)"></i>
                                    {{formatNumber(price/100)}}
                                </tr>
                            </td>
                            <td>{{formatNumber(sum(item.prices))}}</td>
                            <td >
                                <TheTag :text=item.bid 
                                :code="matchCodeWithItem(selectedOrder.data.items,item) ? colors.success : colors.danger" />
                            </td>
                            <td>
                                <select v-if="!matchCodeWithItem(selectedOrder.data.items,item)" v-model="item.substitute">
                                    <option v-for="(item,index) in selectedOrder.data.items" :value="item.bid" :key="index">{{item.bid}}</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="5">No items scanned</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5" >Total</td>
                            <td id="table_total">{{formatNumber(totalOfScannedItems)}}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div id="button_panel">
                <span class="row- w100 flex-end pd05rgt pd05bot gap05 align-center">
                    <h5 class="txt-med">Balance:</h5>
                    <TheTag :text="formatNumber(selectedOrder.data.checkoutTotal - totalOfScannedItems)" :code="colors.success"/>
                </span>
                <span class="col- end border-top pd05 bg-gry-lgt">
                    <span class="row- gap05">
                        <button @click="$emit('on-cancel')">Cancel</button>
                        <button @click="$emit('on-confirm')">Confirm</button>
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import {useHelperStore} from '../../stores/helpers'
import { useProductStore } from '../../stores/products'
import { computed } from 'vue'
import TheTag from '../common/TheTag.vue'
export default ({
    emits:['on-scanned','on-confirm', 'on-cancel'],
    props:{
        selectedOrder:{
            type: Object,
            required: true,
            default: () => {}
        }
    },
    components:{
        TheTag
    },
    setup(props) {
        const helper = useHelperStore()
        const colors = helper.colorCodes
        const productStore = useProductStore()
        const items = computed(()=>productStore.items)
        
        function sum(arr){
            let total = 0
            arr.forEach(element => {
                total += element/100
            });
            return total
        }
        
        const totalOfScannedItems = computed(()=>{
            let total = 0
            props.selectedOrder.data.scannedItems.forEach(item => {
                item.prices.forEach(price => {
                    total += price/100
                })
            })
            props.selectedOrder.data.scannedTotal = total
            return total
        })

        function isScannedItemQtyOverItemQty(bid){
            const item = props.selectedOrder.data.items.find(item => item.bid == bid)
            const scannedItem = props.selectedOrder.data.scannedItems.find(item => item.bid == bid)
            if(item && scannedItem && scannedItem.qty > item.qty){
                return true
            }
            return false
        }

        function matchCodeWithItem(array,item){
            const match = array.find(e => e.bid == item.bid)
            if(match){
                return true
            }else{
                return false
            }
        }
        function onRemove(item,index){
            item.prices.splice(index,1)
            item.qty--
            if(item.prices.length == 0 && item.qty == 0){
                props.selectedOrder.data.scannedItems.splice(props.selectedOrder.data.scannedItems.indexOf(item),1)
            }
        }
        
        function getImageUrl(item){
            if (items.value[item.iid] && items.value[item.iid].images){
                return items.value[item.iid].images.smallRef
            }
            else{
                return null
            }
        }

        return {
            formatNumber: helper.formatNumberToCurrency,
            sum,
            colors,
            isScannedItemQtyOverItemQty,
            matchCodeWithItem,
            onRemove,
            totalOfScannedItems,
            getImageUrl,
        }
    },
})
</script>
<style scoped>
#content{
    overflow:hidden;
}
table{
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    overflow:hidden;
}
thead tr{
    background-color: var(--color-border);
}
tfoot tr{
    border-top: 1px solid var(--color-border);
}
tbody{
    overflow-y: auto;
}
tbody tr{
    border-bottom: 1px solid var(--color-border);
}
tbody tr:last-child{
    border-bottom: none;
}
tfoot tr{
    max-height:2rem;
    background-color: var(--color-border);
}
tfoot td{
    border-bottom: none;
}
th, td{
    padding: 0.5rem;
    vertical-align: top;
    text-align:left;
    white-space:nowrap;
    border-bottom: 1px solid var(--color-border);

}
thead > tr > th,
tfoot > tr > td{
    height:2rem;
}

#button_panel{
    position: absolute;
    bottom: 0.75rem;
    right: 0;
    left: 0;
}
</style>
