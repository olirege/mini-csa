import { defineStore } from "pinia";
import { useHelperStore } from "./helpers";
export const useRecipeStore = defineStore("recipes", {
    state: () => ({
        helper: useHelperStore(),
        recipes: {},
        units: [
            "milligrams",
            "grams",
            "milliliters",
            "teaspoons",
            "tablespoons",
            "cups",
            "liters",
            "ounces",
            "quarts",
            "gallons",
            "pints",
        ],
        drafts:{},
    }),
    actions: {
    
        async loadRecipes() {
            this.helper.getCollection("recipes").then((recipes) => {
                this.recipes = recipes;
            });
        },

        async loadDrafts(rid){
            this.drafts = await this.helper.getDocSubCollectionWithLimit("recipes",rid,"drafts",10)
        },
    
        async createDraft(rid){
            const did = Math.random().toString(36).substring(2, 15).toUpperCase()
            const timestamp = this.helper.timestampFactory()
            const draft = {
                name: "New Draft",
                ingredients: [],
                created: timestamp,
                updated: timestamp,
            }
            const resp = await this.helper.setDocInSubcollection("recipes", rid, 'drafts', did, draft);
            if(resp){
                this.drafts[did] = draft;
                return did
            }else{
                console.log(resp)
                return false
            }
        },
    
        async saveDraft(rid, draft){
            const resp = await this.helper.setDocInSubcollection("recipes", rid, 'drafts', draft.key, draft.data);
            if(resp){
                return true
            }else{
                return false
            }
        },
        async deleteDraft(rid, draft){
            const resp = await this.helper.deleteDocInSubcollection("recipes", rid, 'drafts', draft.key);
            if(resp){
                delete this.drafts[draft.key];
                return true
            }else{
                return false
            }
        },

        async updateRecipe(rid, recipe){
            const resp = await this.helper.setDoc("recipes", rid, recipe);
            if(resp){
                this.recipes[rid] = recipe;
                return true
            }else{
                console.log(resp)
                return false
            }
        },
        
        async deleteRecipe(rid){
            await this.helper.deleteDoc("recipes", rid);
            delete this.recipes[rid];
        },
        
    },
    getters: {
        getRecipe: (state) => (rid) => {
            return state.recipes[rid];
        },
        getAmountRecipes: (state) => {
            return Object.keys(state.recipes).length;
        },
    },
});