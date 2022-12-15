<template>
    <span class='gap025 h100 flex' :class="{'row-':isRow, 'col-': !isRow, 'center': isRow, 'start': !isRow, 'w100':isWidth100, 'wauto': !isWidth100}">
        <label class="flex center h100" :for="elementId">{{label}}: </label>
        <select class='w100 h2rem' :id="elementId" v-if="isObject" @input="handleSelect">
            <option selected="selected">{{placeholder}}</option>
            <option v-for="(option, choice, index) in options" :value="choice" :key="index">{{option[field]}}</option>
        </select>
        <select class='w100 h2rem' :id="elementId" v-if="!isObject" @input="handleSelect">
            <option selected="selected">{{placeholder}}</option>
            <option v-for="(choice, index) in options" :value="choice" :key="index">{{choice}}</option>
        </select>
    </span>
</template>
<script>
export default ({
    emits: ['update:choice'],
    props: {
        elementId: {
            type: String,
            required: true
        },
        isObject: {
            type: Boolean,
            required: true,
            default: true
        },
        label: {
            type: String,
            required: false,
            default: ""
        },
        options: {
            types: [Object, Array],
            required: true
        },
        field: {
            type: String,
            required: false,
            default: ""
        },
        isRow: {
            type: Boolean,
            required: true,
            default: false
        },
        isWidth100: {
            type: Boolean,
            required: true,
            default: true
        },
        choice: {
            required: false,
            default: ""
        },
        returnKeyVal: {
            type: Boolean,
            required: true,
            default: false
        },
        placeholder: {
            type: String,
            required: false,
            default: "Select an option"
        }
    },
    setup(props,ctx){
        const handleSelect = (e) => {
            if(props.returnKeyVal && props.isObject){
                ctx.emit('update:choice', {key:e.target.value,val:props.options[e.target.value]})
            }else{
                ctx.emit('update:choice', e.target.value)
            }
        }
        return {
            handleSelect
        }
    }
})
</script>
