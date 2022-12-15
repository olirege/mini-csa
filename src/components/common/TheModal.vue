<template>
    <div class="background" :class="{nobackdrop: noBackdrop}">
        <div class="modal-wrapper" @click.self="$emit('close-modal')">
            <div class="modal" :style="{height: modalHeight, width: modalWidth }">
                <div class="modal-header" :style="{
                    backgroundColor: color,
                    }"
                    v-if="code">
                    <div class='modal-title'>
                        <slot name="header"></slot>
                    </div>
                    <button class="modal-close" @click="$emit('close-modal')">X</button>
                </div>
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
                <div class="modal-extras" v-if="hasExtras">
                    <slot name="extras"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { computed } from 'vue'
import { useHelperStore } from '../../stores/helpers.js'
export default ({
    emits: ['close-modal'],
    
    props: {
        modalHeight: {
            type: String,
            required: false
        },
        modalWidth: {
            type: String,
            required: false
        },
        code: {
            type: Number,
            required: false
        },
        noBackdrop: {
            type: Boolean,
            required: false
        },
        hasExtras: {
            type: Boolean,
            required: false
        }
    },
    setup(props){
        const helperStore = useHelperStore()
        const colors = helperStore.colors
        const color = computed(() => {
            if(props.code){
                return colors[props.code].dark
            }
        })
        return {
            color,
        }
    },
})
</script>
<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.nobackdrop{
    background-color: transparent;
}
.modal-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    width: 50%;
    height: auto;
    background-color: white;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width:100%;
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
    border-radius: 1rem 1rem 0 0;
    color: var(--vt-c-white);
}
.modal-title {
    font-size: 1.5rem;
    font-weight: bold;
    width:100%;
}
.modal-close {
    font-size: 1.5rem;
    width: 1.5rem;
    font-weight: bold;
    border: none;
    background-color: transparent;
    cursor: pointer;
}
.modal-body, .modal-extras{
    width:100%;
    height: 100%;
    padding: 1rem;
}
.modal-extras{
    display:flex;
    flex-direction: row;
}
</style>
