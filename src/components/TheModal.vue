<template>
    <div class="background">
        <div class="modal-wrapper" @click.self="$emit('close-modal')">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <slot name="header"></slot>
                    </h2>
                    <button class="modal-close" @click="$emit('close-modal')">X</button>
                </div>
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default ({
    emits: ['close-modal'],
    setup(){
        return {
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
.modal-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    width: 50%;
    height: 80%;
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
    padding: 1rem;
}
.modal-title {
    font-size: 1.5rem;
    font-weight: bold;
}
.modal-close {
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    background-color: transparent;
    cursor: pointer;
}
.modal-body {
    width:100%;
    height: 100%;
    padding: 1rem;
}
</style>
