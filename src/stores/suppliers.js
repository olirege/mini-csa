import { defineStore } from "pinia";
import { useHelperStore } from "./helpers";
import { useProductStore } from "./products";
export const useSuppliersStore = defineStore("suppliers", {
    state: () => ({
        helper: useHelperStore(),
        suppliers: {},
        supplier: null,
    }),
    actions: {
        /**
         * @description
         * 1. Gets the suppliers from the database
         * 2. Sets the suppliers
         * */
        async loadSuppliers() {
            this.helper.getCollection("suppliers").then((suppliers) => {
                this.suppliers = suppliers;
            });
        },
        /**
         * @param {*} supplier
         * 
         * @description
         * 1. Adds the supplier to the database
         * 2. Adds the supplier to the suppliers array 
         */
        async createSupplier(supplier){
            const sid = await this.helper.addDoc("suppliers", supplier);
            this.suppliers[sid] = supplier;
        },
        /**
         * @param {*} sid - supplier id
         * @param {*} supplier - supplier object
         * 
         * @description
         * 1. Updates the supplier in the database
         * 2. Updates the supplier in the suppliers array
         */
        async updateSupplier(sid, supplier){
            await this.helper.setDoc("suppliers", sid, supplier);
            this.suppliers[sid] = supplier;
        },
        /**
         * @param {*} sid - supplier id
         * 
         * @description
         * 1. Deletes the supplier from the database
         * 2. Deletes the supplier from the suppliers array
         * 3. Deletes the supplier from the items array
         * */
        async deleteSupplier(sid){
            await this.helper.deleteDoc("suppliers", sid);
            delete this.suppliers[sid];
            products = useProductStore();
            const item = products.items.filter(item => item.sid == sid);
            item.sid = null;
            await this.helper.setDoc("items", item.iid, item);
        },
        
    },
    getters: {
        getSupplier: (state) => (sid) => {
            return state.suppliers[sid];
        },
        getAmountSuppliers: (state) => {
            return Object.keys(state.suppliers).length;
        },
    },
});