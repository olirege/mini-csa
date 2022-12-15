import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { useUserStore } from "./user";
import { useCartStore } from "./cart";
import { getFirestore } from "firebase/firestore";

export const useFirebaseStore = defineStore("firebase", {
  state: () => ({ 
  firebaseConfig:{
    apiKey: "AIzaSyBMqULV-YdsbGUwZGg-uG1FoYuFFKNvQZw",
    authDomain: "mini-csa.firebaseapp.com",
    projectId: "mini-csa",
    storageBucket: "mini-csa.appspot.com",
    messagingSenderId: "227421120556",
    appId: "1:227421120556:web:0acf4907a7561d6d7e8989",
    measurementId: "G-7SLNXE1TS8",
    },
    api:{
      createUserWithEmailAndPassword: "https://us-central1-mini-csa.cloudfunctions.net/api/users",
      signInWithEmailAndPassword: "https://us-central1-mini-csa.cloudfunctions.net/api/login",
      getRealexHpp: "https://us-central1-mini-csa.cloudfunctions.net/api/getRealexHpp/",
      RealexHppEndpoint: "https://us-central1-mini-csa.cloudfunctions.net/api/RealexEndpoint/",
      removeCC: "https://us-central1-mini-csa.cloudfunctions.net/api/removeCC/",
    },
  db:null,
  storage:null,
  loginError: null,
  }),
  actions: {
    /**
     * 
     * @description
     * 1. Initializes the firebase app
     * 2. Initializes the firestore database
     * 3. Initializes the storage
     * 4. Initializes the analytics
     */
    async init() {
      const app =  initializeApp(this.firebaseConfig);
      this.db = getFirestore(app);
      const analytics =  getAnalytics(app);
      this.storage = getStorage(app);
    },
    /**
     * 
     * @param {*} email 
     * @param {*} password
     * 
     * @description
     * 1. Signs in the user
     * 2. Sets the user in the user store
     * 3. Gets the user profile from the database 
     */
    async signInUser(email, password){
      const auth = getAuth();
      const userStore = useUserStore();
      const cartStore = useCartStore();
      await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        userStore.setUser(user);
        cartStore.loadCart(user.uid);
        cartStore.loadCartHistory()

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/wrong-password" || errorCode === "auth/invalid-email") {
          this.loginError = "Invalid email or password";
        }
        if (errorCode === "auth/user-not-found"){
          this.loginError = "User not found";
        }
        if (errorCode === "auth/invalid-email") {
          this.loginError = "Invalid email";
        }
      });
    },
  }
});

