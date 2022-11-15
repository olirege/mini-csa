<template>
    <div class="page-wrapper">
        <h2 class="page-title">Employee Panel</h2>
        <div class="content-wrapper">
            <div class="content">
                <RouterView>
                    <router-link class="option" :to="{name:'crudproducts'}">CRUD Products</router-link>
                    <router-link class="option" :to="{name:'inventory'}">Inventory</router-link>
                    <router-link class="option" :to="{name:'orders'}">Orders</router-link>
                    <router-link class="option" :to="{name:'schedule'}">Schedule</router-link>
                    <router-link class="option" :to="{name:'reviews'}">Reviews</router-link>
                    <router-link class="option" :to="{name:'suppliers'}">Suppliers</router-link>
                </RouterView>
            </div>
        </div>
    </div>
</template>
<script>
</script>
<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
}
.page-title {
    font-size: 2rem;
    margin: 1rem;
}
.content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
}
.content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 1rem;
    width: 100%;
    height: 100%;
    padding: 1rem;
}
.option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 1rem;
}
</style>