<script>
import { reactive, onMounted,ref } from "vue";
import { useTextStore } from "../stores/text";
import { useFirebaseStore } from "../stores/firebase";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
    setup() {
        const textStore = useTextStore();
        const fb = useFirebaseStore();
        const userStore = useUserStore();
        const router = useRouter();
        const user = reactive({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            tel: "",
            postalCode: "",
        });
        const borderStyle = "1px solid red"
        function onSubmitStep(){
            if (!validateFields()){
                axios({
                    method: 'post',
                    url: fb.api.createUserWithEmailAndPassword,
                    data: {
                        user: user
                    }
                })
                .then((resp) => {
                    if (resp.status === 200){
                        fb.signInUser(user.email, user.password)
                        .then(() => {
                        if(userStore.isLogged){
                            router.push('store')
                            }
                        })
                        .catch((error) => {
                        console.log(error)
                        })
                    }
                })
                .catch((err) => {
                    if (err.response.status === 501){
                        document.getElementById("user-info-form__input--email").style.border = borderStyle;
                        document.getElementById("user-info-form__p--email").innerHTML = textStore.text.user.error.email;
                        return ""
                    }
                })
        }
        }
        function validateFields(){
            let hasError = false
            if(firstNameValidation()){
                document.getElementById("user-info-form__input--firstName").style.border = borderStyle ;
                document.getElementById("user-info-form__p--firstName").innerHTML = firstNameValidation();
                hasError = true
            }
            else{
                document.getElementById("user-info-form__input--firstName").style.border = "1px solid #e2e8f0" ;
                document.getElementById("user-info-form__p--firstName").innerHTML = "";
            }
            if(lastNameValidation()){
                document.getElementById("user-info-form__input--lastName").style.border = borderStyle;
                document.getElementById("user-info-form__p--lastName").innerHTML = lastNameValidation();
                hasError = true
            }
            else{
                document.getElementById("user-info-form__input--lastName").style.border = "1px solid #e2e8f0" ;
                document.getElementById("user-info-form__p--lastName").innerHTML = "";
            }
            if(emailValidation()){
                document.getElementById("user-info-form__input--email").style.border = borderStyle;
                document.getElementById("user-info-form__p--email").innerHTML = emailValidation();
                hasError = true
            }
            else{
                document.getElementById("user-info-form__input--email").style.border = "1px solid #e2e8f0" ;
                document.getElementById("user-info-form__p--email").innerHTML = "";
            }
            if(passwordValidation()){
                document.getElementById("user-info-form__input--password").style.border = borderStyle;
                document.getElementById("user-info-form__p--password").innerHTML = passwordValidation();
                hasError = true
            }
            else{
                document.getElementById("user-info-form__input--password").style.border = "1px solid #e2e8f0" ;
                document.getElementById("user-info-form__p--password").innerHTML = "";
            }
            if(telValidation()){
                document.getElementById("user-info-form__input--tel").style.border = borderStyle;
                document.getElementById("user-info-form__p--tel").innerHTML = telValidation();
                hasError = true
            }
            else{
                document.getElementById("user-info-form__input--tel").style.border = "1px solid #e2e8f0" ;
                document.getElementById("user-info-form__p--tel").innerHTML = "";
            }
            // if(postalCodeValidation()){
            //     document.getElementById("user-info-form__input--postalCode").style.border = borderStyle;
            //     document.getElementById("user-info-form__p--postalCode").innerHTML = postalCodeValidation();
            //     hasError = true
            // }
            // else{
            //     document.getElementById("user-info-form__input--postalCode").style.border = "1px solid #e2e8f0" ;
            //     document.getElementById("user-info-form__p--postalCode").innerHTML = "";
            // }
            return hasError
        }
        function firstNameValidation() {
            if (user.firstName.length < 2) {
                return "*First name must be at least 2 characters";
            }
            if (user.firstName.length > 20) {
                return "*First name must be less than 20 characters";
            }
            if (user.firstName.match(/[^a-zA-Z]/)) {
                return "*First name must contain only letters";
            }
            return "";
        }
        function lastNameValidation() {
            if (user.lastName.length < 2) {
                return "*Last name must be at least 2 characters";
            }
            if (user.lastName.length > 20) {
                return "*Last name must be less than 20 characters";
            }
            if (user.lastName.match(/[^a-zA-Z]/)) {
                return "*Last name must contain only letters";
            }
            return "";
        }
        function emailValidation() {
            if (user.email.length < 5) {
                return "*Valid email is required";
            }
            if (user.email.length > 256) {
                return "*Email must be less than 256 characters";
            }
            if (!user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                return "*Email must be a valid email address";
            }
            if (user.email.match(/[^a-zA-Z0-9@.]/)) {
                return "*Email must contain only letters, numbers, @ and .";
            }
            return "";
            
        }
        function passwordValidation() {
            if (user.password.length < 8) {
                return "*Password must be at least 8 characters";
            }
            if (user.password.length > 50) {
                return "*Password must be less than 50 characters";
            }
            if (!user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
                return "*Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number";
            }
            return "";
        }
        function telValidation() {
            if (user.tel.length != 10) {
                return "*Telephone must be 10 numbers";
            
            }
            if (!user.tel.match(/^[0-9]+$/)) {
                return "*Telephone must contain only numbers";
            }
            return "";
        }
        // function postalCodeValidation() {
        //     if (user.postalCode.replace(' ', '').length != 6) {
        //         return "*Postal code must be 6 characters";
        //     }
        //     return "";
        // }
        function initAutoCompletePostalCode(){
            var options = {
                types: ['(regions)'],
                componentRestrictions: {country: "ca"}
            };
            var input = document.getElementById('user-info-form__input--postalCode');
            var autocomplete = new google.maps.places.Autocomplete(input, options);
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                var postalCode = place.address_components.find(function(component){
                    user.postalCode = input.value;                    
                    return component.types.includes("postal_code")
                })
                if(postalCode){
                    document.getElementById("user-info-form__input--postalCode").value = postalCode.long_name;
                }
            });
        }
        onMounted(() => {
            //TODO - add google maps on mounted && remove on unmounted
            initAutoCompletePostalCode();
        });
            
        
        return {
            textStore,
            user,
            onSubmitStep,
        };
    },
}
</script>
<template>
    <main class="subscribe">
        <h2>{{textStore.text.signUp.subscribe}}</h2>
        <form action="" class="user-info-form">
            <div class="input-wrapper" v-for ='(value, key) in user' :key='key'>
            <input
                :placeholder='textStore.text.signUp.placeholders[key]'
                v-model='user[key]'
                required
                :type="key === 'password' ? 'password' : 'text' || key === 'email' ? 'email' : 'text' || key === 'tel' ? 'tel' : 'text'"
                :pattern="key === 'password' ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ : '' || key === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : '' || key === 'tel' ? /^[0-9]+$/ : ''"
                :minlength="key === 'password' ? 8 : '' || key === 'email' ? 2 : '' || key === 'tel' ? 10 : '' || key === 'postalCode' ? 6 : '' || key === 'firstName' ? 2 : '' || key === 'lastName' ? 2 : ''" 
                :maxlength="key === 'password' ? 50 : '' || key === 'email' ? 256 : '' || key === 'tel' ? 10 : '' || key === 'postalCode' ? 6 : ''"
                :id="'user-info-form__input--' + key"
            />
            <p :id="'user-info-form__p--' + key"></p>
            </div>
            <button @click.prevent="onSubmitStep">Submit</button>
        </form> 
    </main>
</template>
<style scoped>
.user-info-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.user-info-form > button{
    margin-top: 20px;
    width: 10rem;
    height: 2rem;
    border-radius: 1rem;
    border: none;
    background-color: #000;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
}
.user-info-form > .input-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 3rem;
    gap: 0.2rem;
    margin-bottom: 10px;
}
.user-info-form > .input-wrapper > input{
    outline:none;
    height:1.8rem;
    width:12rem;
    border-radius: 5px;
    border: 1px solid #000;
}
.user-info-form > .input-wrapper > p{
    color: red;
    height: 0.8rem;
    font-size: 0.7rem;
}
</style>
