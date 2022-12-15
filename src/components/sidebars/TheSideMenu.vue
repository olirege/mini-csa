<template>
    <div class="wrapper">
        <div class="content">
            <div class="title-wrapper">
                <img class="logo" src="">
                <h2 class="title">Test</h2>
            </div>
            <RouterLink class="profile" v-if="isLogged" :to="{name:'Profile'}">
                <i class="bi bi-house-door-fill"></i>
                <h3>Profile</h3>
            </RouterLink>
            <StorePanel v-if="isLogged" @scrollto="(pid)=>scrollToElement(pid)"/>
            <EmployeePanel v-if="isAdmin"/>
            <DevPanel/>
        </div>
    </div>
</template>
<script>
import EmployeePanel from '../sidemenu_components/EmployeePanel.vue'
import StorePanel from '../sidemenu_components/StorePanel.vue'
import DevPanel from '../sidemenu_components/DevPanel.vue'
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
export default({
    components: {
        StorePanel,
        EmployeePanel,
        DevPanel,
    },
    setup() {
        const userStore = useUserStore()
        const router = useRouter()
        const currentRouteName = computed(() => router.currentRoute.value.name)
        async function scrollToElement(pid){
            if(currentRouteName.value !== 'Store'){
                await router.push({name:'Store'})
                document.getElementById(pid).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
            }else if (currentRouteName.value === 'Store'){
                document.getElementById(pid).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
            }
        }
        
        return {
            isLogged: computed( () => userStore.isLogged),
            isAdmin: computed( () => userStore.isAdmin),
            scrollToElement,
        }
         
    },
})
</script>
<style scoped>
.wrapper {
    position:fixed;
    top: 0;
    left: 0;
    background-color: var(--color-sidemenu-bg);
    width: var(--sidemenu-width);
    height: 100%;
    border-right: 2px solid black;
    z-index: 2;
}
.content {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.title-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 3rem;
    padding-left: 10px; 
    border-bottom: 1px solid var(--color-sidemenu-border);
}
.profile{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap:0.5rem;
    padding-left:1rem;
    height: 3rem;
    border-bottom: 1px solid var(--color-sidemenu-border);
    color: var(--vt-c-primary);
    text-decoration: none;
}
.profile > h3{
    font-size: 0.8rem;
    font-weight: 600;
    padding-right: 10px;
}
.profile:hover{
    background-color: var(--color-sidemenu-hover);
    color: var(--vt-c-white);
}
.title-wrapper > .logo {
    width: 25px;
    height: 25px;
    margin-right: 10px;
    background-color: firebrick;
}
.title-wrapper  > .title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-sidemenu-text);
}
</style>
