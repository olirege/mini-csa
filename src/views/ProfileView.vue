<template>
    <div>
        <h2>User Profile</h2>
        <p>{{userStore.userProfile}}</p>
    </div>
</template>
<script>
import { useUserStore } from '../stores/user'

export default ({
    setup() {
        const userStore = useUserStore()
        return {
            userStore,
        }
    },
})
</script>
