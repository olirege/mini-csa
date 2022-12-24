<template>
    <div id='content' class="row- gap1">
        <div class="col- w10 pd3top">
            <span class="hauto border-with-radius">
                <span class="row- center-start border-bottom pd05 gap05 border-radius-top bg-gry-lgt">
                    <h4>Search Filters</h4>
                </span>
                <span class="pd05">
                    <span class="row- center-space-evenly h1-5rem" v-for="column in columnsList" :key="column.name">
                        <label :for="column.name" class="w4rem">{{column.label}}</label>
                        <input type="checkbox" :id='column.name' :value="column.name" v-model="filters" class="w1rem">
                    </span>
                </span>
                <span class="row- center-start border-bottom pd05 gap05 border-radius-bot bg-gry-lgt">
                    <h4 @click="onClearFilters">Clear all</h4>
                </span>
            </span>
        </div>
        <div class="col- gap1 w90">
            <span>
                <input v-model="searchInput" class="w100" placeholder="Search..."/>
                <div class="input_tag_overlays row- gap025">
                    <p class="tag" v-for="filter in filters" :key="filter">{{filter}}</p>
                </div>
            </span>
            <table v-if="columnsList">
                <thead>
                    <tr>
                        <th class="column" v-for="column in columnsList" :key="column">
                            <span class="row- gap025">
                                {{column.label}}
                                <i class="bi bi-chevron-expand" @click="sortBy(column.name)"></i>
                            </span>
                        </th>
                        <th class="custom-header" v-if="hasTotal">
                            <span class="row- gap025">
                                Total
                                <i class="bi bi-chevron-expand" @click="sortBy('Total')"></i>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(result,key,index) in sortedData" :key="key" :class="{'bg-blk-lgtr': index % 2 == 0 }" @mouseover="addToShowEdit(key)" @mouseleave="removeToShowEdit">
                        <td v-for="(column,index) in columnsList" :key="column + '_' + key + '_' + index">
                            <div v-if="hasHtml(column.name)" v-html="applyCallback(column.name,result[column.name])"></div>
                            <div v-else>{{hasCallback(column.name) ? applyCallback(column.name,result[column.name]) : formatString(result[column.name],column.name)}}</div>
                        </td>
                        <td class="custom-cell" v-if="hasTotal">
                            {{formatNumber(result[totalFields[0]] * result[totalFields[1]])}}
                        </td>
                        <td class="edit-component" v-if="inShowEdit(key)">
                            <span class="row- gap1">
                                <i class="bi bi-pencil" @click="$emit('on-edit',{key:key,data:result})"></i>
                                <i class="bi bi-x"></i>
                            </span>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="hasTotal">
                    <tr>
                        <td :colspan="columnsList.length">
                            Total:
                        </td>
                        <td class="bg-wht">
                            {{formatNumber(total)}}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>
