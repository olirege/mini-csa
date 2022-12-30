<template>
    <div class="col- h100 w50 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-blu-lgt">
            <h3>Weekly Summary</h3>
        </span>
        <div class='h100 oflow-y-auto'>
            <div class="col- oflow-y-auto pd05">
            <table>
                <thead>
                        <tr>
                            <th>
                                <div>
                                    #
                                </div>
                            </th>
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
                        <tr v-for="(item,key,index) in weeklySummary.items" :key=index>
                            <td>
                                {{ index + 1 }}
                            </td>
                            <td id="image-cell">
                                <img :src=items[key].images.smallRef alt="Item Image" />
                            </td>
                            <td>
                                {{ item.bid }}
                            </td>
                            <td>
                                {{ item.name }}
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
                                Weekly Total:
                            </td>
                            <td>
                                {{ formatNumber(weeklySummary.total) }}
                            </td>
                        </tr>
                    </tfoot>
                </table>
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
        weeklySummary:{
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
        return {
            storeItems: items,
            formatNumber: helperStore.formatNumberToCurrency,
            items,
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
