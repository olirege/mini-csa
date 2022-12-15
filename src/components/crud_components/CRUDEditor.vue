<template>
    <div class="header">
        <div class="header-content">
            <i :class=icon></i>
            <h1 class="header-title">
                <slot name="title"></slot>
            </h1>
        </div>
    </div>
    <div class="preview-group">
        <h3 class="margin-spacer-sml">{{object}} Preview</h3>
        <div class="border-with-radius w100 h100 flex center">
            <slot name="preview"></slot>
        </div>
    </div>
    <div v-if=" mode == 'edit'" class="margin-bottom-med col- gap05">
        <h3 class="margin-spacer-sml">Load {{object}}</h3>
        <div class="form-group">
                    <slot name="edit"></slot>
        </div>
    </div>
    <div class="margin-bottom-med col- gap05">
        <h3 class="margin-spacer-sml"> {{object}} Details</h3>
        <div class="col- w100 gap1">
            <slot name="form"></slot>
        </div>
    </div>
    <div class="row- h2rem w100">
        <slot name="buttons"></slot>
    </div>
</template>
<script>
export default ({
    props: {
        icon: {
            type: String,
            required: false
        },
        object: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            required: true
        }

    },
})
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
.header-content {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    gap: 0.7rem;
}

.header-title {
    font-size: 1.4rem;
    font-style:italic;
    font-weight: 400;
    color: #333;
}
</style>