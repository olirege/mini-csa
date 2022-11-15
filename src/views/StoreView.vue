<script>
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import {useUserStore} from '../stores/user'
import { computed } from 'vue';
export default ({
    setup() {
        const productStore = useProductStore()
        const cartStore = useCartStore()
        const userStore = useUserStore()
        const cart = computed(() => cartStore.cart)
        function onAddToCart(pid,iid) {
            cartStore.addToCart(pid,iid)
        }
        function onRemoveFromCart(pid,iid) {
            cartStore.removeFromCart(pid,iid)
        }
        function onCheckout() {
            cartStore.checkout()
        }
    return {
        products: productStore.products,
        cart,
        cartStore,
        onAddToCart,
        onRemoveFromCart,
        userStore,
        onCheckout,
        }
    },
})
</script>

<template>
    <div class='page-wrapper'>
        <div class="side-menu-wrapper">
            <h1>categories</h1>
            <div class="side-menu" v-if="products">
                <div class="side-menu-option" v-for="product in products" :key="product">{{product.name}}</div>
            </div>
        </div>
        <div class="store">
            <div class='content-wrapper' v-for="(product,pid,index) in products" :key="index" >
                <h2 class='page-header'>
                    {{product.name}}
                </h2>
                <div class="content" v-if= "product.items">
                    <div class='content-card' v-for='(item,iid,itemIndex) in product.items' :key='itemIndex'>
                            <router-link :to="'/product/' + pid + '&' + iid">
                                <div class="content-card-img-wrapper">
                                    <img v-if ="item.thumbnail" :src="item.thumbnail" alt="product thumbnail">
                                    <span v-else>{{item.name}}</span>
                                </div>
                            </router-link>
                            <div class="content-card-content">
                                <span class="card-info">
                                    <span>
                                        <h3>{{item.name}}</h3>
                                        <h5 v-if="item.supplier">{{item.supplier.name}}</h5>
                                    </span>
                                    <p>{{item.description}}</p>
                                    <p>{{item.price}}$</p>
                                </span>
                            <span class="card-buttons">
                                <button class="card-button" @click="onAddToCart(pid,iid)">+</button>
                                <button class="card-button" @click="onRemoveFromCart(pid,iid)">-</button>
                            </span>
                        </div>
                    </div>
                </div>  
                <div class='content-wrapper' v-else>
                    <h2>no products</h2>
                </div>
            </div>
        </div>
        <div class='cart-wrapper' v-if="userStore.isLogged">
            <h1>cart</h1>
            <h3>Total: {{cartStore.cartTotal()}}$</h3>
            <div class="cart" v-if="cart">
                <div class='cart-card' v-for='item in cart' :key='item'>
                    <span class="card-info" v-if="item">
                        <h2>{{item.name}}</h2>
                        <p>{{item.qty}}{{item.qty > 1 ? "units": "unit"}}</p>
                        <p>{{item.price}}$/ea</p>
                        <p>{{item.qty * item.price}}$</p>
                    </span>
                    <div v-else>
                        <h2>no items</h2>
                    </div>
                    <span class="card-buttons">
                        <button class="card-button" @click="onAddToCart(item.pid,item.iid)">+</button>
                        <button class="card-button" @click="onRemoveFromCart(item.pid,item.iid)">-</button>
                    </span>
                </div>
                <div class="cart-checkout">
                    <button class="card-button" @click="onCheckout">Checkout</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.page-wrapper{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow-y:scroll;
}
.side-menu-wrapper{
    width: 15%;
    height: 100%;
    background-color: #f5f5f5;
    border: 1px solid #e5e5e5;
}
.store{
    display:flex;
    flex-direction: column;
    width: 75%;
    height: 100%;
    background-color: #f5f5f5;
    border: 1px solid #e5e5e5;
}
.content-wrapper{
    display: flex;
    flex-direction: column;
    width:100%;
    height: 100%;
    background-color: #f5f5f5;
    padding: 0 1rem;
}
.content{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 1rem;
    width: 100%;
    height: 100%;
    padding: 1rem;
}
.content-card {
    display:flex;
    flex-direction: column;
    border: 1px solid black;
    margin: 10px;
    padding: 10px;
    height:15rem;
}

.content-card > a > .content-card-img-wrapper{
    display:flex;
    width: 100%;
    height: 100%;
}
.content-card > a > .content-card-img-wrapper > span{
    display: flex;
    width: 100%;
    height: 100%;
    background-color: black;
}
.content-card > a > .content-card-img-wrapper > img{
    display: flex;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.content-card > a {
    text-decoration: none;
    max-height:40%;
}
.content-card > .content-card-content{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 60%;
}
.content-card > .content-card-content > .card-info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
.content-card > .content-card-content > .card-info > span > h3{
    margin: 0;
    font-size: 1em;
}
.content-card > .content-card-content > .card-info > p{
    margin: 0;
    font-size: 0.8em;
}
.content-card > .content-card-content > .card-buttons{
    display: flex;
    justify-content: space-between;
}
.content-card > .content-card-content > .card-buttons > .card-button{
    width: 2rem;
    height: 2rem;
    border: 1px solid black;
    background-color: white;
}
.cart-wrapper{
    position:fixed;
    top:0;
    right:0;
    display: flex;
    flex-direction: column;
    background-color:#e5e5e5;
    width: 10%;
    height: 100%;
    border: 2px solid black;
    z-index:2;
}
.cart{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
}
.cart-card {
    border: 1px solid black;
    margin: 10px;
    padding: 10px;
}
.cart-card > .card-info{
    display: flex;
    flex-direction: column;
}
.cart-card > .card-info > h2{
    margin: 0;
    font-size: small
}
.cart-card > .card-info > p{
    margin: 0;
    font-size: x-small
}
</style>
