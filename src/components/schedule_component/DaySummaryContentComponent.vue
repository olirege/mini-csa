<template>
    <div class="col- h100 w50 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
            <i class="bi bi-person-lines-fill"></i>
            <h3>Day Summary</h3>
        </span>
        <div class='h100'>
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
                                <img alt="item image" />
                            </td>
                            <td>
                                id
                            </td>
                            <td>
                                {{ key }}
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
                        <tr colspan=5>
                            <td>
                                <div>
                                    Day Total:
                                </div>
                            </td>
                            <td>
                                {{ formatNumber(dailyTotal) }}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div v-else>
                    No Carts on this date
                </div>
                {{ dailySummary }}
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
            type:Array,
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
            for(let i = 0; i < props.dailySummary.length; i++){
                total += props.dailySummary[i].total
            }
            return total
        })
        return {
            storeItems: items,
            formatNumber: helperStore.formatNumberToCurrency,
            dailyTotal,
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
