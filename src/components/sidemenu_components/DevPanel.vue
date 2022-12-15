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
        </div>
    </div>
</template>
<script>
import { useHelperStore } from '../../stores/helpers';
import { useProductStore } from '../../stores/products';
export default ({
    setup() {
        const helperStore = useHelperStore()
        const productStore = useProductStore()
        const pids = Object.keys(productStore.products)
        const imgs = ['7jf4eJVN2rkU6A7DZpCr','C8jtNGXtP6wA41ZvcC1o','IisV05Tkt9CV55USYMcp','M9tSQR3TlVT2Y50cTSax','N3wxBsughTD938q7wWOq','rQdseXI9dJQUs6uxhoMl']
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
        return {
            AddFakeItems,
            RemoveFakeItems,
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