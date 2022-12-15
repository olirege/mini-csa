<template>
    <div class="store-card-wrapper">
        <TheCard>
            <template #image>
                <img v-if='image' id="card-image" :src="image" alt="Product thumbnail">
                <div class="flex center h100 w100" v-else>
                    <i class="bi bi-image"></i>
                </div>
            </template>
            <template #title>
                <span class="custom-card-title">
                    <h3>{{formatString(productName, 0, 13, true, false, 'end')}}</h3>
                    <h5>{{formatString(productSupplier, 0, 13, true, false, 'end')}}</h5>
                </span>
            </template>
            <template #body>
                <span>
                    <p>{{productBlurb}}</p>
                    <p>{{formatNumber(productPrice)}}/{{productUnit}}</p>
                </span>
            </template>
            <template #extras>
                <button>+</button>
                <button>-</button>
            </template>
        </TheCard>
    </div>
</template>
<script>
import { useHelperStore } from '../../stores/helpers'
import TheCard from '../common/TheCard.vue'
export default {
    components: {
        TheCard,
    },
    props: {
        image: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        productSupplier: {
            type: String,
            required: true
        },
        productBlurb: {
            type: String,
            required: true
        },
        productPrice: {
            type: Number,
            required: true
        },
        productUnit: {
            type: String,
            required: true
        }
    },
    setup() {
        const helperStore = useHelperStore()
        const formatString = helperStore.formatStringToSubstring
        const formatNumber = helperStore.formatNumberToCurrency
        return {
            formatString,
            formatNumber,
        }
    }
}
</script>

<style scoped>
.store-card-wrapper{
    width: 195px;
    height: 246px;
    overflow: hidden;
}
#card-image{
    width: 100%;
    height: 100%;
    object-fit: cover;
    color: var(--vt-c-white-mute);
    text-align: center ;
    
}
</style>