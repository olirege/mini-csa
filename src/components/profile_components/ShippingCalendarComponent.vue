<template>
    <div class="row- gap05 flex-center h100">
        <div v-for="(day,index) in days" :key="day" class="col- border-with-radius pdsides1 w4rem h45rem">
            <h5 class="h100 flex center">{{day.substring(0,3)}}</h5>
            <span class="w100 flex h100 center">
                <span class="col- nowrap center" 
                v-if="daysOpen.includes(day) && selectedDay">
                    <p class="txt-smlr" v-if="index == days.indexOf(selectedDay) - 4">Start</p>
                    <p class="txt-smlr" v-if="index != days.indexOf(selectedDay) - 1 && 
                    index != days.indexOf(selectedDay) - 4">Open</p>
                    <p class="txt-smlr" v-if="index == days.indexOf(selectedDay) - 1">Last</p>
                    <i class="bi bi-cart-plus h100"></i>
                </span>
                <span class="col- nowrap center" v-if="index === days.indexOf(selectedDay)">
                    <p class="txt-smlr">Store Pickup</p>
                    <i class="bi bi-box2-heart-fill h100"></i>
                </span>
            </span>
        </div>
    </div>
</template>
<script>
import { computed } from 'vue'
export default ({
    props: {
        selectedDay: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const daysOpen = computed(() => {
            let daysOpen = days.value.slice(0, days.value.indexOf(props.selectedDay))
            return daysOpen
        })
        const days = computed(() => {
            const startDate = daysOfTheWeek.indexOf(props.selectedDay);
            let carousel = daysOfTheWeek.slice(startDate+3, daysOfTheWeek.length).concat(daysOfTheWeek.slice(0, startDate+3));
            if (startDate + 3 > daysOfTheWeek.length){
                carousel = daysOfTheWeek.slice(startDate+3 - daysOfTheWeek.length, daysOfTheWeek.length)
                .concat(daysOfTheWeek.slice(0, startDate+3 - daysOfTheWeek.length));
            }

            return carousel;
        })
        return {
            days,
            daysOpen
        }
    },
})
</script>
