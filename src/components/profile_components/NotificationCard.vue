<template>
    <TheCard :hasImage="false" :hasExtras="false" class="w40" :bodyStyle="'align-start'">
        <template #title>
            <h2 class="w100 pd1">Notifications:</h2>
        </template>
        <template #body>
            <div class="col- h100 w100 pd05">
                <span class="row- w100 align-center flex-start gap1 nowrap">
                    <label for="emailReminder">Receive Emails Reminder:</label>
                    <input id="emailReminder" type="checkbox" v-model="formBuffer.receiveEmailReminder"/>
                </span>
                <span class="w100 h100 flex end">
                    <TheTag :code="colorCodes.success" :size="'big'" :text="'Save'" @click="$emit('on-save',formBuffer)" />
                </span>
            </div>
        </template>
    </TheCard>
</template>
<script>
import TheCard from '../common/TheCard.vue'
import TheTag from '../common/TheTag.vue'
import { useHelperStore } from '../../stores/helpers'
import { reactive,ref } from 'vue'
export default ({
    emits:[
        'on-save'
    ],
    components:{
        TheCard,
        TheTag,
    },
    setup() {
        const helperStore = useHelperStore()
        const showAlert = ref(false)
        const colorCodes = helperStore.colorCodes
        const formBuffer = reactive({
            receiveEmailReminder: false,
        })
        return{
            formBuffer,
            showAlert,
            colorCodes,
        }
    },
})
</script>
<style scoped>
#emailReminder{
    max-width: 1rem;
}
</style>
