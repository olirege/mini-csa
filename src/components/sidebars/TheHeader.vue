<template>
    <header>
        <h3 v-if="isLogged"> Welcome {{profile.firstName}}</h3>
        <div>
            <RouterLink to="/" v-if="!isLogged">Login</RouterLink>
            <RouterLink to="/" v-if="isLogged">Logout</RouterLink>
            <span @click="switchLanguage">
                <h3>{{lang}}</h3>
            </span>
        </div>
    </header>
</template>
<script>
import { useUserStore } from '../../stores/user';
import { useTextStore } from '../../stores/text';
import { computed } from 'vue';

export default ({
    setup() {
        const userStore = useUserStore()
        const textStore = useTextStore()
        const profile = computed( () => userStore.userProfile)
        return{
            isLogged: userStore.isLogged,
            isAdmin: userStore.isAdmin,
            lang: computed(() => textStore.lang),
            switchLanguage: textStore.switchLanguage,
            profile,
        }
    },
})
</script>
<style scoped>
header {
  left: var(--sidemenu-width);
  display: flex;
  align-items: center;
  background-color: var(--vt-c-primary);
  min-height: var(--header-height);
  border-bottom: 1px solid var(--vt-c-component-bg-dark);
  box-shadow: 0 0 10px 0 var(--vt-c-component-bg-dark);
  width:calc(100% - var(--sidemenu-width));
  z-index: 1;
  padding: 0 1rem;
}
header > h3 {
  width: 10rem;
  color: var(--vt-c-white);
}
header > div {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin: 0 auto;
  gap: 1rem;
}
header > div > a {
  text-decoration: none;
  padding: 0.5rem;
  color: var(--vt-c-white);
}
header > div > span{
    display:flex;
    background: var(--vt-c-component-bg-dark);
    height: 2.1rem;
    width: 2.1rem;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.1rem;
    border: 1px solid var(--vt-c-white);
    cursor: pointer;

}
header > div > span > h3 {
  font-size: 1rem;
  color: var(--vt-c-white);
}
</style>