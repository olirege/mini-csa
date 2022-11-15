import { defineStore } from "pinia";
import { useFirebaseStore } from "../stores/firebase";
import { useSuppliersStore } from "./suppliers";
import { useUserStore } from "./user";
import { collection, getDoc, setDoc, doc, getDocFromCache, runTransaction, getDocs, where, query,arrayUnion, collectionGroup, addDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
export const useProductStore = defineStore("products", {
  state: () => ({
    products: {},
    items: {},
    reviews: {},
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
      const suppliers = useSuppliersStore();
      const productsRef = query(collection(fb.db, "products"), where("deleted", "==", false));
      const querySnapshot = await getDocs(productsRef);
      querySnapshot.forEach(async (productDoc) => {
        this.products[productDoc.id] = productDoc.data();
        this.products[productDoc.id]["items"] = {};
        const itemsRef = query(collection(fb.db, "products", productDoc.id, "item"), where("deleted", "==", false));
        const itemsSnapshot = await getDocs(itemsRef);
        itemsSnapshot.forEach( async (itemDoc) => {
          if(itemDoc.data()){
            this.products[productDoc.id].items[itemDoc.id] = itemDoc.data();
            const imageRef = doc(fb.db, "images", itemDoc.id);
            await getDoc(imageRef).then((imageDoc) => {
              if (imageDoc.exists()) {
                getDownloadURL(ref(getStorage(), imageDoc.data().thumbnailRef)).then((url) => {
                  this.products[productDoc.id].items[itemDoc.id].thumbnail = url;
                });
                // getDownloadURL(ref(getStorage(), imageDoc.data().fullImageRef)).then((url) => {
                //   this.products[productDoc.id].items[itemDoc.id].image = url;
                // });
              } else {
                console.log("No such document!");
              }
            }).catch((error) => {
              console.log("Error getting document:", error);
            });
            if (itemDoc.data().sid){
              this.products[productDoc.id].items[itemDoc.id].supplier = suppliers.getSupplier(itemDoc.data().sid);
            }
          }
        });
        if (Object.keys(this.products[productDoc.id].items).length === 0){
          delete this.products[productDoc.id];
        }
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
    async getItemReviews(pid, iid){
      const fb = useFirebaseStore();
      const reviewsRef = query(collection(fb.db, "products", pid, "item", iid, 'reviews'));
      await getDocs(reviewsRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.reviews[doc.id] = doc.data();
          });
        });
    },
    async addReview(pid, iid, review){
      const fb = useFirebaseStore();
      const reviewsRef = collection(fb.db, "products", pid, "item", iid, 'reviews');
      await addDoc(reviewsRef, review)
        .then(async (docRef) => {
          console.log("Document written with ID: ", docRef.id);
          await setDoc(doc(reviewsRef), review)
          const user = useUserStore();
          const userRef = doc(fb.db, "users", user.user.uid);
          await setDoc(userRef, { reviews: arrayUnion({reviewId:docRef.id,pid:pid,iid:iid}) }, { merge: true });
          user.fetchProfile();
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
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
      const supplier = useSuppliersStore();
      const itemsRef = collection(fb.db, "products", pid, "item");
      const imageBytes = item.image;
      delete item.image;
      await addDoc(itemsRef, item).then(async (docRef) => {
        supplier.addItemToSupplier(item.sid, docRef.id)
        const imageRef = ref(getStorage(), "product_images/" + docRef.id);
        await uploadBytes(imageRef, imageBytes).then(async (snapshot) => {
          console.log("Uploaded image file!");
          const imageDoc = doc(fb.db, "images", docRef.id);
          await setDoc(imageDoc, { thumbnailRef: 'product_images/product_images_thumbnails/' + iid + "_200x200", fullImageref: snapshot.metadata.fullPath });
        });
      });
    },
    async updateProduct(pid, product) {
      const fb = useFirebaseStore();
      const productRef = doc(fb.db, "products", pid);
      await setDoc(productRef, product, { merge: true }).then(() => {
        console.log("product modified");
      });
    },
    async updateItem(pid, iid, item) {
      const fb = useFirebaseStore();
      const itemRef = doc(fb.db, "products", pid, "item", iid);
      if (item.image) {
        const imageBytes = item.image;
        delete item.image;
        const imageRef = ref(getStorage(), "product_images/" + iid);
        await uploadBytes(imageRef, imageBytes).then(async (snapshot) => {
          console.log("Uploaded image file!");
          const imageDoc = doc(fb.db, "images", iid);
          await setDoc(imageDoc, { thumbnailRef: 'product_images/product_images_thumbnails/' + iid + "_200x200", fullImageref: snapshot.metadata.fullPath });
        });
      }
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
