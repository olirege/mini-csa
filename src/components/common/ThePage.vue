<template>
    <div class="page-wrapper" :class="{'page-wrapper-cart':hasCartBar}">
        <div class="page-title-wrapper" v-if="hasTitle">
            <h3 class="page-title">{{title? title : currentRouteName}}</h3><h3 class="page-title pd1lft" v-if="id">#{{id}}</h3>
        </div>
        <div class="header" v-if="hasHeader">
            <slot name="header"></slot>
        </div>
        <div class="content-wrapper">
            <slot name="content"></slot>
        </div>
        <div class="footer" v-if="hasFooter">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
export default({
    props:{
        hasHeader: {
            type: Boolean,
            default: false,
            required: false

        },
        hasFooter: {
            type: Boolean,
            default: false,
            required: false
        },
        hasCartBar: {
            type: Boolean,
            default: false,
            required: false
        },
        id: {
            type: String,
            required: false
        },
        hasTitle: {
            type: Boolean,
            default: true,
            required: false
        },
        title: {
            type: String,
            required: false
        }
    },
    setup() {
        const router = useRouter()
        const currentRouteName = computed(() => router.currentRoute.value.name)
        return {
            currentRouteName,
        }
    },
})
</script>
<style scoped>
.page-wrapper {
    top: var(--header-height);
    display: block;
    align-items: center;
    justify-content: center;
    width: calc(100% - var(--sidemenu-width));
    height: calc(100% - var(--header-height) - var(--footer-height));
    padding: var(--page-padding);
}
.page-wrapper-cart {
    width: calc(100% - var(--sidemenu-width) - var(--cart-width));
}
.page-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 2rem;
    border-bottom: 2px solid var(--color-border);
    margin-bottom: 1rem;
}
.page-title-wrapper .pd1lft {
    padding-left: 1rem;
}
.page-title {
    margin:0;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    text-align: center;
}
.content-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.header {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 5rem;
}
.footer {
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>
