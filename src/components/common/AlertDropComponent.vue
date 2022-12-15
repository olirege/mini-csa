<template>
    <div 
    class="w100 flex center-space-between pdsides2 alert-drop"
    :style="{
        backgroundColor: color.dark,
        }">
        <p>{{message}}</p>
        <span
         @click="$emit('close-alert')">
        <i class="bi bi-x"></i>
        </span>
    </div>
</template>
<script>
import { useHelperStore } from '../../stores/helpers.js'
import { computed } from 'vue'
export default ({
    emits: ['close-alert'],
    props: {
        code: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const helperStore = useHelperStore()
        const colors = helperStore.colors
        const color = computed(() => {
            return colors[props.code]
        })

        return {
            helperStore,
            color,
        }
    },
})
</script>
<style scoped>
.alert-drop{
    position: fixed;
    top: var(--header-height);
    left: var(--sidemenu-width);
    width: calc(100% - var(--sidemenu-width));
    height: 3rem;
    color: var(--vt-c-white);
    z-index: 100;
}
</style>
