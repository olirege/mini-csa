<template>
    <div class="col- h100 w50 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-blu-lgt">
            <h3>{{ selectedDate.key }} Summary</h3>
        </span>
        <div class='h100 oflow-y-auto'>
            <div class="col- oflow-y-auto pd05">
                <div class="col- pd05">
                    <span class="row- gap05">
                        <h5>{{ selectedDate.key }}</h5>
                    </span>
                </div>
                <table v-if="selectedDate.key" class="h100">
                    <thead>
                        <tr>
                            <th>
                                <div>
                                    Image
                                </div>
                            </th>
                            <th>
                                <div>
                                    ID
                                </div>
                            </th>
                            <th>
                                <div>
                                    Name
                                </div>
                            </th>
                            <th>
                                <div>
                                    Price
                                </div>
                            </th>
                            <th>
                                <div>
                                    Quantity
                                </div>
                            </th>
                            <th>
                                <div>
                                    Subtotal
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,key,index) in dailySummary.items" :key=index>
                            <td id="image-cell">
                                <img :src="items[key].images.smallRef" alt="item image" />
                            </td>
                            <td>
                                {{ item.bid }}
                            </td>
                            <td>
                                {{ item.name }}
                            </td>
                            <td>
                                {{ formatNumber(item.price) }}
                            </td>
                            <td>
                                {{ item.qty }}
                            </td>
                            <td>
                                {{ formatNumber(item.total) }}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5">
                                Daily Total:
                            </td>
                            <td>
                                {{ dailyTotal }}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div v-else>
                    No Carts on this date
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {computed} from 'vue'
import {useProductStore} from '../../stores/products'
import {useHelperStore} from '../../stores/helpers'
export default({
    props:{
        selectedDate:{
            type:Object,
            default:()=>{}
        },
        dailySummary:{
            type:Object,
            default:()=>[]
        }
    },
    setup(props) {
        const productStore = useProductStore()
        const helperStore = useHelperStore()
        const items = computed(() => {
            return productStore.items
        })
        const dailyTotal = computed(() => {
            let total = 0
            Object.keys(props.dailySummary.items).forEach(iid => {
                total += props.dailySummary.items[iid].total
            })
            return helperStore.formatNumberToCurrency(total)
        })
        return {
            storeItems: items,
            formatNumber: helperStore.formatNumberToCurrency,
            dailyTotal,
            items
        }
    },
})
</script>
<style scoped>
table {
        width: 100%;
        border-collapse: collapse;
        border-top: 1px solid var(--color-border);
        white-space: nowrap;
    }
    th, td {
        border-bottom: 1px solid var(--color-border);
        height:2.4rem;
        padding:0.2rem;
    }
    th {
        text-align: left;
    }
    tfoot td {
        font-weight: 450;
    }
#image-cell {
    vertical-align: middle;
    text-align: center;
    padding-top: 0.5rem;
}
#image-cell img {
    border-radius: 0.2rem;
}
</style>
