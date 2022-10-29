import { defineStore } from "pinia";
import { useFirebaseStore } from "../stores/firebase";
import { collection, getDocs, setDoc, doc, collectionGroup } from "firebase/firestore";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: {},
    items: {},
  }),
  getters: {
  },
  actions: {
    selectedProduct(pid,iid) {
      return this.products[pid].items[iid];
    },

    async updateItemStock(pid,iid, qty) {
      const fb = useFirebaseStore();
      const newStock = this.products[pid].items[iid].stock - qty;
      const itemRef = doc(fb.db,"products", pid, "item", iid);
      await setDoc(itemRef, { stock: newStock }, { merge: true }).then(() => {
        this.products[pid].items[iid].stock = newStock;
        console.log("item stock updated", iid, newStock);
        });
    },
    async getProducts() {
      const fb = useFirebaseStore();
      const productsRef = collection(fb.db, "products");
      const querySnapshot = await getDocs(productsRef);
      querySnapshot.forEach(async (doc) => {
        this.products[doc.id] = doc.data();
        this.products[doc.id]["items"] = {};
        const itemsRef = collection(fb.db, "products", doc.id, "item");
        const itemsSnapshot = await getDocs(itemsRef);
        itemsSnapshot.forEach((item) => {
          this.products[doc.id]["items"][item.id] = item.data();
        });
      });
    },
    async getItems(){
      const fb = useFirebaseStore();
      const itemsRef = collectionGroup(fb.db, "item");
      const querySnapshot = await getDocs(itemsRef);
      querySnapshot.forEach((doc) => {
        this.items[doc.id] = doc.data();
      });
    },
    
    async createProduct(product) {
      const fb = useFirebaseStore();
      const productsRef = collection(fb.db, "products");
      await setDoc(doc(productsRef), product).then(() => {
        console.log("product created");
      });
    },
    async createItem(pid, item) {
      const fb = useFirebaseStore();
      const itemsRef = collection(fb.db, "products", pid, "item");
      await setDoc(doc(itemsRef), item).then(() => {
        console.log("item created");
      });
    },
    async modifyProduct(pid, product) {
      const fb = useFirebaseStore();
      const productRef = doc(fb.db, "products", pid);
      await setDoc(productRef, product, { merge: true }).then(() => {
        console.log("product modified");
      });
    },
    async modifyItem(pid, iid, item) {
      const fb = useFirebaseStore();
      const itemRef = doc(fb.db, "products", pid, "item", iid);
      await setDoc(itemRef, item, { merge: true }).then(() => {
        console.log("item modified");
      });
    },
    async deleteProduct(pid) {
      const fb = useFirebaseStore();
      const productRef = doc(fb.db, "products", pid);
      await setDoc(productRef, { deleted: true }, { merge: true }).then(() => {
        console.log("product deleted");
      });
    },
    async deleteItem(pid, iid) {
      const fb = useFirebaseStore();
      const itemRef = doc(fb.db, "products", pid, "item", iid);
      await setDoc(itemRef, { deleted: true }, { merge: true }).then(() => {
        console.log("item deleted");
      });
    },
  }
});
