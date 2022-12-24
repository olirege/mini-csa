<template>
    <div class="col- w25 h100 border-with-radius">
        <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
            <i class="bi bi-card-list"></i>
            <h3>Items</h3>
        </span>
        <div class="col- oflow-y-auto gap025 pd1top">
            <div id='item-row' class="row- pdsides1 center-space-between"
            :class="selectedItem.key == key ? 'bg-gry-lgt' : ''" 
            v-for="(item,key,index) in items" :key="index" 
            @click="$emit('load-drafts',{key:key,item:item})"
            @mouseover="chevron.push(key)" 
            @mouseleave="chevron = []">
                <h5>{{item.name}}</h5>
                <i  
                v-if="selectedItem.key == key ||
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
            'load-drafts'
        ],
        items:{
            type:Object,
            default:()=>{}
        },
        selectedItem:{
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
</style>
