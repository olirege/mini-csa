<template>
    <div class="tag-base" :class="{
        'tag-big': size === 'big',
        'tag-sml': size === 'sml'
    }" 
    :style="{backgroundColor: color.lighter, color: color.dark, border: '1px solid ' + color.light }">
        <span class="tag__text">
            {{text}}
            <i v-if="hasClose" class="bi bi-x-circle-fill" @click="removeTag"></i>
        </span>
    </div>
</template>
<script>
import { useHelperStore } from '../../stores/helpers'
import { computed } from 'vue'
export default ({
    props:{
        text: {
            type: String,
            required: true
        },
        code: {
            type: Number,
            required: true
        },
        hasClose: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'big',
            validator: (value) => {
                return ['big', 'sml'].includes(value)
            }
        }
    },
    setup(props) {
        const helperStore = useHelperStore()
        const colors = helperStore.colors
        const color = computed(() => colors[props.code])
        return {
            color
        }
    },
})
</script>
<style scoped>

.tag-base{
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    border-radius: 1rem;
    color: var(--vt-c-white);
}
.tag-big {
    height: 1.5rem;
}
.tag-sml {
    height: 1.1rem;
}

.tag__text{
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 0.50rem;
    padding-right: 0.50rem;
}
</style>
