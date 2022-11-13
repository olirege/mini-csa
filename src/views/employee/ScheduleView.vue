<template>
    <div class="page-wrapper">
        <div class="content">
            <div class='row' v-for="(value,key,index) in cartsDueForNext7DaysByDate" :key="index">
                {{key}}
                <div class='cart-detail' v-for="(cart,index) in value" :key="index">
                    {{cart.id}}
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
        const datesOfUpcomingDays = []
        
        for (let i = 0; i < 7; i++) {
            datesOfUpcomingDays.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i))
        }
        const cartsDueForNext7DaysByDate = ref(null)
        const productStore = useProductStore()
        const cartStore = useCartStore()
        cartStore.cartsDueForNext7Days()
        .then( () =>{
            cartsDueForNext7DaysByDate.value = pushDatesInObj()

        })

        function initObject() {
            const obj = {}
            datesOfUpcomingDays.forEach((date) => {
                let formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
                obj[formattedDate] = []
            })
            return obj
        }
        function pushDatesInObj(){
            const obj = initObject()
            cartStore.cartsDue.forEach((cart) => {
                let temp = cart.data.closesOn.toDate()
                let formattedDate = temp.getDate() + '/' + (temp.getMonth() + 1) + '/' + temp.getFullYear()
                if(Object.keys(obj).includes(formattedDate)){
                    obj[formattedDate].push(cart)
                }
            })
            return obj
        }
        return {
            cartsDueForNext7DaysByDate
        }
    },
})
</script>
<style scope>
.cart-detail{
    margin-left:1rem;
}
</style>