<script>
import { useRouter } from 'vue-router';
import { useTextStore } from "../stores/text";
import { useFirebaseStore } from "../stores/firebase";
import { useUserStore } from "../stores/user";
import { ref } from "vue";
import axios from "axios";
export default ({
  setup() {
    const textStore = useTextStore();
    const router = useRouter();
    const text = textStore.text;
    const fb = useFirebaseStore();
    const user = useUserStore();
    const email = ref("");
    const password = ref("");
    const showSubcribe = ref(false)
   
    function login() {
      fb.signInUser(email.value, password.value)
        .then(() => {
          if(user.isLogged){
             router.push('store')
             fb.loginError = null
             user.getProfile()
            }
        })
        .catch((error) => {
          console.log(error)
        })
    }
    function signUp(){
      router.push("subscribe")
    }

    function initHpp() {
      if(document.querySelector("#iframeId")){
        document.querySelector("#iframeId").remove();
      }
      const newIFrame = document.createElement("iframe")
      newIFrame.id = "iframeId"
      document.querySelector(".router-wrapper").append(newIFrame);
      axios({
        method:'get',
        url: fb.api.getRealexHpp
      }).then((resp) => {
        showSubcribe.value = true
        RealexHpp.setHppUrl("https://pay.sandbox.realexpayments.com/pay");
        RealexHpp.embedded.init(
        "autoload", 
        "iframeId",
        (awnser, close) => {
          handleResponse(awnser, close)
        },
        resp.data)
      })
    }
    function handleResponse(awnser, close){
      axios({
        method:'post',
        url:fb.api.RealexHppEndpoint,
        data: {
          ...awnser
        },
      }).then((resp) =>{
        console.log(resp)
      }).catch((err) =>{
        console.log(err.error)
        initHpp();
      })
    }
    return {
      text,
      login,
      signUp,
      email,
      password,
      user,
      fb,
      showSubcribe,
    };
  },
});
</script>

<template>
  <main class="home">
    <div class="login" >
        <div class="header">
          <h2 class="header-title">{{ text.login.welcome }}</h2>
          <p class="header-subtitle" v-if="!user.isLogged">
            {{ text.login.subtitle }}
          </p>
        </div>
        <div class="login-form" v-if="!user.isLogged">
            <input
            :placeholder="text.login.email"
            class="login-form-input"
            type="text"
            v-model="email"
            />
            <input
            :placeholder="text.login.password"
            class="login-form-input"
            type="password"
            v-model="password"
            />
            <span>
                <button class="login-button" @click="login">{{
                text.login.login
                }}</button>
                <button class="signup-button" @click="signUp">{{
                text.login.signup
                }}</button>
            </span>
        </div>
        <h5 class="error-message" v-if="fb.loginError">{{fb.loginError}}</h5>
      </div>
      <div class='router-wrapper'>
        <RouterView />
      </div>  
</main>
</template>
<style>
.home {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 2rem;
}
.router-wrapper{
  position: fixed;
  top: calc(50% - 15rem);
  right: 2rem;
  width: 30rem;
  height: 30rem;
}
.router-wrapper >>> #iframeId{
  width: 100%;
  height: 100%;
  border:none;
}
.login-form{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.login-form span{
    width:100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    
}
.login-form input{
    outline: none;
}
</style>