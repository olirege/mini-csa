<script>
import { useFirebaseStore } from '../../../stores/firebase'
import { useUserStore } from '../../../stores/user'
import axios from 'axios'

export default async function initHpp() {
    const fb = useFirebaseStore()
    const userStore = useUserStore()
    if(document.querySelector("#iframeId")){
        document.querySelector("#iframeId").remove();
    }

    const newIFrame = document.createElement("iframe")
    newIFrame.id = "iframeId"
    document.getElementById("realex-wrapper").append(newIFrame);
    axios({
        method:'get',
        url: fb.api.getRealexHpp
    }).then((resp) => {
        RealexHpp.setHppUrl("https://pay.sandbox.realexpayments.com/pay");
        RealexHpp.embedded.init(
        "autoload", 
        "iframeId",
        (awnser, close) => {
        handleResponse(awnser, close)
        },
        resp.data)
    })
    async function handleResponse(awnser){
        axios({
            method:'post',
            url:fb.api.RealexHppEndpoint,
            data: {
            ...awnser,
            uid: userStore.user.uid
            },
        }).catch((err) =>{
            console.log(err)
            initHpp();
        }).then((
            userStore.getProfile()
        ))
    }
    return {
    };
}
</script>