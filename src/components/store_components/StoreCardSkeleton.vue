<template>
    <TheCard class="wrapper">
            <template #image>
                    <div id="card-image"></div>
            </template>
            <template #title>
                <span class="col- gap025">
                    <div class="txt-skeleton w4rem"></div>
                    <div class="txt-skeleton w2rem"></div>
                </span>
            </template>
            <template #body>
                <div class="col- gap025 w100">
                    <div class="row- txt-skeleton w100"></div>
                    <span class="row- w100 gap025 end">
                        <div class="txt-skeleton w4rem"></div>
                        <div class="txt-skeleton w2rem"></div>
                    </span>
                </div>
            </template>
            <template #extras>
                <span class="custom-buttons">
                    <div class="custom-button">
                    </div>
                    <div class="custom-button">
                    </div>
                </span>
            </template>
        </TheCard>
</template>
<script>
import TheCard from '../common/TheCard.vue'

export default ({
    components: {
        TheCard,
    },
})
</script>

<style scoped>
.txt-skeleton{
    background-color: var(--vt-c-secondary-dark);
    animation:pulse-bg 5s infinite;
    height: 1rem;
}
#card-image{
    width: 100%;
    height: 100%;
    background-color: var(--vt-c-secondary-dark);
    animation:pulse-bg 5s infinite;
}
.custom-buttons{
    display:flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    width:100%;
    height: 2rem;
}
.custom-button{
    width: 100%;
    height: 100%;
    background-color: var(--vt-c-secondary-dark);
    animation:pulse-bg 5s infinite;
}
 @keyframes pulse-bg{
        0%{
            background-color: var(--vt-c-secondary-dark);
        }
        50%{
            background-color: var(--vt-c-secondary);
        }
        100%{
            background-color: var(--vt-c-secondary-dark);
        }
    }
</style>