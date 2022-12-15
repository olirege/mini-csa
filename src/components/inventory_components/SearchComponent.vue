<template>
    <div class="search-wrapper">
        <div class="search">
            <input placeholder="Search by item name" @change="onSearch" v-model="searchInput">
        </div>
        <span @click="onSearch">
            <i class="bi bi-search"></i>
        </span>
        <span @click="showFilterModal = !showFilterModal">
            <p>Filter</p>
            <i class="bi bi-funnel"></i>
            <div class='button-expand' v-if="showFilterModal" tabindex="0">
                <span>
                    <label for="name">Name</label>
                    <input type="checkbox" value="name" v-model="searchFields"/>
                </span>
                <span>
                    <label for="bid">ID</label>
                    <input type="checkbox" value="bid" v-model="searchFields"/>
                </span>
            </div>
        </span>
        <span>
            <i class="bi bi-arrow-repeat" @click="$emit('onsync')"></i>
        </span>
        <span>
            <i class="bi bi-arrow-down-up" @click.stop="(showSortModal = !showSortModal)"></i>
            <div class='button-expand' id="sort-tab" v-if="showSortModal" tabindex="0">
                <p v-for="(column,index) in columns" :key="index" class="txt-sml" @click="onSort(column.name) ">{{column.label}}</p>
            </div>
        </span>
    </div>
    <div class="tags" v-if="searchFields.length > 0">
        <div v-for="(field,index) in searchFields" :key="index" class="tag">
            <i class="bi bi-x" @click="onRemoveField(index)"></i>
            <p>{{field}}</p>
        </div>
    </div>
    <div class="subtitle" v-else>
        <p> No Search Filters applied</p>
    </div>
</template>
<script>
import { ref } from 'vue'
import { useProductStore } from '../../stores/products'
export default ({
    name: 'SearchComponent',
    emits: ['search','onsort','onsync'],
    props: {
        columns: {
            type: Array,
            required: true
        },
    },

    setup(_,ctx) {
        const searchInput = ref('')
        const searchFields = ref([])
        const productStore = useProductStore()        
        const items = productStore.items
        const iids = Object.keys(items)
        const showFilterModal = ref(false)
        const showSortModal = ref(false)
        const searchResults = ref([])

        function onSearch(){
            const search = searchInput.value
            searchResults.value = []
            if(search.length == 0) {
                return ctx.emit('search', '')
            }
            for (let i = 0; i < iids.length; i++) {
                const item = items[iids[i]]
                if (searchFields.value.length > 0) {
                    for (let j = 0; j < searchFields.value.length; j++) {
                        const field = searchFields.value[j]
                        if ( 
                            field === 'bid' || 
                            field === 'price' || 
                            field === 'stock' || 
                            field === 'min' || 
                            field === 'incart' || 
                            field === 'toscan' || 
                            field === 'topickup' || 
                            field === 'sold') {
                            if (item[field] && item[field].toString().includes(search.toString())) {
                                searchResults.value.push(item)
                            }
                        } else {
                            if (item[field].toLowerCase().includes(search.toLowerCase())) {
                                searchResults.value.push(item)
                            }
                        }
                    }
                } else {
                    if (item.name.toLowerCase().includes(search.toLowerCase())) {
                        searchResults.value.push(item)
                    }
                }
                ctx.emit('search', searchResults.value)
            }
            //sort by product name
            searchResults.value.sort((a,b) => {
                if (a.pid < b.pid) {
                    return -1
                }
                if (a.pid > b.pid) {
                    return 1
                }
                return 0
            })

        }
        function onSort(field){
            ctx.emit('onsort',field)
            showSortModal.value = false
        }
        function onRemoveField(field){
            searchFields.value.splice(searchFields.value.indexOf(field), 1)
        }
        return {
            onSearch,
            onSort,
            onRemoveField,
            searchInput,
            searchFields,
            showFilterModal,
            showSortModal,
            searchResults,

        }
    },
})
</script>
<style scoped>
.search-wrapper{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
}

.search-wrapper > span{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--vt-c-primary);
    color: var(--vt-c-white);
    border-radius: 0.5rem;
    font-size: 1.2rem;
    height: 2rem;
    width: auto;
    padding: 0 1rem;
    gap: 0.3rem;
    z-index: 102;
}
.search{
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
}
.tags{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.3rem;
    width:100%;
    flex-wrap: nowrap;
    overflow-x: hidden;
    margin: 0.5rem 0;
}
.subtitle{
    font-size: 0.8rem;
    font-weight: bold;
    font-style: italic;
    margin: 0.5rem 0;
    padding-left: 1rem
}
.tag{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: var(--vt-c-primary);
    color: var(--vt-c-white);
    border-radius: 0.5rem;
    font-size: 1rem;
    height: 1.8rem;
    width: auto;
    padding: 0 0.3rem;
    gap: 0.2rem;
}
.button-expand{
    position:absolute;
    left: 0;
    top: 2.1rem;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
    color: var(--vt-c-primary);
    border-radius: 10px;
    height: auto;
    width: 100%;
    row-gap: 0.1rem;
    z-index: 100;
    border: 1px solid var(--color-border);
}
#sort-tab{
    width: calc(100% + 2rem);
    left: -2rem;
}
.button-expand:focus{
    outline: none;
}
.button-expand p {
    width:100%;
    white-space: nowrap;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
}
.button-expand p:first-child{
    padding-top: 0.4rem;
    border-radius: 10px 10px 0 0;
}
.button-expand p:last-child{
    padding-bottom: 0.4rem;
    border-radius: 0 0 10px 10px;
}
.button-expand p:hover{
    cursor: pointer;
    background-color: var(--color-border);
}
.button-expand span{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap:1rem;
    width:100%;
    color: var(--vt-c-black);
    padding: 0.2rem;
}
.button-expand span label{
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
}
.button-expand span input{
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
    width:auto;
}
</style>