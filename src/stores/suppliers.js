import { defineStore } from "pinia";
import { collection, getDoc, setDoc, doc, getDocFromCache, runTransaction, getDocs, where, query,arrayUnion, collectionGroup, addDoc } from "firebase/firestore";
import { useFirebaseStore } from "../stores/firebase";
export const useSuppliersStore = defineStore("suppliers", {
    state: () => ({
        suppliers: {},
        supplier: null,
        supplierId: null,
    }),
    actions: {
        async loadSuppliers() {
            const fb = useFirebaseStore();
            const suppliersRef = collection(fb.db, "suppliers");
            const querySnapshot = await getDocs(suppliersRef);
            querySnapshot.forEach((doc) => {
                this.suppliers[doc.id] = doc.data();
            });
        },
        async createSupplier(supplier){
            const fb = useFirebaseStore();
            const suppliersRef = collection(fb.db, "suppliers");
            await addDoc(suppliersRef, supplier).then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                this.suppliers[docRef.id] = supplier;
                }).catch((error) => {
                console.error("Error adding document: ", error);
            });
        },
        async addItemToSupplier(sid,iid){
            console.log("addItemToSupplier", sid, iid);
            const fb = useFirebaseStore();
            const supplierRef = doc(fb.db, "suppliers", sid);
            await setDoc(supplierRef, { items: arrayUnion(iid) }, { merge: true }).then(() => {
                if (this.suppliers[sid].items){
                    this.suppliers[sid].items.push(iid);
                }else{
                    this.suppliers[sid].items = [iid];
                }
                console.log("item added to supplier", sid, iid);
                }).catch((error) => {
                console.error("Error adding item to supplier: ", error);
            });
        }
    },
    getters: {
        getSupplier: (state) => (sid) => {
            return state.suppliers[sid];
        },
    },
});