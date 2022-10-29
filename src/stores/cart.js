import { defineStore } from "pinia";
import { useFirebaseStore } from "../stores/firebase";
import { useProductStore } from "./products";
import { collection, getDoc, setDoc, doc, getDocFromCache, runTransaction, getDocs, where, query,arrayUnion } from "firebase/firestore";


export const useCartStore = defineStore("cart", {
  state: () => ({
    cartHistory: [],
    oldCart: {},
    cartTimeStamps: null,
    cart: [],
    cid: null,
    carts: [],
    cartsDue: [],
    }),
  getters: {},
  actions: {
    async addToCart(pid,iid){
        console.log("addToCart " + iid);
        const productStore = useProductStore();
        let p = this.cart.find(p => p.iid === iid);
        if (p){
            p.qty++;
            productStore.updateItemStock(pid,iid, 1);
        } else {
            this.cart.push({pid: pid, iid: iid,price:productStore.products[pid].items[iid].price, qty: 1});
            productStore.updateItemStock(pid,iid, 1);
        }
        this.saveCart();
    },
    async removeFromCart(pid,iid){
        console.log("removeFromCart " + iid);
        let p = this.cart.find(p => p.iid === iid);
        const productStore = useProductStore();
        if (p){
            p.qty--;
            productStore.updateItemStock(pid,iid, -1);
            if (p.qty === 0){
                this.cart = this.cart.filter(p => p.iid !== iid);
            }
        }
        this.saveCart();
    },

    cartQty(iid){
        let p = this.cart.find(p => p.iid === iid);
        if (p){
            return p.qty;
        }
        return 0;
    },
    cartTotal(){
        let total = 0;
        this.cart.forEach(p => {
            total += p.price * p.qty;
        });
        return total;
    },
    async loadCart(uid) {
        const fb = useFirebaseStore();
        this.cid = uid
        const cartRef = doc(fb.db, "carts", this.cid);
        let cartDoc = null
        try {
            console.log("checking if cart exists in cache");
            cartDoc = await getDocFromCache(cartRef);
        }catch (e){
            console.log("checking if cart exists in db");
            cartDoc = await getDoc(cartRef);
        }
        if (cartDoc.exists()) {
            const temp = cartDoc.data();
            this.cartTimeStamps = {createdAt:temp.active.createdAt,opensOn:temp.active.opensOn,closesOn:temp.active.closesOn};
            this.cart = temp.active.items;
            this.cartHistory = temp.history.splice(0, 10);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    },
    async saveCart() {
        const fb = useFirebaseStore();
        const cartRef = doc(fb.db, "carts", this.cid);
        await setDoc(cartRef, {active: {items: this.cart}}, {merge: true});
    },
    async checkout() {
        const fb = useFirebaseStore();
        const cartRef = doc(fb.db, "carts", this.cid);
        await runTransaction(fb.db, async (transaction) => {
            const cartDoc = await transaction.get(cartRef);
            if (!cartDoc.exists()) {
                throw "Document does not exist!";
            }
            
            let in4daysAtMidnight = new Date();
            in4daysAtMidnight.setDate(in4daysAtMidnight.getDate() + 4);
            in4daysAtMidnight.setHours(0,0,0,0);
            let in7daysAtMidnight = new Date();
            in7daysAtMidnight.setDate(in7daysAtMidnight.getDate() + 7);
            in7daysAtMidnight.setHours(0,0,0,0);
            
            const newCart = {
                items: [], 
                createdAt: new Date(),
                opensOn: in4daysAtMidnight,
                closesOn: in7daysAtMidnight,
            };
            this.cartTimeStamps = {createdAt:newCart.createdAt,opensOn:newCart.opensOn,closesOn:newCart.closesOn};
            transaction.update(cartRef, {active: newCart, history: arrayUnion({
                oid:Math.random().toString(36).substring(2, 15).toUpperCase(),
                createdAt:this.cartTimeStamps.createdAt,
                openedOn:this.cartTimeStamps.opensOn,
                closedOn:this.cartTimeStamps.closesOn,
                items:this.cart,
                total:this.cartTotal()})});
        });
        this.cart = [];
    },

    async fetchOlderCart(oid){
        const fb = useFirebaseStore();
        const cartRef = doc(fb.db, "carts", this.cid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
            const temp = cartDoc.data();
            this.oldCart = temp.history.find(p => p.oid === oid);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    },
    async loadFullCarts() {
        const fb = useFirebaseStore();
        const cartsRef = collection(fb.db, "carts")
        const today = new Date();
        today.setHours(0,0,0,0);
        const q = query(cartsRef, where("active.items", ">", [], where("active.closesOn", "==", today)));
        const querySnapshot = await getDocs(q);
        if (this.carts.length > 0){
            this.carts = [];
        }
        querySnapshot.forEach((doc) => {
            this.carts.push(
                Object.assign(doc.id, doc.data())
                );
        });
    },

    async cartsDueForNext5Days(){
        const fb = useFirebaseStore();
        const cartsRef = collection(fb.db, "carts")
        const now = new Date();
        now.setHours(0,0,0,0);
        const in5Days = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 5);
        in5Days.setHours(0,0,0,0);
        const q = query(cartsRef, where("active.closesOn", ">", now, where("active.closesOn", "<=", in5Days)));
        const querySnapshot = await getDocs(q);
        if (this.cartsDue.length > 0){
            this.cartsDue = [];
        }
        querySnapshot.forEach((doc) => {
            this.cartsDue.push(
                Object.assign(doc.id, doc.data().active)
                );
        });
    }
        
  }
});