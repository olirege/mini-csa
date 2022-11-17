import { defineStore } from "pinia";
import { useHelperStore } from "./helpers";
import { useUserStore } from "./user";

export const useReviewsStore = defineStore("reviews", {
    state: () => ({
        helper: useHelperStore(),
        reviews: {}, // all reviews by id
        itemReviews: {}, // all reviews by item id 
        review: null, // the selected review
    }),
    actions: {
        /**
         * @description
         * 1. Gets the reviews from the database
         * 2. Sets the reviews
         */
        async loadReviews() {
            this.helper.getCollection("reviews").then((reviews) => {
                this.reviews = reviews;
            });
        },
        /**
         * 
         * @param {*} iid 
         * 
         * @description
         * 1. Gets the reviews for the item from the database
         * 2. Sets the item reviews
         */
        async getItemReviews(iid){
            this.helper.getDoc("reviews",iid).then((reviews) => {
                this.itemReviews = reviews;
            });
        },
        /**
         * 
         * @param {*} iid - item id
         * @param {*} review - review object
         * 
         * @description
         * 1. Creates object for the review
         * 1. Adds the review to the database
         * 2. Adds the review to the item reviews
         */
        async addReview(iid, review){
            const uid = useUserStore().user.uid;
            const data = {}
            data[uid] = review;
            this.itemReviews[iid] = data;
            await this.helper.setDoc("reviews", iid, data )
        },
        /**
         * 
         * @param {*} ids - review ids
         * @param {*} reply - reply object
         * 
         * @description 
         * 1. Creates object for the reply
         * 2. Adds the reply to the review in the database
         * 3. Adds the reply to the review in the item reviews
         */
        async addReply(ids,reply){
            const data = {}
            data[ids[1]] = reply;
            this.helper.setDoc("reviews",ids.iid, data).then(() => {
                this.reviews[ids.iid][ids.uid].reply = reply
                }).catch((error) => {
                console.error("Error adding reply: ", error);
            });
        },
        /**
         * 
         * @description
         * 1. Checks if a logged user as already reviewed an item
         */    
        hasUserReviewed(){
            const user = useUserStore();
            return this.itemReviews[user.user.uid] != null;
        },
    },
});