<template>
    <div class="messagebox">
        <input class="w100 h2rem pd05 border-radius" v-model="message.content" placeholder="Write your message here"/>
        <i  class="bi bi-reply-fill" @click="onSend"></i>
    </div>
</template>
<script>
import { reactive } from 'vue'
import { useHelperStore } from '../../stores/helpers'

export default{
    name: 'MessageInput',
    emits: ['message-sent'],
    setup(_,ctx){
        const helperStore = useHelperStore()
        const message = reactive({
        })
        function onSend(){
            if(message.content){
                message.timestamp = helperStore.timestampFactory()
                let frozenBuffer = {...message}
                Object.freeze(frozenBuffer)
                ctx.emit('message-sent', frozenBuffer)
                message.content = ''
                message.timestamp = ''
            }
        }
        return {
            message,
            onSend
        }
    }
}
</script>
<style scoped>
.messagebox i{
    position:absolute;
    width: 2rem;
    background-color: var(--vt-c-primary);
    height: 2rem;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius: 0 5px 5px 50%;
    right:0;
    top:0;
    z-index: 99;
    color: var(--vt-c-white);
}
</style>