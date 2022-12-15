import { defineStore } from 'pinia'
import { useFirebaseStore } from './firebase';
import { useHelperStore } from './helpers';
export const useUserStore = defineStore('user', {
    state: () => ({
      user: null,
      userProfile: "",
      helper: useHelperStore(),
    }),
    actions: {
        /**
         * 
         * @param {*} user - user object
         * 
         * @description
         * 1. Sets the user
         */
        setUser(user) {
            this.user = user;
        },
        /**
         * 
         * @description
         * 1. Gets the user profile from the database
         * 2. Sets the user profile
         */
        async getProfile(){
            this.userProfile = await this.helper.getDoc("users", this.user.uid);
        },
        /**
         * 
         * @description
         * 1. Updates the user profile in the database
         */
        async saveProfileChanges(changes){
            const resp = await this.helper.setDoc("users", this.user.uid, changes);
            //merge the changes with the current profile
            if(resp){
                this.userProfile = {
                    ...this.userProfile,
                    ...changes,
                }
                return true;
            }else{
                console.log("Error saving changes");
                return false;
            }
        },
        
        /**
         * 
         * @param {*} cc
         * 
         * @description
         * 1. Posts request to the server to remove the credit card 
         */
        async removeCC(cc){
            const fb = useFirebaseStore();
            const resp = await this.helper.useRESTfulAPI(
                fb.api.removeCC,
                "POST",
                {
                    ...cc,
                    uid: this.user.uid,
                }
            )
            if(resp){
                const index = this.userProfile.cc.indexOf(cc)
                this.userProfile.cc.splice(index, 1);
                return true;
            }else{
                return false
            }
        },   
    },
    getters: {
        /**
         * 
         * @param {*} state - state object
         * @returns - boolean
         * 
         * @description
         * 1. Checks if the user is logged in
         */
        isLogged: (state) => {
            return state.user != null;
        },
        /**
         * 
         * @param {*} state - state object
         * @returns - boolean
         * 
         * @description
         * 1. Checks if the user is an admin
         */
        isAdmin: (state) => {
            return state.userProfile != null && state.userProfile.isAdmin;
        }
    }
  })