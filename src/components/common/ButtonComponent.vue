<template>
    <button :class="classes" :style="{
        backgroundColor:colors[code][shade],
        color: 'var(--vt-c-white)'}">{{text}}</button>
</template>
<script>
import {useHelperStore } from '../../stores/helpers'
export default {
    props: {
        code: {
            type: Number,
            required: true
        },
        shade: {
            type: String,
            required: false,
            default: 'dark'
        },
        text: {
            type: String,
            required: true
        },
        classes:{
            type: String,
            required: false,
            default: ''
        }
    },
    setup(){
        const helperStore = useHelperStore()
        const colors = helperStore.colors
        return {
            colors
        }
    }
}
</script>