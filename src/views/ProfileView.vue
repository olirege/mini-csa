<template>
    <div class="page-wrapper">
        <h2 class="page-title"> Your Profile Summary</h2>
        <div class= "content" v-if ='userStore.userProfile'>
            <h2>Account Holder:</h2>
            <div class='field'>
                <h5>First name:</h5>
                <p>{{userStore.userProfile.firstName}}</p>
            </div>
            <div class='field'>
                <h5>Last name:</h5>
                <p>{{userStore.userProfile.lastName}}</p>
            </div>
            <div class='field'>
                <h5>Member since:</h5>
                <p>{{userStore.userProfile.createdAt.toDate()}}</p>
            </div>
            <h2>Contact Information:</h2>
            <div class='field'>
                <h5>Phone Number:</h5>
                <p>{{userStore.userProfile.tel}}</p>
            </div>
            <div class='field'>
                <h5>Address:</h5>
                <p>{{userStore.userProfile.postalCode}}</p>
            </div>
            <div class='field'>
                <h5>Email:</h5>
                <p>{{userStore.userProfile.email}}</p>
            </div>
            <h2>Shipping:</h2>
            <div class='field'>
                <h5>Pickup:</h5>
                <p>{{userStore.userProfile.pickupLocation}}</p>
            </div>
            <div class='field'>
                <h5>Day of the week:</h5>
                <p>{{userStore.userProfile.pickupDate}}</p>
            </div>
            <div class='field'>
                <h5>Pickup Active:</h5>
                <p>{{userStore.userProfile.boxActive}}</p>
            </div>
        </div>
        <div class="content" v-if="userStore.userProfile.cc">
            <h2>Payment Information:</h2>
            <div class='field'>
                <h5>Card Holder:</h5>
                <p>{{userStore.userProfile.cc.SAVED_PMT_NAME}}</p>
            </div>
            <div class='field'>
                <h5>Card Type:</h5>
                <p>{{userStore.userProfile.cc.SAVED_PMT_TYPE}}</p>
            </div>
            <div class='field'>
                <h5>Card Number:</h5>
                <p>{{userStore.userProfile.cc.SAVED_PMT_DIGITS}}</p>
            </div>
            <div class='field'>
                <h5>Card Expiration Date:</h5>
                <p>{{userStore.userProfile.cc.SAVED_PMT_EXPDATE}}</p>
            </div>
        </div>
        <div class="content" v-if="cartHistory">
            <h2>Order History:</h2>
            <div class="field-headers">
                <h5>Order Number:</h5>
                <h5>Order Date:</h5>
            </div>
            <div class='field' v-for="cart in cartHistory" :key="cart.oid">
                <div class="field-content">
                    <router-link :to="'/order/view/' + cart.oid"><p>{{cart.oid}}</p></router-link>
                    <p>{{cart.closedOn.toDate()}}</p>
                    <p>{{cart.total}}$</p>
                </div>
            </div>
        </div>            
    </div>
</template>
<script>
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
export default ({
    setup() {
        const userStore = useUserStore()
        const cartStore = useCartStore()
        const cartHistory = cartStore.cartHistory
        return {
            userStore,
            cartHistory
        }
    },
})
</script>
<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.page-title {
    font-size: 2rem;
    font-weight: bold;
}
.content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.field {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 2rem;
    gap: 1rem;
    align-content: center;
    text-align: center;
}
.field-headers {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 2rem;
    gap: 1rem;
}
.field-content {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 2rem;
    gap: 1rem;
}
.field h5 {
    font-weight: bold;
    margin:0;
}
.field p {
    font-weight: normal;
}
</style>