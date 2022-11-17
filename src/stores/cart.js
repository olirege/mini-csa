import { defineStore } from "pinia";
import { useProductStore } from "./products";
import { useHelperStore } from "./helpers";
export const useCartStore = defineStore("cart", {
  state: () => ({
    helper: useHelperStore(), 
    productStore: useProductStore(),
    cartHistory: [],
    oldCart: {},
    cartTimeStamps: null,
    cart: {},
    cartStatus: "",
    cid: null,
    carts: [],
    cartsDue: [],
    }),
  actions: {
    /**
     * 
     * @param {*} pid - product id 
     * @param {*} iid - item id
     * 
     * @description
     * 1. Look for the product in the cart
     * 2. If it's not there, add it
     * 3. If it is there and the cart isn't disabled, increment the quantity
     * 4. Change the cart status
     * 5. Save the cart
     *  
     */
    async addToCart(pid,iid){
        let p = this.cart.find(p => p.iid === iid);
        if (p){
            p.qty++;
            this.productStore.updateItemStock(pid,iid, 1);
        } else {
            if(this.cartStatus != "disabled"){
                this.cart.push({
                    pid: pid,
                    iid: iid,
                    name:this.productStore.products[pid].items[iid].name,
                    price:this.productStore.products[pid].items[iid].price,
                    qty: 1,
                    });
                this.productStore.updateItemStock(pid,iid, 1);
                if(this.cartStatus == "active-no-items"){
                    this.cartStatus = "active-with-items";
                }
            }
        }
        this.saveCart();
    },
    /**
     * 
     * @param {*} pid - product id
     * 
     * @param {*} iid
     * 
     * @description
     * 1. Look for the product in the cart
     * 2. If it's not there, do nothing
     * 3. If it is there, decrement the quantity
     * 4. If the quantity is 0, remove the product from the cart
     * 5. Change the cart status if needed
     * 6. Save the cart 
     */
    async removeFromCart(pid,iid){
        let p = this.cart.find(p => p.iid === iid);
        if (p){
            p.qty--;
            this.productStore.updateItemStock(pid,iid, -1);
            if (p.qty === 0){
                this.cart = this.cart.filter(p => p.iid !== iid);
                if(this.cart.length == 0){
                    this.cartStatus = "active-no-items";
                }
            }
        }
        this.saveCart();
    },    
    /**
     * 
     * @param {String} iid 
     * @returns - the products quantity in the cart
     * 
     * @description
     * 1. Look for the product in the cart
     * 2. If it's not there, return 0
     * 3. If it is there, return the quantity 
     */
    cartQty(iid){
        let p = this.cart.find(p => p.iid === iid);
        if (p){
            return p.qty;
        }
        return 0;
    },

    /**
     * 
     * @returns - the total price of the cart
     * 
     * @description
     * 1. Loop through the cart
     * 2. Add the price of each item to the total
     * 3. Return the total
     */
    cartTotal(){
        let total = 0;
        if ( this.cart && this.cart.length > 0){
            this.cart.forEach(p => {
                total += p.price * p.qty;
            });
        }
        return total;
    },

    /**
     * 
     * @param {*} uid 
     * 
     * @description
     * 1. Get the user's cart id
     * 2. Get the cart from firestore
     * 3. If the cart exists, load it
     * 
     */
    async loadCart(uid) {
        this.cid = uid
        this.helper.getDoc("carts", uid).then((doc) => {
            if (doc) {
                this.cart = doc.items;
                this.cartStatus = doc.cartStatus;
                this.cartTimeStamps = {createdAt:doc.createdAt, opensOn:doc.opensOn, closesOn:doc.closesOn};
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },    
    /**
     * @description
     * 1. loads the old orders of the user
     */
    async loadCartHistory() {
        this.helper.getDocSubCollectionWithLimit("oldcarts", this.cid, "orders", 10).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.cartHistory.push(doc);
            });
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    },

    /**
     * @description
     * 1. Saves the cart to firestore
     * */
    async saveCart() {
        this.helper.setDoc("carts", this.cid, {items: this.cart, cartStatus: this.cartStatus});
    },

    /**
    // async checkout() {
    //     const fb = useFirebaseStore();
    //     const user = useUserStore();
    //     const cartRef = doc(fb.db, "carts", this.cid);
    //     await runTransaction(fb.db, async (transaction) => {
    //         const cartDoc = await transaction.get(cartRef);
    //         if (!cartDoc.exists()) {
    //             throw "Document does not exist!";
    //         }
            
    //         let in4daysAtMidnight = new Date();
    //         in4daysAtMidnight.setDate(in4daysAtMidnight.getDate() + 4);
    //         in4daysAtMidnight.setHours(0,0,0,0);
    //         let in7daysAtMidnight = new Date();
    //         in7daysAtMidnight.setDate(in7daysAtMidnight.getDate() + 7);
    //         in7daysAtMidnight.setHours(0,0,0,0);
            
    //         const newCart = {
    //             items: [], 
    //             createdAt: new Date(),
    //             opensOn: in4daysAtMidnight,
    //             closesOn: in7daysAtMidnight,
    //         };
    //         this.cartTimeStamps = {createdAt:newCart.createdAt,opensOn:newCart.opensOn,closesOn:newCart.closesOn};
    //         const oid = Math.random().toString(36).substring(2, 15).toUpperCase();
    //         transaction.update(cartRef, {active: newCart, history: arrayUnion({
    //             oid:oid,
    //             createdAt:this.cartTimeStamps.createdAt,
    //             openedOn:this.cartTimeStamps.opensOn,
    //             closedOn:this.cartTimeStamps.closesOn,
    //             items:this.cart,
    //             total:this.cartTotal()})})
    //         // user.chargeUser(oid,this.cartTotal());
    //     });
    //     this.cart = [];
    // },
    */
    
    /**
     * 
     * @param {*} oid - order id
     * 
     * @description
     * 1. query orders collection group for the order
     * 2. if the order exists, assign it to state 
     */
    async getOlderCart(oid){
        this.helper.getCollectionGroupWhere("orders", "oid", "==", oid).then(
            (doc) => {
                this.oldCart = doc['oid']
        })
    },

    /**
     * @description
     * 1. Check if carts exists and if it does, reset it
     * 2. If it doesn't exist, get carts with items due today 
     */
    async getFullCartsDueToday() {
        const today = this.helper.dateFactory(0,0)
        if(this.carts.length > 0){
            this.carts = {};
        }
        this.helper.getCollectionWhere2XChain("carts",["cartStatus","closesOn"],["==","=="],["active-with-items",today],10)
        .then((docs) => {
            this.carts = docs;
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    },

    /**
     * @description
     * 1. Check if carts exists and if it does, reset it
     * 2. If it doesn't exist, get carts with items due for the next 7 days
     * 
     */
    async getCartsDueForNext7Days(){
        if (this.cartsDue.length > 0){
            this.cartsDue = [];
        }
        const todayMidnight = this.helper.dateFactory(0,0);
        const in7DaysMidnight = this.helper.dateFactory(7,0);
        this.helper.getCollectionWhere2XChain("carts", ["closesOn","closesOn"], [">","<"], [todayMidnight, in7DaysMidnight],10)
        .then(async (docs) => {
            this.cartsDue = this.assignCartsToSchedule(docs)
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    },
    /**
     * 
     * @returns - object with the upcoming 7 days
     * @description
     * 1.Creates a schedule of the next 7 days
     */
    initSchedule() {
        const datesOfUpcomingDays = {};
        for (let i = 0; i < 7; i++) {
            const date = this.helper.dateFactory(i,0);
            datesOfUpcomingDays[date.toDateString()] = [];
        }
        return datesOfUpcomingDays;
    },
    /**
     * 
     * @param {*} carts
     * @description
     * 1. Assigns carts to the schedule
     * @returns - Schedule with carts
     * 
     * */
    assignCartsToSchedule(docs){
        const schedule = this.initSchedule()
        docs.forEach((cart) => {
            const date = cart.data.closesOn.toDate().toDateString();
            if(Object.keys(schedule).includes(date)){
                schedule[date].push({id: cart.id, data: cart.data})
            }
        })
        return schedule
    } 
  }
});