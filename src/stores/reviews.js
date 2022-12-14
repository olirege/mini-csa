import { defineStore } from "pinia";
import { useHelperStore } from "./helpers";
import { useUserStore } from "./user";

export const useReviewsStore = defineStore("reviews", {
    state: () => ({
        helper: useHelperStore(),
        reviewList : [], // all reviews
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
        loadReviewList() {
            this.reviewList = [];
            for(let iid of Object.keys(this.reviews)){
                for (let uid of Object.keys(this.reviews[iid])){
                    this.reviews[iid][uid].iid = iid
                    this.reviews[iid][uid].uid = uid
                    this.reviewList.push(this.reviews[iid][uid])
                }
            }
        },
        async loadReviews() {
            const reviews = await this.helper.getCollection("reviews")
            this.reviews = reviews;
            this.loadReviewList();
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
                if(reviews){
                    this.itemReviews = reviews;
                }else{
                    this.itemReviews = {};
                }
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
            const resp = await this.helper.setDoc("reviews", iid, data )
            await data.timestamp
            this.itemReviews[uid] = data;
            return resp;
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
            data[ids.uid] = {reply:reply}
            console.log(data)
            const resp = await this.helper.setDoc("reviews",ids.iid, data)
            this.reviews[ids.iid][ids.uid].reply = reply
            if(resp){
                return true
            }else{
                console.log("Error adding reply")
                return false
            }
        },
        /**
         * 
         * @description
         * 1. Checks if a logged user as already reviewed an item
         */    
        hasUserReviewed(){
            const userStore = useUserStore();
            const uid = userStore.user.uid;
            for(let key of Object.keys(this.itemReviews)){
                if(key === uid){
                    return true;
                }
            }
            return false;
        },
    },
    getters: {
        getAmountAllReviews: (state) => {
            return state.reviewList.length;
        },
    },
});