import { defineStore } from 'pinia'
import { doc, getDoc } from "firebase/firestore";
import { useFirebaseStore } from './firebase';
import { useCartStore } from './cart';
import { ref } from 'vue'
export const useUserStore = defineStore('user', {
    state: () => ({
      user: ref(null),
      userProfile: ref(null),
      // ...
    }),
    actions: {
        setUserAndCart(user) {
            this.user = user;
            this.initCart(user.uid);
        },
        async initCart(uid) {
            console.log("initCart");
            const cartStore = useCartStore();
            cartStore.loadCart(uid);
        },
        async fetchProfie(){
            console.log("fetchProfie");
            const fb = useFirebaseStore();
            const userRef = doc(fb.db, "users", this.user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                this.userProfile = userDoc.data();
            } else {
                console.log("No such document!");
            }
        }
    },
    getters: {
        isLogged: (state) => {
            return state.user != null;
        },
        isAdmin: (state) => {
            return state.userProfile != null && state.userProfile.isAdmin;
        }
    }
  })