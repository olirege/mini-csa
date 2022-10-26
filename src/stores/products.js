import { defineStore } from "pinia";
import { useFirebaseStore } from "../stores/firebase";
import { collection, getDocs, setDoc, doc, runTransaction } from "firebase/firestore";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: {},
  }),
  getters: {
  },
  actions: {
    selectedProduct(pid,iid) {
      return this.products[pid].items[iid];
    },

    async productTransactionHandler(pid, qty) {
      const fb = useFirebaseStore();
      const productRef = doc(fb.db, "products", pid);
      await runTransaction(async (transaction) => {
        const docSnap = await transaction.get(productRef);
        if (!docSnap.exists()) {
          throw "Document does not exist!";
        }
        const newStock = docSnap.data().stock - qty;
        transaction.update(productRef, { stock: newStock });
      });
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
  }
});
