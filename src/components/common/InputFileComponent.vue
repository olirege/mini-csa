<template>
    <span class='gap025' :class="{'row-':isRow, 'col-': !isRow, 'w100':isWidth100, 'wauto': !isWidth100}">
        <label :for="elementId">{{label}}: </label>
        <span class=" col- w100">
            <p v-if="hasError" class="ft-sml abs-top">{{errorMessage}}</p>
            <input class='w100 h2rem pd025' type="file" :accept="acceptType" :id="elementId" @change="onFileChange" :class="{error:hasError}"/>
        </span>
    </span>
</template>
<script>
import {ref} from 'vue'
export default ({
    emits: ['update:data'],
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
        acceptType: {
            types: String,
            required: true,
            default: "image/jpeg"
        },
        data: {
            required: false,
            default: ""
        }
    },
    setup(_,ctx){
        const hasError = ref(false)
        const errorMessage = ref('')
        const checkFile = (file) => {
            if(file.type === 'image/jpeg' || file.type === 'image/png'){
                return true
            }
            if(file.name.split('.').pop() === 'jpg' || file.name.split('.').pop() === 'png' || file.name.split('.').pop() === 'jpeg'){
                return true
            }
            if(file.size > 1000000){
                hasError.value = true
                errorMessage.value = 'File size is too large'
                return false
            }
            hasError.value = true
            errorMessage.value = 'File type is not supported'
            return false
        }
        const handleSelect = (data) => {
            ctx.emit('update:data', data)
        }

        const onFileChange = (e) => {
            const file = e.target.files[0];
            if(checkFile(file)){
                const data = {
                    preview:URL.createObjectURL(file),
                    file:file
                }
                handleSelect(data)
            }
        }

        return {
            onFileChange,
            hasError,
            errorMessage
        }
    }
})
</script>
