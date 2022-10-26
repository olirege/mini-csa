import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { useUserStore } from "./user";
import { getFirestore, collection, getDoc, setDoc, doc} from "firebase/firestore";

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
      createUserWithEmailAndPassword: "https://us-central1-mini-csa.cloudfunctions.net/createUser/",
      signInWithEmailAndPassword: "https://us-central1-mini-csa.cloudfunctions.net/createUser/login",
      getRealexHpp: "https://us-central1-mini-csa.cloudfunctions.net/createUser/getRealexHpp/",
      RealexHppEndpoint: "https://us-central1-mini-csa.cloudfunctions.net/createUser/RealexEndpoint/",
    },
  db:null,
  loginError: ref(null),
  }),
  actions: {
    async init() {
      const app =  initializeApp(this.firebaseConfig);
      this.db = getFirestore(app);
      const analytics =  getAnalytics(app);
    },
    async signInUser(email, password){
      const auth = getAuth();
      const userStore = useUserStore();
      await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        userStore.setUserAndCart(user);
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
    }
  }
});

