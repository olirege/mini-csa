//@ts-check
/**
 * store with payment processing functions and states
 */
import { defineStore } from "pinia"; 
import { useFirebaseStore } from "./firebase";
import { useHelperStore } from "./helpers";
export const usePaymentStore = defineStore("payment", {
    state: () => ({
        paymentApi: "https://pay.sandbox.realexpayments.com/pay",
        paymentStatus: "",
        paymentMessage: "",
        fb: useFirebaseStore(),
        helper: useHelperStore(),
        currency: "CAD",

    }),
    actions: {
        /**
         * Functions that initializes the Hosted Payment Page(HPP)
         * 
         * @description
         * 1. Checks if iframe element is already present
         * 2. If not, creates it. If so, removes it to create a new one
         * 3. Gets the HPP data from the server
         * 4. Then sets the iframe src to the HPP url
         * 5. Sets the iframe to be embedded in the page
         * 6. Sets the callback function that will process the response from the Realex
         */
        initHpp() {
            if(document.querySelector("#iframeId")){
                //@ts-ignore
              document.querySelector("#iframeId").remove();
            }
            const newIFrame = document.createElement("iframe")
            newIFrame.id = "iframeId"
                //@ts-ignore
                //@todo - id should be dynamic
            document.querySelector(".router-wrapper").append(newIFrame);
            this.helper.useRESTfulAPI(
                this.fb.api.getRealexHpp,
                'get',
            ).then((resp) => {
            //   showSubcribe.value = true
                //@ts-ignore
              RealexHpp.setHppUrl(paymentApi);
                //@ts-ignore
              RealexHpp.embedded.init(
              "autoload", 
              "iframeId",
              (awnser, close) => {
                this.handleResponse(awnser, close)
              },
              resp.data)
            })
        },
        handleResponse(awnser, close){
            this.helper.useRESTfulAPI(
              'post',
              this.fb.api.RealexHppEndpoint,
              {
                ...awnser
              },
            ).then((resp) =>{
              console.log(resp)
            }).catch((err) =>{
              console.log(err.error)
              this.initHpp();
            })
          }
        //  function initHpp() {
        //     if(document.querySelector("#iframeId")){
        //       document.querySelector("#iframeId").remove();
        //     }
        //     const newIFrame = document.createElement("iframe")
        //     newIFrame.id = "iframeId"
        //     document.querySelector(".router-wrapper").append(newIFrame);
        //     axios({
        //       method:'get',
        //       url: fb.api.getRealexHpp
        //     }).then((resp) => {
        //       showSubcribe.value = true
        //       RealexHpp.setHppUrl("https://pay.sandbox.realexpayments.com/pay");
        //       RealexHpp.embedded.init(
        //       "autoload", 
        //       "iframeId",
        //       (awnser, close) => {
        //         handleResponse(awnser, close)
        //       },
        //       resp.data)
        //     })
        //   }
        //   function handleResponse(awnser, close){
        //     axios({
        //       method:'post',
        //       url:fb.api.RealexHppEndpoint,
        //       data: {
        //         ...awnser
        //       },
        //     }).then((resp) =>{
        //       console.log(resp)
        //     }).catch((err) =>{
        //       console.log(err.error)
        //       initHpp();
        //     })
        //   }
    },
});