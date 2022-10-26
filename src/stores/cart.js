import { defineStore } from "pinia";
import { useFirebaseStore } from "../stores/firebase";
import { useProductStore } from "./products";
import { collection, getDoc, setDoc, doc, getDocFromCache, runTransaction } from "firebase/firestore";


export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
    cid: null,
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
            this.cart.push({pid: pid, iid: iid, qty: 1});
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
            this.cart = cartDoc.data().items;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    },
    async saveCart() {
        const fb = useFirebaseStore();
        const cartRef = doc(fb.db, "carts", this.cid);
        await setDoc(cartRef, {items: this.cart}, {merge: true});
    },
    async checkout() {
        const fb = useFirebaseStore();
        const cartRef = doc(fb.db, "carts", this.cid);
        await runTransaction(fb.db, async (transaction) => {
            const cartDoc = await transaction.get(cartRef);
            if (!cartDoc.exists()) {
                throw "Cart does not exist!";
            }
            const cart = cartDoc.data();
            const batch = fb.db.batch();
            cart.items.forEach((item) => {
                const productRef = doc(fb.db, "products", item.pid);
                batch.update(productRef, {stock: item.product.stock - item.qty});
            });
            batch.delete(cartRef);
            await batch.commit();
        });
    }
        
  }
});