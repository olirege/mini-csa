<template>
    <div class="page-wrapper">
        <div class="content">
            <div class='row' v-for="(date,index) in cartsDueForNext5DaysByDate" :key="index">
                {{date}}
                <div v-for="(cart,index) in date" :key="index">
                    {{cart}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useProductStore } from '../../stores/products'
import { useCartStore } from '../../stores/cart'
export default ({

    setup() {
        const today = new Date()
        const datesofUpcomingDays = []
        
        for (let i = 0; i < 5; i++) {
            datesofUpcomingDays.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i))
        }
        const cartsDueForNext5DaysByDate = ref(null)
        const productStore = useProductStore()
        const cartStore = useCartStore()
        cartStore.cartsDueForNext5Days()
        .then( () =>{
            cartsDueForNext5DaysByDate.value = pushDatesInObj()

        })

        function initObject() {
            const obj = {}
            datesofUpcomingDays.forEach((date) => {
                obj[date] = []
            })
            return obj
        }
        function pushDatesInObj(){
            const obj = initObject()
            cartStore.cartsDue.forEach((cart) => {
                const date = cart.closesOn.toDate()
                obj[date].push(cart)
            })
            return obj
        }
        return {
            cartsDueForNext5DaysByDate
        }
    },
})
</script>