import { defineStore } from "pinia";
import { useHelperStore } from "./helpers";
import densityTable from "./utils/density.json"
export const useIngredientStore = defineStore("ingredients", {
    state: () => ({
        helper: useHelperStore(),
        ingredients: {},
        units: [
            "milligrams",
            "grams",
            "kilograms",
            "ounces",
            "pounds",
            "milliliters",
            "liters",
        ],
        mlConvertionTable: {
            "milliliters": 1,
            "liters": 1000,
            "teaspoons": 4.92892,
            "tablespoons": 14.7868,
            "cups": 236.588,
            "pints": 473.176,
            "quarts": 946.353,
            "gallons": 3785.41,
        },
        gramsConvertionTable: {
            "milligrams": 0.001,
            "ounces": 29.5735,
            "pounds": 454,
            "grams": 1,
            "kilograms": 1000,
        },
        
        densityTable: densityTable,
    }),
    actions: {
    
        async loadIngredients() {
            this.helper.getCollection("ingredients").then((ingredients) => {
                this.ingredients = ingredients;
            });
        },
    
        async createIngredient(ingredient){
            const ingid = await this.helper.addDoc("ingredients", ingredient);
            this.ingredients[ingid] = ingredient;
        },
    
        async updateIngredient(ingid, ingredient){
            const resp = await this.helper.setDoc("ingredients", ingid, ingredient);
            if(resp){
                this.ingredients[ingid] = ingredient;
                return true
            }else{
                console.log(resp)
                return false
            }
        },
    
        async deleteIngredient(ingid){
            await this.helper.deleteDoc("ingredients", ingid);
            delete this.ingredients[ingid];
        },
        
    },
    getters: {
        getIngredient: (state) => (ingid) => {
            return state.ingredients[ingid];
        },
        getAmountIngredients: (state) => {
            return Object.keys(state.ingredients).length;
        },
        getTotalCost: (state) => {
            let sum = 0
            const ingredients = Object.values(state.ingredients)
            const total = ingredients.forEach(ingredient => sum += ingredient.cost * ingredient.qty)
            return total
        }
    },
});