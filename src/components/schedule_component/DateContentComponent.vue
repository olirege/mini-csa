<template>
        <div class="col- h100 w25 border-with-radius">
            <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
                <i class="bi bi-calendar-day"></i>
                <h3 >{{ selectedDate.key ? selectedDate.key : "Orders" }}</h3>
            </span>
            <div class='h100'>
                <div class="col- oflow-y-auto">
                    <div id="day-summary-row" class="row- gap025 pd025 border-bottom" @click="$emit('on-check-day-summmary')">
                        <i class="bi bi-card-list"></i>
                        <h5>Day Summary</h5>
                    </div>
                    <div id='item-row' class="row- pdsides1 pd05 border-bottom center-space-between"
                    :class="selectedCart.key == item.id ? 'bg-gry-lgt' : ''" 
                    v-for="(item,key,index) in selectedDate.item" :key="index" 
                    @click="$emit('on-load-cart',{key:item.id,item:item})"
                    @mouseover="chevron.push(key)" 
                    @mouseleave="chevron = []">
                        <h5>{{item.id}}</h5>
                        <i  
                        v-if="selectedCart.key == item.id ||
                        chevron.includes(item.id)"
                        class="bi bi-chevron-right"></i>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import {ref} from 'vue'
export default({
    props:{
        selectedDate:{
            type:Object,
            default:()=>{}
        },
        selectedCart:{
            type:Object,
            default:()=>{}
        },
    },
    emits:[
    'on-load-cart',
    'on-check-day-summmary'
    ],
    setup(){
        const chevron = ref([])
        return{
            chevron,
        }
    }
})
</script>
<style scoped>
#item-row:hover{
    cursor:pointer;
    background-color: var(--color-border);
}
#item-row i{
    font-size: 0.7rem;
}
#day-summary-row{
    cursor:pointer;
    color: var(--vt-c-primary);
    font-weight: bolder;
    font-size: 1.2rem;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:flex-start;
}
#day-summary-row:hover{
    color: var(--vt-c-white);
    background-color: var(--color-border);
}
#day-summary-row i{
    font-size: 1rem;
}
</style>