<script>
import {ref, computed} from 'vue'
import { useHelperStore } from '../../stores/helpers'
export default ({
    events:[
        'on-edit'
    ],
    props:{
        data:{
            type: Object,
            required: true,
        },
        columnsList:{
            type: Array,
            required: false,
        },
        defaultFilter:{
            type: String,
            required: true,
        },
        defaultSort:{
            type: String,
            required: true,
        },
        hasTotal: {
            type: Boolean,
            required:true
        },
        totalFields:{
            type: Array,
            required:false,
        }
    },
    setup(props) {
        const data = props.data
        const defaultFilter = props.defaultFilter
        const defaultSort = props.defaultSort
        const totalFields = props.totalFields
        const helper = useHelperStore()
        const searchInput = ref('')
        const filters = ref([])
        
        function hasCallback(column){
            if(!props.columnsList){
                return false
            }else{
                const columnObj = props.columnsList.find((item) => {
                    return item.name == column
                })
                if(columnObj.callback){
                    return true
                }else{
                    return false
                }
            }
        }
        function applyCallback(column,data){
            const columnObj = props.columnsList.find((item) => {
                return item.name == column
            })
            return columnObj.callback(data)
        }

        function onClearFilters(){
            filters.value = []
        }
        function hasHtml(column){
            const columnObj = props.columnsList.find((item) => {
                return item.name == column
            })
            if(columnObj.html){
                return true
            }else{
                return false
            }
        }
        function hasSearchBy(column){
            const columnObj = props.columnsList.find((item) => {
                return item.name == column
            })
            if(columnObj.searchBy){
                return true
            }else{
                return false
            }
        }
        const showEdit = ref([]);
        function inShowEdit(key){
            if(showEdit.value.includes(key)){
                return true
            }else{
                return false
            }
        }
        function addToShowEdit(key){
            if(!showEdit.value.includes(key)){
                showEdit.value[0] = key
            }
        }
        function removeToShowEdit(){
            showEdit.value = []
        }

        const searchResults = computed(()=>{
            let results = Object.entries(data).filter((item) => {
                if(filters.value.length == 0){
                    filters.value = [defaultFilter]
                } 
                for(let filter of filters.value){
                    if(hasSearchBy(filter)){
                        let specificSearch = props.columnsList.find((column) => {
                            if(column.name == filter){
                                return column
                            }
                        })
                        return specificSearch.searchBy(searchInput.value,item)
                    }
                    else if(item[1][filter].toLowerCase().includes(searchInput.value.toLowerCase())){
                        return item[1][filter]
                    }
                }
                
            })
            return Object.fromEntries(results)
        })
        
        function formatString(string,column){
            if(column.includes('cost')){
                return helper.formatNumberToCurrency(string)
            }else{
                if (typeof(string) == 'string'){
                    return helper.formatStringToSubstring(string,0,15)
                }
                if(string == null){
                    return ''
                }
                if(typeof(string) == 'number'){
                    return parseFloat(string.toFixed(2))
                }

            }
        }
        const sortKey = ref(defaultSort)
        const sortOrders = ref({})
        const sortedData = computed(()=>{
            const sortKeyName = sortKey.value
            const order = sortOrders.value[sortKeyName] || 1;
            const sorted = Object.entries(searchResults.value).slice().sort((a,b) => {
                a = data[a[0]][sortKeyName];
                b = data[b[0]][sortKeyName];
                return ( a == b ? 0 : a > b ? 1: -1) * order;
            })
            return Object.fromEntries(sorted)
        })
        function sortBy(key){
            sortKey.value = key;
            sortOrders.value[key] = sortOrders.value[key] * -1;
        }
        const total = computed(()=>{
            let total = 0
            Object.values(data).forEach(item => total += item[totalFields[0]] * item[totalFields[1]])
            return total
        })
        return{
            // columns,
            formatNumber: helper.formatNumberToCurrency,
            formatString,
            filters,
            onClearFilters,
            showEdit,
            inShowEdit,
            addToShowEdit,
            removeToShowEdit,
            searchInput,
            sortedData,
            sortBy,
            total,
            hasCallback,
            applyCallback,
            hasHtml,
        }
    },
})
</script>
<style scoped>
    /* #content{
    }
    table{
        border-collapse: collapse;
        border-spacing: 5rem;
    }
    thead{
        border-bottom: 2px solid var(--color-border);
    }
    th{
        padding: 0 0.25rem;
        padding-bottom: 1rem;
        text-align:left;
        white-space: nowrap;
    }
    td{
        padding:0.25rem;
        text-align:left;
        white-space: nowrap;
    }

    tfoot tr td{
        position:absolute;
        right:0;
        padding-top:1rem;
    } */
#content{
}
table{
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    overflow:hidden;
}
thead tr{
    background-color: var(--color-border);
}
tfoot tr{
    border-top: 1px solid var(--color-border);
}
tbody{
    overflow-y: auto;
}
tbody tr{
    border-bottom: 1px solid var(--color-border);
}
tbody tr:last-child{
    border-bottom: none;
}
tfoot tr{
    max-height:2rem;
    background-color: var(--color-border);
}
tfoot td{
    border-bottom: none;
}
th, td{
    padding: 0.5rem;
    vertical-align: top;
    text-align:left;
    white-space:nowrap;
    border-bottom: 1px solid var(--color-border);

}
thead > tr > th,
tfoot > tr > td{
    height:2rem;
}

.edit-component{
    position:absolute;
    width:100%;
    right:0;
}
.edit-component .row- i:hover{
    color: var(--vt-c-primary)
}
.custom-cell{
    text-align: left;
}
.input_tag_overlays{
    position:absolute;
    right:1rem;
    top:0.25rem;
}
.tag{
    background-color: var(--vt-c-primary);
    color: var(--vt-c-white);
    width:auto;
    padding: 0 1rem;
    border-radius: 10px;
}
</style>

