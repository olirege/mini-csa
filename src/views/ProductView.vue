<template>
    <main v-if="product">
        <h2 class='page-header'>
            {{product.name}}
        </h2>
        <div class="content-wrapper">
        {{product.description}}
        </div>
        <span v-if="isLogged">
            <button class="card-button" @click="onAddToCart(pid,iid)">Add to Cart</button>
                <div>{{cartQty}}</div>
            <button class="card-button" @click="onRemoveFromCart(pid,iid)">Remove from Cart</button>
        </span>
        <div class="content-wrapper">
            <h5>Reviews</h5>
            <div class="reviews-wrapper" v-if="reviews">
                <div class='review' v-for="(review,_,index) in reviews" :key="index">{{review}}</div>
            </div>
            <div class="reviews-wrapper" v-else>
                <div class='review'>No reviews</div>
            </div>
        </div>
        <div v-if ="reviews">
            <div class="content-wrapper" v-if="userStore.user && reviewsStore.hasUserReviewed()" >
                <h5>Write a review</h5>
                <div class="review-form">
                    <textarea v-model="reviewText.content" placeholder="Write your review here"></textarea>
                    <input type="number" v-model="reviewText.rating" placeholder="Rating (1-5)">
                    <button @click="addReview"> Add Review </button>
                </div>
            </div>
            <div class="content-wrapper" v-else-if="!userStore.user">
                <p>
                    <router-link to="/login">Login</router-link> to write a review
                </p>
            </div>
            <div class="content-wrapper" v-else>
                <p>
                    You have already reviewed this product
                </p>
            </div>
        </div>
    </main>
</template>
<script>
import { reactive, computed } from 'vue'
import { useProductStore } from '../stores/products'
import {useCartStore} from '../stores/cart'
import {useUserStore} from '../stores/user'
import {useReviewsStore} from '../stores/reviews'
export default ({
    props:[
        'id'
    ],
    setup(props) {
        const productStore = useProductStore()
        const pid = props.id.split('&')[0]
        const iid = props.id.split('&')[1]
        const product = productStore.selectedProduct(pid,iid)
        const cartStore = useCartStore()
        const userStore = useUserStore()
        const reviewsStore = useReviewsStore()
        reviewsStore.getItemReviews(iid)
        const reviewText = reactive({
            content: '',
            rating: 0,
            timestamp: Date.now()
        })
        const reviews = computed(() => reviewsStore.itemReviews)
        const cartQty = computed(() => cartStore.cartQty(iid))
        function addReview(){
            reviewsStore.addReview(iid,reviewText)
            reviewText.content = ''
            reviewText.rating = 0
            reviewsStore.getItemReviews(iid)
        }
        function onAddToCart(pid,iid) {
            cartStore.addToCart(pid,iid)
        }
        function onRemoveFromCart(pid,iid) {
            cartStore.removeFromCart(pid,iid)
        }
        
        return {
            product,
            cartQty,
            onAddToCart,
            onRemoveFromCart,
            pid,
            iid,
            reviews,
            addReview,
            reviewText,
            isLogged: userStore.isLogged,
            reviewsStore,
            userStore,
        }  
    },
})
</script>
