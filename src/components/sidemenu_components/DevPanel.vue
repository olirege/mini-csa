<template>
    <div class="navigator" >
        <span class="subtitle-wrapper">
            <h3 class="subtitle">Dev</h3>
        </span>
        <div class="panel">
            <span class="panel-item" @click="AddFakeItems">
                <h5>Add Fake Items</h5>
                <i class="bi bi-chevron-down"></i>
            </span>
            <span class="panel-item" @click="RemoveFakeItems">
                <h5>Remove Fake Items</h5>
                <i class="bi bi-chevron-down"></i>
            </span>
            <span class="panel-item" @click="AddFakeIngredient">
                <h5>Add Fake Ingredient</h5>
                <i class="bi bi-chevron-down"></i>
            </span>
            <span class="panel-item" @click="RemoveFakeIngredient">
                <h5>Remove Fake Ingredient</h5>
                <i class="bi bi-chevron-down"></i>
            </span>
            <span class="panel-item" @click="AddFakeOrder">
                <h5>Add Fake Order</h5>
                <i class="bi bi-chevron-down"></i>
            </span>
            <span class="panel-item" @click="AddFakeActiveCart">
                <h5>Add Fake Cart</h5>
                <i class="bi bi-chevron-down"></i>
            </span>
            <span class="panel-item" @click="RemoveFakeCarts">
                <h5>Remove Fake Cart</h5>
                <i class="bi bi-chevron-down"></i>
            </span>
        </div>
    </div>
