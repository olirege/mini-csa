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
            <h2>Notifications</h2>
            <div class='field'>
                <h5>Receive Emails Reminder:</h5>
                <input type="checkbox" v-model="userStore.userProfile.receiveEmailReminder" @change="saveProfileChanges"/>
            </div>
        </div>
        <div class="content" id='cc' v-if="userStore.userProfile && userStore.userProfile.cc">
            <h2>Payment Information:</h2>
            <div class="cards-container">
                <div class="card-wrapper" v-for="(card,index) in userStore.userProfile.cc" :key="index" @click="editCard(card)" :class="{'active': card.isSelectedCC}">
                    <div class='field'>
                        <h5>Card Holder:</h5>
                        <p>{{card.SAVED_PMT_NAME}}</p>
                    </div>
                    <div class='field'>
                        <h5>Card Type:</h5>
                        <p>{{card.SAVED_PMT_TYPE}}</p>
                    </div>
                    <div class='field'>
                        <h5>Card Number:</h5>
                        <p>{{card.SAVED_PMT_DIGITS}}</p>
                    </div>
                    <div class='field'>
                        <h5>Card Expiration Date:</h5>
                        <p>{{card.SAVED_PMT_EXPDATE}}</p>
                    </div>
                </div>
                <button @click="addCard">Add card</button>
            </div>
            <Teleport to='body'>
                <the-modal v-show="showEditCardModal" @close-modal="showEditCardModal = false">
                    <template #header>
                        <h2>Edit Card</h2>
                    </template>
                    <template #body>
                        <div class="card-wrapper">
                            <div class='field'>
                                <h5>Card Holder:</h5>
                                <p>{{selectedCard.SAVED_PMT_NAME}}</p>
                            </div>
                            <div class='field'>
                                <h5>Card Type:</h5>
                                <p>{{selectedCard.SAVED_PMT_TYPE}}</p>
                            </div>
                            <div class='field'>
                                <h5>Card Number:</h5>
                                <p>{{selectedCard.SAVED_PMT_DIGITS}}</p>
                            </div>
                            <div class='field'>
                                <h5>Card Expiration Date:</h5>
                                <p>{{selectedCard.SAVED_PMT_EXPDATE}}</p>
                            </div>
                        </div>
                        <div class="field">
                            <label for="cc-name">Selected Credit Card</label>
                            <input type="checkbox" v-model="selectedCard.isSelectedCC" @change="saveCCChanges"/>
                        </div>
                        <button @click="removeSelectedCC"> Remove this Card </button>
                    </template>
                </the-modal>
            </Teleport>
            <Teleport to='body'>
                <the-modal v-show="showAddCardModal" @close-modal="showAddCardModal = false">
                    <template #header>
                        <h2>Add Card</h2>
                    </template>
                    <template #body>
                        <div class="realex-wrapper"></div>
                    </template>
                </the-modal>
            </Teleport>
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
import { useFirebaseStore } from '../stores/firebase'
import TheModal from '../components/TheModal.vue'
import { ref } from 'vue'
import axios from 'axios'
export default ({
    components: {
        TheModal
    },
    setup() {
        const fb = useFirebaseStore()
        const userStore = useUserStore()
        const cartStore = useCartStore()
        cartStore.loadCartHistory()
        const cartHistory = cartStore.cartHistory
        const showAddCardModal = ref(false)
        const showEditCardModal = ref(false)
        const selectedCard = ref({})
        
        function saveProfileChanges() {
            userStore.saveProfileChanges()
        }
        function reverseBoolUnselectedCC() {
            userStore.userProfile.cc.forEach(card => {
                if(card != selectedCard.value) {
                    card.isSelectedCC = false
                }
            })
        }
        function removeSelectedCC(){
            userStore.removeCC(selectedCard.value)
            userStore.fetchProfile()
            .then(() => {
                showEditCardModal.value = false
            })

        }
        function saveCCChanges() {
            reverseBoolUnselectedCC()
            saveProfileChanges()
        }
        function syncProfile(){
            userStore.fetchProfile()
        }
        function addCard() {
            showAddCardModal.value = true
            initHpp()
        }
        function editCard(card){
            showEditCardModal.value = true
            selectedCard.value = card
        }
        function initHpp() {
            if(document.querySelector("#iframeId")){
                document.querySelector("#iframeId").remove();
            }
            const newIFrame = document.createElement("iframe")
            newIFrame.id = "iframeId"
            document.querySelector(".realex-wrapper").append(newIFrame);
            axios({
                method:'get',
                url: fb.api.getRealexHpp
            }).then((resp) => {
                RealexHpp.setHppUrl("https://pay.sandbox.realexpayments.com/pay");
                RealexHpp.embedded.init(
                "autoload", 
                "iframeId",
                (awnser, close) => {
                handleResponse(awnser, close)
                },
                resp.data)
            })
        }
        function handleResponse(awnser, close){
            axios({
                method:'post',
                url:fb.api.RealexHppEndpoint,
                data: {
                ...awnser,
                uid: userStore.user.uid
                },
            }).then(() =>{
                showAddCardModal.value = false
                syncProfile()
            }).catch((err) =>{
                console.log(err)
                initHpp();
            })
        }
        return {
            userStore,
            cartHistory,
            saveProfileChanges,
            addCard,
            showAddCardModal,
            showEditCardModal,
            editCard,
            selectedCard,
            saveCCChanges,
            removeSelectedCC,
        }
    },
})
</script>
<style scoped>
.card-wrapper{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 15rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    gap:2px;
}
.page-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
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
.cards-container{
    display:flex;
    flex-direction:row;
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
.active{
    border: 2px solid green;
}
.card-wrapper > .field {
    height: 1.5rem;
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
.realex-wrapper{
    width: 100%;
    height: 100%;
}
.realex-wrapper >>> #iframeId{
  width: 100%;
  height: 100%;
  border:none;
}
</style>