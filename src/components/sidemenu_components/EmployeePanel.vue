<template>
    <div class="navigator" >
                <RouterLink class="subtitle-wrapper" :to="{name:'Employee Panel'}">
                    <h3 class="subtitle">Employee Panel</h3>
                    <i class="bi bi-eye-fill"></i>
                </RouterLink>
                <div class="panel">
                    <RouterLink class="panel-item" :to="{name:'Crudproducts'}">
                        <h5>Manage Products</h5>
                        <i class="bi bi-chevron-down"></i>
                    </RouterLink>
                    <RouterLink class="panel-item" :to="{name:'Finished Products'}">
                        <h5>Finished Products</h5>
                        <i class="bi bi-chevron-down"></i>
                    </RouterLink>
                    <RouterLink :to="{name:'Orders'}" class="panel-item">
                        <h5>Today's Orders</h5>
                        <i class="bi bi-chevron-down"></i>
                    </RouterLink>
                    <RouterLink class="panel-item" :to="{name:'Schedule'}">
                        <h5 >Schedule</h5>
                        <i class="bi bi-chevron-down"></i>
                    </RouterLink>
                    <RouterLink class="panel-item" :to="{name:'Suppliers'}">
                        <h5>Suppliers</h5>
                        <i class="bi bi-chevron-down"></i>
                    </RouterLink>
                    <RouterLink class="panel-item" :to="{name:'Reviews'}">
                        <h5>Reviews</h5>
                        <i class="bi bi-chevron-down"></i>
                    </RouterLink>
                </div>
            </div>
</template>
<style scoped>
.navigator {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    padding: 0.5rem;
}
.navigator .subtitle-wrapper {
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width:100%;
    margin-bottom: 0.5rem;
    padding-right: 0.5rem;
    cursor: pointer;
    text-decoration: none;
}
.subtitle-wrapper i:hover {
    color: var(--vt-c-white);
}
.subtitle-wrapper i{
    color: var(--color-sidemenu-subtitle)
}
.navigator .subtitle{
    font-size: 0.8rem;
    color: var(--color-sidemenu-subtitle);
    margin-left: 5px;
}

.panel{
    display:flex;
    width: 100%;
    flex-direction: column;
}
.panel :first-child{
    border-radius: 10px 10px 0 0;
}
.panel :last-child{
    border-radius: 0 0 10px 10px;
}
.panel-item{
    display:flex;
    height: 2rem;
    width: 100%;
    background-color: rgb(255,255,255, 0.1);
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
    color: var(--vt-c-white);
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    text-decoration: none;
}
.panel-item:hover{
    background-color: rgb(255,255,255, 0.2);
}
</style>