</template>
<script>
import { useHelperStore } from '../../stores/helpers';
import { useProductStore } from '../../stores/products';
import { useIngredientStore } from '../../stores/ingredients'
import densityTable from '../../stores/utils/density.json'
export default ({
    setup() {
        const helperStore = useHelperStore()
        const productStore = useProductStore()
        const items = productStore.items
        const ingredientStore = useIngredientStore()
        const pids = Object.keys(productStore.products)
        const imgs = ['7jf4eJVN2rkU6A7DZpCr','C8jtNGXtP6wA41ZvcC1o','IisV05Tkt9CV55USYMcp','M9tSQR3TlVT2Y50cTSax','N3wxBsughTD938q7wWOq','rQdseXI9dJQUs6uxhoMl']
        const uid = [
                    'dLdcms0fwLZGpx5KH1XHeoNuTq33',
                    'XBeDNNGGv6SgqDwDco4hxJ8cFWl2',
                    ]
            
        const units = [
            "milligrams",
            "grams",
            "kilograms",
            "ounces",
            "pounds",
            "milliliters",
            "liters",
            ]
        async function AddFakeItems() {
            let randomPid = pids[Math.floor(Math.random()*pids.length)]
            let randomImage = imgs[Math.floor(Math.random()*imgs.length)]
            let randomBid = Math.floor(100000 + Math.random() * 900000)
            let randomPrice = Math.random() * 100
            let randomQty = Math.floor(Math.random() * 100)
            const item = {
                name: 'Test Item',
                supplier: {
                    name: 'Test Supplier2',
                    sid: "6Do1UiWBX6R1iXGHBWSZ",
                },
                blurb: 'Test Blurb',
                description: "A test item is a question, problem, or activity used to evaluate a person's knowledge, skills, abilities, attitudes, or aptitudes. Test items can take many forms, such as multiple-choice questions, open-ended questions,performance tasks, or simulations.Test items are commonly used in educational and employment settings to assess a person's knowledge, skills, and abilities. For example, a teacher may use a test item to assess a student's understanding of a particular concept, or an employer may use a test item to evaluate a job applicant's aptitude for a particular job.",
                pid: randomPid,
                bid: randomBid,
                price: randomPrice,
                stock: randomQty,
                incart: 0,
                toscan: 0,
                topickup:0,
                sold:10,
                min:50,
                quota:10,
                unit: 'ea',
                rating: [5, 5, 5, 5, 5]
            }
            const images = {
                thumbnailRef: 'product_images/product_images_thumbnails/' + randomImage + '_150x150',
                fullImageref: 'product_images/' + randomImage,
                bigRef: 'product_images/product_images_thumbnails/'+ randomImage + '_500x500',
                smallRef: 'product_images/product_images_thumbnails/'+ randomImage + '_50x50',
            }
            const iid = await helperStore.addDoc('items', item)
            await helperStore.setDoc('images', iid, {
                    ...images,
                }
            )
            productStore.products[randomPid].items[iid] = { ...item, images }
        }
        function RemoveFakeItems() {
            helperStore.getCollectionWhere('items', 'name', '==', 'Test Item').then((items) => {
                Object.keys(items).forEach((item) => {
                    helperStore.deleteDoc('items', item)
                    helperStore.deleteDoc('images', item)
                    productStore.products[items[item].pid].items[item] = null
                })
            })
        }
        function AddFakeIngredient() {
            let randomWeight = Math.round(Math.random() * 100)
            let randomCost = Math.round(Math.random() * 100)
            let randomUnit = units[Math.floor(Math.random()*units.length)]
            let randomTypeKey = Object.keys(densityTable)[Math.floor(Math.random()*Object.keys(densityTable).length)]
            let randomDensity = densityTable[randomTypeKey]
            let randomQty = Math.floor(Math.random() * 100)
            let ingredient = {
                name: "Test Ingredient",
                brand: "Test Brand",
                weight: randomWeight,
                cost: randomCost,
                unit: randomUnit,
                qty: randomQty,
                type: randomTypeKey,
                density: randomDensity,
            }
            ingredientStore.createIngredient(ingredient)
        }
        function RemoveFakeIngredient() {
            helperStore.getCollectionWhere('ingredients', 'brand', '==', 'Test Brand').then((ingredients) => {
                Object.keys(ingredients).forEach((ingid) => {
                    helperStore.deleteDoc('ingredients', ingid)
                    ingredientStore.ingredients[ingid] = null
                })
            })
        }
        function AddFakeOrder(){
            let oid = Math.random().toString(36).substring(2, 15).toUpperCase();
            let cartStatus = 'checked-out'
            let randomUser = uid[Math.floor(Math.random()*uid.length)]
            // closes in a random amount of time with 7 days from now
            let closedOn = new Date()
            closedOn.setDate(closedOn.getDate() + Math.floor(Math.random() * 7))
            let createdAt = new Date()
            let openedOn = new Date()
            let randomItems = []
            let randomAmount = Math.floor(Math.random() * 10)
            let cartItems = []
            let checkoutTotal = 0
            for(let i = 0; i < randomAmount; i++){
                let randomItem = Object.keys(productStore.items)[Math.floor(Math.random()*Object.keys(productStore.items).length)]
                randomItems.push(randomItem)
            }
            randomItems.forEach(
                (item) => {
                    cartItems.push({
                        bid: items[item].bid,
                        iid: item,
                        name: productStore.items[item].name,
                        pid: items[item].pid,
                        price: productStore.items[item].price,
                        qty: Math.floor(Math.random() + 1 * 10),
                    })
                }
            )
            for(let i = 0; i < cartItems.length; i++){
                checkoutTotal += cartItems[i].price * cartItems[i].qty
            }
            const order = {
                cartStatus,
                items:cartItems,
                closedOn,
                createdAt,
                openedOn,
                scannedItems: [],
                scannedTotal: 0,
                checkoutTotal: checkoutTotal
            }
            helperStore.setDocInSubcollection('oldcarts',randomUser,'orders',oid,order)
        }
        function AddFakeActiveCart(){
            let randomCid = 'fake_' + Math.random().toString(36).substring(2, 15).toUpperCase();
            const cartStatus = 'active-with-items'
            let closesOn = new Date()
            closesOn.setDate(closesOn.getDate() + Math.floor(Math.random() * 7))
            let createdAt = new Date()
            let openedOn = new Date()
            let cartItems = []
            let randomItems = []
            let randomAmount = Math.floor(Math.random() * 10)
            if(randomAmount === 0) randomAmount = 1

            for(let i = 0; i < randomAmount; i++){
                let randomItem = Object.keys(productStore.items)[Math.floor(Math.random()*Object.keys(productStore.items).length)]
                randomItems.push(randomItem)
            }
            randomItems.forEach(
                (item) => {
                    let qty = Math.floor(Math.random() * 10)
                    if(qty === 0) qty = 1
                    cartItems.push({
                        bid: items[item].bid,
                        iid: item,
                        name: productStore.items[item].name,
                        pid: items[item].pid,
                        price: productStore.items[item].price,
                        qty: qty
                    })
                }
            )
            const cart = {
                cartStatus,
                items:cartItems,
                closesOn,
                createdAt,
                openedOn,
                scannedItems: [],
            }
            helperStore.setDoc('carts',randomCid,cart)
        }
        function RemoveFakeCarts(){
            helperStore.getDocs('carts').then((carts) => {
                Object.keys(carts).forEach((cid) => {
                    if(cid.includes('fake_')){
                        helperStore.deleteDoc('carts',cid)
                    }
                })
            })
                    
        }
        return {
            AddFakeItems,
            RemoveFakeItems,
            AddFakeIngredient,
            RemoveFakeIngredient,
            AddFakeOrder,
            AddFakeActiveCart,
            RemoveFakeCarts,
        }
    },
})
</script>

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