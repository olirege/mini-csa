import { defineStore } from "pinia";
import { useHelperStore } from "./helpers";
export const useProductStore = defineStore("products", {
  state: () => ({
    helper: useHelperStore(),
    products: {},
    items: {},
  }),
  getters: {
  },
  actions: {
    /**
     * 
     * @param {String} pid 
     * @param {String} iid 
     * @returns {Object} item
     * 
     * @description
     * 1. Returns the item object
     *  
     */
    selectedProduct(pid,iid) {
      return this.products[pid].items[iid];
    },

    /**
     * 
     * @param {String} pid - product id
     * @param {String} iid - item id
     * @param {Number} qty - quantity
     *  
     * @description
     * 1. Updates the stock of the item
     * */
    async updateItemStock(pid, iid, qty) {
      this.helper.incrementField("items", iid, "stock", -qty);
      this.products[pid].items[iid].stock -= qty;
    },
    
    /**
     * 
     * @description
     * 1. Gets the products from the database
     * 2. Gets the items from the database
     * 3. Gets the images from the database
     * 4. Gets the suppliers from the database
     * 5. Sets the products, items, images and suppliers
     */
    async getProductTree() {
      this.products = await this.helper.getCollection("products")
      this.items = await this.helper.getCollection("items")
      this.images = await this.helper.getCollection("images")
      for(let pid in this.products) {
        this.products[pid].items = {};
        for(let iid in this.items) {
          if(this.items[iid].pid == pid) {
            this.products[pid].items[iid] = this.items[iid];
          }
          if(this.images[iid]){
            this.helper.getDownloadURL(this.images[iid].thumbnailRef).then((url) => {
              this.products[pid].items[iid].thumbnail = url;
            });
          }
        }
      }
    },

    // async getItems(){
    //   const fb = useFirebaseStore();
    //   const itemsRef = collectionGroup(fb.db, "item");
    //   const querySnapshot = await getDocs(itemsRef);
    //   querySnapshot.forEach((doc) => {
    //     this.items[doc.id] = doc.data();
    //   });
    // },

    /**
     * 
     * @param {*} product - product object
     * @description
     * 1. Adds a product to the database
     * 2. Adds the product to the products object
     */
    async createProduct(product) {
      const pid = await this.helper.addDoc("products", product);
      this.products[pid] = product;
    },

    /**
     * 
     * @param {*} item - item object
     * 
     * @description
     * 1. Adds an item to the database
     * 2. Adds the item to the items object
     * 3. Adds the item to the product's items object
     * 4. Adds images to the database
     * 
     * @todo
     * 1. Add images to item object
     */
    async createItem(item) {
      const imageBytes = item.image;
      delete item.image; 
      const iid = await this.helper.addDoc("items", item);
      const imageSnapshot = await this.helper.uploadAFileToStorage(imageBytes, "product_images/" + iid);
      await this.helper.setDoc("images", iid, {thumbnailRef: 'product_images/product_images_thumbnails/' + iid + "_200x200",fullImageref: imageSnapshot.metadata.fullPath});
      this.items[iid] = item;
      this.products[item.pid].items[iid] = item;
    },

    /**
     * 
     * @param {*} pid - product id
     * @param {*} product - product object
     * 
     * @description
     * 1. Updates the product in the database
     * 2. Updates the product in the products object 
     */
    async updateProduct(pid, product) {
      await this.helper.updateDoc("products", pid, product);
      this.products[pid] = product;
    },
    /**
     * 
     * @param {*} iid - item id
     * @param {*} item - item object
     * 
     * @description
     * 1. Updates the item in the database
     * 2. Updates the item in the items object
     * 3. Updates the item in the product's items object
     * 4. Updates the images in the database
     */
    async updateItem(iid, item) {
      if (item.image) {
        const imageBytes = item.image;
        delete item.image;
        const imageSnapshot = await this.helper.uploadAFileToStorage(imageBytes, "product_images/" + iid);
        await this.helper.setDoc("images", iid, {thumbnailRef: 'product_images/product_images_thumbnails/' + iid + "_200x200",fullImageref: imageSnapshot.metadata.fullPath});
      }
      this.helper.setDoc("items", iid, item);
      this.items[iid] = item;
      this.products[item.pid].items[iid] = item;
    },
    /**
     * 
     * @param {*} pid - product id
     * @param {*} product - product object
     * 
     * @description
     * 1. Deletes the product from the database
     * 2. Deletes the product from the products object
     */
    async deleteProduct(pid) {
      await this.helper.deleteDoc("products", pid);
      delete this.products[pid];
    },
    /**
     * 
     * @param {*} pid - product id
     * @param {*} iid - item id
     * 
     * @description
     * 1. Deletes the item from the database
     * 2. Deletes the item from the items object 
     */
    async deleteItem(pid, iid) {
      await this.helper.deleteDoc("items", iid);
      delete this.products[pid].items[iid];
    },

  }
});
