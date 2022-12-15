<template>
    <span class='gap05 h100' :class="{'row-':isRow, 'col-': !isRow, 'center': isRow, 'start': !isRow, 'w100':isWidth100, 'wauto': !isWidth100}">
        <label class="flex center h100 nowrap" :for="elementId">{{label}}: </label>
        <span class="row- gap1 w100 h100">
            <p v-if="hasError" class="ft-sml abs-top">{{errorMessage}}</p>
            <input class='w100 h2rem' 
            :type="inputType" 
            :id="elementId" 
            :placeholder="placeholder" 
            :min="min"
            :max="max"
            :step="step"
            :value="onInput"
            @input="handleSelect"
            :disabled="disableBuffer"
            :class="{
                'error': hasError,
                'isDisabled':disableBuffer}"
            />
            <i class="bi bi-pencil-fill" 
            v-if="toggleDisable" 
            @click="onDisable"
            ></i>
        </span>
    </span>
</template>
<script>
import {ref,computed} from 'vue'
export default ({
    emits: ['update:output'],
    props: {
        elementId: {
            type: String,
            required: true
        },
        label: {
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
        inputType: {
            types: String,
            required: true,
            default: "text"
        },
        output: {
            required: true,
            default: ""
        },
        placeholder: {
            required: true,
            default: ""
        },
        min: {
            required: false,
            default: 0
        },
        max: {
            required: false,
            default: 100,
        },
        sanitize: {
            required: false,
            default: true
        },
        step: {
            required: false,
            default: 1
        },
        input: {
            required: false,
            default: ""
        },
        outputModifiers: {
            required: false,
            default: () => ({})
        },
        toggleDisable: {
            required: false,
            default: false
        },

    },
    setup(props,ctx){
        const hasError = ref(false)
        const errorMessage = ref("")
        const isDisabled = computed(() => {
            if(props.toggleDisable){
                return true
            }
            else{
                return false
            }
        })
        const disableBuffer = ref(props.toggleDisable)
        const onDisable = () => {
            disableBuffer.value = !disableBuffer.value
        }
        const onInput = computed( () => {
            if(typeof props.input === "string" && props.inputType === "number"){
                return Number(props.input)
            }
            else{
                return props.input
            }
        })
        const sanitize = (value) => {
            if(props.sanitize){
                if(props.inputType === "number"){
                    if(typeof(value) === "string"){
                        if(value.includes(".")){
                            return parseFloat(value)
                        }else{
                            return parseInt(value)
                        }
                    }
                    if(value < props.min){
                        value = props.min
                        hasError.value = true
                        errorMessage.value = "Value must be greater than " + props.min
                    }
                    if(value > props.max){
                        value = props.max
                        hasError.value = true
                        errorMessage.value = "Value must be less than " + props.max
                    }
                    if(value % props.step !== 0){
                        value = Math.round(value / props.step) * props.step
                        hasError.value = true
                        errorMessage.value = "Value must be a multiple of " + props.step
                    }

                    if(!/^[0-9]+$/.test(value) && props.step === 1){
                        hasError.value = true
                        errorMessage.value = "Value must be a number"
                    }
                    if(!/^[0-9]+(\.[0-9]+)?$/.test(value) && props.step !== 1){
                        hasError.value = true
                        errorMessage.value = "Value must be a number"
                    }
                    else{
                        hasError.value = false
                        errorMessage.value = ""
                    }
                    if(props.step === 1){
                        return parseInt(value)
                    }
                    else{
                        return parseFloat(value)
                    }
                }
                if(props.inputType === "text"){
                    if(value.length > props.max){
                        value = value.substring(0,props.max)
                        hasError.value = true
                        errorMessage.value = "Value must be less than " + props.max + " characters"
                    }
                    if(/[^a-zA-Z0-9]/g.test(value)){
                        hasError.value = true
                        errorMessage.value = "Value must be alphanumeric"
                    }
                    else{
                        hasError.value = false
                        errorMessage.value = ""
                    }
                    return value
                }
                if(props.inputType === "email"){
                    if(value.length > props.max){
                        value = value.substring(0,props.max)
                        hasError.value = true
                        errorMessage.value = "Value must be less than " + props.max + " characters"
                    }
                    if(value.includes(" ")){
                        hasError.value = true
                        errorMessage.value = "Value must not contain spaces"
                    }
                    if(/[^a-zA-Z0-9@.]/g.test(value)){
                        hasError.value = true
                        errorMessage.value = "Value must be alphanumeric"
                    }
                    else{
                        hasError.value = false
                        errorMessage.value = ""
                    }
                }
                if(props.inputType === "password"){
                    if(value.length > props.max){
                        value = value.substring(0,props.max)
                        hasError.value = true
                        errorMessage.value = "Value must be less than " + props.max + " characters"
                    }
                    if(value.length < props.min){
                        value = value.substring(0,props.min)
                        hasError.value = true
                        errorMessage.value = "Value must be greater than " + props.min + " characters"
                    }
                    if(value.includes(" ")){
                        hasError.value = true
                        errorMessage.value = "Value must not contain spaces"
                    }
                    if(!/[^a-zA-Z0-9@#$%^&+=]/g.test(value)){
                        hasError.value = true
                        errorMessage.value = "Value must contain only alphanumeric characters and @#$%^&+="
                    }
                    else{
                        hasError.value = false
                        errorMessage.value = ""
                    }
                }
                if(props.inputType === "tel"){
                        if(value.length > props.max){   
                            value = value.substring(0,props.max)
                            hasError.value = true
                            errorMessage.value = "Value must be less than " + props.max + " characters"
                        }
                        if(value.includes(" ")){
                            hasError.value = true
                            errorMessage.value = "Value must not contain spaces"
                        }
                        if(!/\d+/g.test(value)){
                        hasError.value = true
                        errorMessage.value = "Value must contain only numbers"
                        }
                        else{
                            hasError.value = false
                            errorMessage.value = ""
                        }
                        return value
                    }
            }else{
                return value
            }
        }
        const handleSelect = (e) => {
            if(props.inputType != "file"){
                if(props.outputModifiers.capitalize){
                    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                }
                if(props.sanitize){
                    const data =  sanitize(e.target.value)
                    console.log(hasError.value)
                    if(!hasError.value){
                        ctx.emit('update:output',data)
                    }
                    else{
                        ctx.emit('update:output',"")
                    }
                }else{
                    ctx.emit('update:output', e.target.value)
                }
            }
        }
        return {
            handleSelect,
            hasError,
            errorMessage,
            onInput,
            onDisable,
            isDisabled,
            disableBuffer,
        }
    }
})
</script>
<style scoped>
.isDisabled{
    pointer-events: none;
    background-color: #ccc;
}
</style>
