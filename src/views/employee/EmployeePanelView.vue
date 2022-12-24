<template>
    <ThePage>
        <template #content>
            <div class="content">
                <TheCard 
                v-for="(route,index) in routes" :key="index" 
                :id="route.name" 
                :hasImage="false" 
                @click="goTo(route.name)"
                class="custom-card-wrapper"
                >
                    <template #title>
                        <span class="custom-card-title" :style="{backgroundColor: route.bgColor}">
                            <i :class=route.icon></i>
                            <p>{{route.label}}</p>
                        </span>
                    </template>
                    <template #body>
                        <span class="custom-card-body">
                            <span class='card-data' v-for="(data,index) in route.data" :key="index">
                                <h4>{{data.label}}</h4>
                                <h1>{{data.num}}</h1>
                            </span>
                        </span>
                    </template>
                </TheCard>
            </div>
        </template>
    </ThePage>
</template>
<script>
import { useSuppliersStore } from '../../stores/suppliers'
import { useProductStore } from '../../stores/products'
import { useCartStore } from '../../stores/cart'
import { useReviewsStore } from '../../stores/reviews'
import { useHelperStore } from '../../stores/helpers'
import { useIngredientStore } from '../../stores/ingredients'
import { useRecipeStore } from '../../stores/recipes'
import { useRouter } from 'vue-router'
import TheCard from '../../components/common/TheCard.vue'
import ThePage from '../../components/common/ThePage.vue'
import { computed } from 'vue'
export default ({
    components: {
        TheCard,
        ThePage,
    },
    setup() {
        const suppliersStore = useSuppliersStore()
        suppliersStore.loadSuppliers()
        const productsStore = useProductStore()
        const cartStore = useCartStore()
        const helperStore = useHelperStore()
        const ingredientStore = useIngredientStore()
        ingredientStore.loadIngredients()
        const recipeStore = useRecipeStore()
        recipeStore.loadRecipes()
        const colors = helperStore.colors
        cartStore.getFullCartsDueToday()
        cartStore.getOrdersReadyForPickup()
        cartStore.getCartsDueForNext7Days()

        const reviewsStore = useReviewsStore()
        const router = useRouter()
        
        function goTo(route) {
            router.push({name:route})
        }

        const routes =  [ 
            {name:'Crudproducts', label:'CRUD Products',icon:'bi bi-pen', data: 
                [
                    { num: computed(() => productsStore.getAmountProducts), label: 'Products'},
                    { num: computed(() => productsStore.getAmountItems), label: 'Items'},
                ],
                bgColor: colors[0].dark
            },
            {name:'Finished Products', label:'Finished Products List', icon: 'bi bi-bar-chart-line', data:
                [
                    {num: computed(() => productsStore.getAmountProducts), label: 'Categories'},
                    {num: computed(() => productsStore.getAmountItemsCloseToMinimum), label: 'Shortages'},
                ],
                bgColor: colors[1].dark
            },
            {name:'Orders', label:'Orders', icon: 'bi bi-box-seam', data: 
                [
                    {num: computed(() => cartStore.getAmountCartsDueToday), label: 'Orders To Scan'},
                    {num: computed(() => cartStore.getAmountOrdersReadyForPickup), label: 'Orders Ready for Pickup'},

                ],
                bgColor: colors[2].dark
            },
            {name:'Schedule', label:'Schedule', icon: 'bi bi-calendar-week',data:
                [
                    {num: computed(() => cartStore.getAmountCartsDueForNext7Days), label: 'Carts Due For Next 7 Days'},
                ],
                bgColor: colors[3].dark
            },
            {name:'Reviews', label:'Reviews', icon: 'bi bi-chat-left-text', data: 
                [
                    {num: computed(() => reviewsStore.getAmountAllReviews), label: 'Reviews'},
                ],
                bgColor: colors[4].dark
            },
            {name:'Suppliers', label:'Suppliers', icon: 'bi bi-truck', data:
                [
                    {num: computed(() => suppliersStore.getAmountSuppliers), label: 'Suppliers'},
                ],
                bgColor: colors[5].dark
            },
            {name:'Ingredient List', label:'Ingredients', icon: 'bi bi-egg-fried', data:
                [
                    {num: computed(() => ingredientStore.getAmountIngredients), label: 'Ingredients'},
                ],
                bgColor: colors[6].dark
            },
            {name:'Recipes', label:'Recipes', icon: 'bi bi-card-list', data:
                [
                    {num: computed(() => recipeStore.getAmountRecipes), label: 'Recipes'},
                ],
                bgColor: colors[1].dark
            },
        ]
        return {
            routes,
            goTo
        }
    }
})
</script>
<style scoped>
.content {
    display: grid;
    grid-template-areas: "card1 card1" 
                         "card2 card3"
                         "card4 card4" 
                         "card5 card6"
                         "card7 card8";
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    /* grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); */
    /* grid-template-rows: repeat(auto-fill, minmax(200px, 1fr)); */
    grid-gap: 1rem;
    width: 100%;
    height: 100%;
    padding: 1rem;
}
#Orders {
    grid-area: card1;
}
#Inventory{
    grid-area: card2;
}
#Crudproducts{
    grid-area: card3;
}
#Schedule{
    grid-area: card4;
}
#Reviews{
    grid-area: card5;
}
#Suppliers{
    grid-area: card6;
}
#Ingredients{
    grid-area: card7;
}
#Recipes{
    grid-area: card8;
}

.custom-card-wrapper:hover{
    cursor: pointer;
    scale:1.005;
}

.custom-card-title{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1rem;
    font-weight: 400;
    border-radius: 5px 5px 0 0;
    width:100%;
    gap:0.5rem;
    height:100%;
    padding-left: 0.5rem;
    color:var(--vt-c-white);
}
.custom-card-body{
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 2rem;
    font-weight: 400;
    padding: 0 1rem;
    gap:0.5rem;
    width:100%;
}
.card-data{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap:0.5rem;
}
.card-data h4{
    font-size: 1.5rem;
    font-weight: 350;
}
.card-data h1{
    font-size: 4rem;
    font-weight: 400;
}
</style>