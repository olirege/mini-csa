<template>
    <div class="col- w25 h100 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
            <i class="bi bi-calendar-week"></i>
            <h3>Upcoming Dates</h3>
        </span>
        <div class="col- oflow-y-auto">
            <div id="week-summary-row" class="row- gap025 pd025 border-bottom" @click="$emit('on-check-weekly-summmary')">
                <i class="bi bi-calendar2"></i>
                <h5>Week Summary</h5>
            </div>
            <div id='item-row' class="row- pdsides1 pd05 border-bottom center-space-between"
            :class="selectedDate.key == key ? 'bg-gry-lgt' : ''" 
            v-for="(item,key,index) in dates" :key="index" 
            @click="$emit('on-load-date',{key:key,item:item,index:index})"
            @mouseover="chevron.push(key)" 
            @mouseleave="chevron = []">
                <h3>{{key}}</h3>
                <i  
                v-if="selectedDate.key == key ||
                chevron.includes(key)"
                class="bi bi-chevron-right"></i>
            </div>
        </div>
    </div>
</template> 
<script>
import {ref} from 'vue'
export default ({
    props:{
        emits: [
            'on-load-date',
            'on-check-weekly-summmary'
        ],
        dates:{
            type:Object,
            default:()=>{}
        },
        selectedDate:{
            type:Object,
            default:()=>{}
        }
    },
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
#week-summary-row{
    cursor:pointer;
    color: var(--vt-c-primary);
    font-weight: bolder;
    font-size: 1.2rem;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:flex-start;
}
#week-summary-row:hover{
    color: var(--vt-c-white);
    background-color: var(--color-border);
}
#week-summary-row i{
    font-size: 1rem;
}
</style>
