import { defineStore } from "pinia";
export const useTextStore = defineStore("text", {
  state: () => ({
    text: {
      login: {
        welcome: "Bienvenue!",
        subtitle: "Sign in to continue",
        welcomeBack: "Welcome back",
        login: "Log in",
        signup: "Sign up",
        email: "Email",
        password: "Password",
      },
      signUp: {
        subscribe: "Subscribe to our shop",
        placeholders:{
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email (example@domain.com)",
          password: "Password (min 8 characters)",
          tel: "Phone Number",
          postalCode: "Postal Code",
        },
      },
      user: {
        error:{
          email: "Email already in use",
        }
      }
    },
    // ...
  }),
  getters: {},
});
