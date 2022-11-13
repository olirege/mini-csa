import { defineStore } from 'pinia'
import { getDoc, setDoc, doc} from "firebase/firestore";
import { useFirebaseStore } from './firebase';
import { useCartStore } from './cart';
import { ref } from 'vue'
import axios from 'axios'
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
        
        async fetchProfile(){
            console.log("fetchProfile");
            const fb = useFirebaseStore();
            const userRef = doc(fb.db, "users", this.user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                this.userProfile = userDoc.data();
            } else {
                console.log("No such document!");
            }
        },
        async saveProfileChanges(){
            console.log("saveProfileChanges");
            const fb = useFirebaseStore();
            const userRef = doc(fb.db, "users", this.user.uid);
            await setDoc(userRef, this.userProfile);
        },
        async removeCC(cc){
            const fb = useFirebaseStore();
            axios({
                method: 'post',
                url: fb.api.removeCC,
                data: {
                    ...cc,
                    uid: this.user.uid,
                }
            }).then( (response) => {
                console.log(response);
            }).catch( (error) => {
                console.log(error);
            });
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