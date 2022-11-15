import { defineStore } from "pinia";
import { collection, getDoc, setDoc, doc, getDocFromCache, runTransaction, getDocs, where, query,arrayUnion, collectionGroup, addDoc } from "firebase/firestore";
import { useFirebaseStore } from "../stores/firebase";
export const useReviewsStore = defineStore("reviews", {
    state: () => ({
        reviews: {},
        review: null,
        reviewId: null,
    }),
    actions: {
        async loadReviews() {
            const fb = useFirebaseStore();
            const reviewsRef = collectionGroup(fb.db, "reviews");
            const querySnapshot = await getDocs(reviewsRef);
            querySnapshot.forEach((doc) => {
                this.reviews[doc.id] = {...doc.data(), iid: doc.ref.parent.parent.id, pid: doc.ref.parent.parent.parent.parent.id};
            });
        },
        async addReply(ids,reply){
            // add reply to subcollection reviews
            const fb = useFirebaseStore();
            const reviewRef = doc(fb.db, "products", ids.pid, "item", ids.iid, "reviews", ids.rid);
            await setDoc(reviewRef, { reply: reply }, { merge: true }).then(() => {
                this.reviews[ids.rid].reply = reply
                console.log("reply added", ids.rid, reply);
                }).catch((error) => {
                console.error("Error adding reply: ", error);
            });
        },
    },
    getters: {
        getReview: (state) => (rid) => {
            return state.reviews[rid];
        },
    },
});