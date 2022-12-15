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
    
    async incrementItemFields(pid, iid, fields, values) {
      this.helper.incrementFields("items", iid, fields, values);
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
        if (this.images[pid].storeImage){
          this.helper.getDownloadURL(this.images[pid].storeImage).then((url) => {
            this.products[pid].storeImage = url
          })
        }
        for(let iid in this.items) {
          if(this.items[iid].pid == pid) {
            this.products[pid].items[iid] = this.items[iid];
          }
          if(this.images[iid] && this.products[pid].items[iid] ){
            this.products[pid].items[iid].images = {}
            Object.keys(this.images[iid]).forEach(key => {
              this.helper.getDownloadURL(this.images[iid][key]).then((url) => {
              this.products[pid].items[iid].images[key] = url
            });
          });
        }}
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
      let {image, ...data} = product
      const pid = await this.helper.addDoc("products", data);
      if(pid){
        const imageSnapshot = await this.helper.uploadAFileToStorage(image.file, "category_images/" + pid);
        if(imageSnapshot){
          await this.helper.setDoc("images", pid, {
            storeImage: imageSnapshot.metadata.fullPath,
          });
          this.products[pid] = data;
          this.products[pid].storeImage = await this.helper.getDownloadURL(imageSnapshot.metadata.fullPath);
          return true;
        }else{
          console.log("image upload failed");
          return false
        } 
      }
      else{
        return false
      }
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
      let {image, ...data} = item
      const iid = await this.helper.addDoc("items", data);
      const imageSnapshot = await this.helper.uploadAFileToStorage(image.file, "product_images/" + iid);
      await this.helper.setDoc("images", iid, {
        thumbnailRef: 'product_images/product_images_thumbnails/' + iid + "_150x150",
        fullImageref: imageSnapshot.metadata.fullPath,
        bigRef: 'product_images/product_images_thumbnails/' + iid + "_500x500",
        smallRef: 'product_images/product_images_thumbnails/' + iid + "_50x50",
      });
      this.items[iid] = data;
      this.products[data.pid].items[iid] = data;
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
    async updateProduct(product) {
      let {pid,upload, ...data} = product
      if(upload){
        const imageSnapshot = await this.helper.uploadAFileToStorage(upload.file, "category_images/" + pid);
        if(imageSnapshot){
          await this.helper.setDoc("images", pid, {
            storeImage: imageSnapshot.metadata.fullPath,
          });
        }else{
          console.log("image upload failed");
          return false
        }
      }
      const resp = await this.helper.setDoc("products", pid, data);
      if(resp){
        const merge = Object.assign(this.products[pid],data);
        this.products[pid] = merge;
        if(upload){
          this.products[pid].storeImage = upload.preview;
        }
        return true;
      }else{
        console.log("product update failed");
        return false
      }
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
    async updateItem(item) {
      if (item.upload) {
        const imageBytes = item.upload.file;
        const imageSnapshot = await this.helper.uploadAFileToStorage(imageBytes, "product_images/" + item.iid);
        if(imageSnapshot){
          await this.helper.setDoc("images", item.iid, {
            thumbnailRef: 'product_images/product_images_thumbnails/' + item.iid + "_150x150",
            fullImageref: imageSnapshot.metadata.fullPath,
            bigRef: 'product_images/product_images_thumbnails/' + item.iid + "_500x500",
            smallRef: 'product_images/product_images_thumbnails/' + item.iid + "_50x50",
            });
        }else{
          console.log("No image snapshot");
          return false
        }
      }
      const {iid,images,upload, ...data} = item;
      const resp = await this.helper.setDoc("items", iid, data);
      if(resp){
        const merge = Object.assign(this.items[iid],data);
        this.items[iid] = merge;
        this.products[data.pid].items[iid] = merge;
        if(upload){
          this.products[data.pid].items[iid].images.bigRef = upload.preview;
          this.products[data.pid].items[iid].images.thumbnailRef = upload.preview;
        }
      return true
      }else{
        console.log("Error updating item");
        return false
      }
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
      const resp = await this.helper.deleteDoc("products", pid);
      if(resp){
        this.helper.deleteDoc("images", pid);
        this.helper.deleteFile(this.products[pid].storeImage)
        delete this.products[pid];
        return true
      }else{
        console.log("Error deleting product");
        return false
      }
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
    async deleteItem(pid,iid) {
      const resp = await this.helper.deleteDoc("items", iid);
      if(resp) {
        for(let image in this.products[pid].items[iid].images){         
          this.helper.deleteFile(this.products[pid].items[iid].images[image])
        }
        delete this.items[iid];
        delete this.products[pid].items[iid];
        return true
      }else{
        console.log("Error deleting item")
        return false
      }
    },
    
    verifyProductByName(name) {
      for(let product in this.products){
        if(product.name == name){
          return true;
        }
      }
      return false;
    },
    verifyItemByName(name) {
      for(let item in this.items){
        if(item.name == name){
          return true;
        }
      }
      return false;
    },
    verifyItemByBid(bid) {
      for(let item in this.items){
        if(item.bid == bid){
          return true;
        }
      }
      return false;
    },

  },
  getters: {
    getAmountProducts: (state) => {
      return Object.keys(state.products).length;
    },
    getAmountItems: (state) => {
      return Object.keys(state.items).length;
    },
    getAmountItemsCloseToMinimum: (state) => {
      let items = [];
      Object.keys(state.items).forEach((key) => {
        if (state.items[key].stock <= state.items[key].min) {
          items.push(state.items[key]);
        }
      });
      return items.length;
    },
  },  
});
