<template>
    <div class="countdown">
        <p>{{countdown}}</p>
    </div>
</template>
<script>
import { ref,computed, onMounted } from 'vue'

export default ({
    props: {
        start: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const seconds = ref(0)
        const countdown = computed(() => {
            const days = Math.floor(seconds.value / 86400)
            const remaining_seconds = seconds.value % 86400
            const date = new Date(remaining_seconds * 1000)
            const formatDay = days > 1 ? 'days' : 'day'            
            return `${days} ${formatDay} and ${date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                    })}`
        })
        onMounted(() => {
            setInterval(() => {
                const now = Date.now()
                const time_difference = props.start - now
                seconds.value = Math.floor(time_difference / 1000)
            }, 1000)
        })
        return {
            countdown
        }
    },
})
</script>
