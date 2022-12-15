<template>
    <div class="card-wrapper" :class="{'active':isActive}">
        <div class="content" 
        :class="{
            'smaller':isSmall,
            'sideways':isSideways,
            'height-grow':isHeightDynamic,
            'border-radius-none': borderRadius === '0',
            'border-radius-small': borderRadius === '5px',
            'border-radius-large': borderRadius === '10px',
            'border-radius-mix1': borderRadius === 'mix1',
            'border-radius-mix2': borderRadius === 'mix2',
            }">
            <slot name="overlay"></slot>
            <div class="image-wrapper" :class="{'disabled': !hasImage}">
                <slot name="image"></slot>
            </div>
            <div class="title" :class="{
                'larger': !hasImage,
                'smaller': isSmall,
                }" v-if="hasTitle">
                <slot name="title"></slot>
            </div>
            <div class="body" :class="{
                'larger': !hasImage,
                'smaller': isSmall,
                'align-center': bodyStyle === 'align-center',
                'align-end': bodyStyle === 'align-end',
                'align-start': bodyStyle === 'align-start',
                
                }">
                <slot name="body"></slot>
            </div>
            <div class="extras" v-if="hasExtras">
                <slot name="extras"></slot>
            </div>           
        </div>
    </div>
</template>
<script>
 export default ({
    props: {
        isSmall: {
            type: Boolean,
            default: false
        },
        hasImage: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        isSideways: {
            type: Boolean,
            default: false,
        },
        isHeightDynamic:{
            type: Boolean,
            default: false,
        },
        hasTitle: {
            type: Boolean,
            default: true,
        },
        hasExtras: {
            type: Boolean,
            default: true,
        },
        bodyStyle:{
            type: String,
            default: 'align-center',
            validator(value) {
                return ['align-center', 'align-end', 'align-start'].includes(value);
            },
        },
        borderRadius:{
            type: String,
            default: '5px',
            validator(value) {
                return ['0', '5px', '10px', 'mix1', 'mix2'].includes(value);
            },            
        },
    },
})
</script>

<style scoped>
.active{
    border: 2px solid green;
    border-radius: 5px;
}
.content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 246px;
    background-color: #fff;
    box-shadow: 0 1px 1px 0 rgba(0,0,0,0.2);
    border: 1px solid var(--color-border);
    padding-bottom: 0.5rem;
    z-index:3;
}
.content.height-grow{
    height: auto;
}
.content.smaller{
    height: 140px;
    padding-bottom: 0;
    display:block;
}
.sideways{
    flex-direction: row;
    height: 100%;
    width: 100%;
    padding: 0.1rem;
}
.sideways > .image-wrapper{
    border-radius: 5px 0 0 5px;
    height:auto;
    max-width:50%;
    align-items: flex-start;
    overflow:hidden;
}
.sideways > .title{
    width: 100%;
    height: 100%;
}
.sideways > .body{
    width:100%;
    height:100%;
}
.title.smaller{
    margin-top: 0.1rem;
    padding: 0;
}
.image-wrapper{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 45%;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
}
.disabled{
    display:none;
}
.title{
    width: 100%;
    height: 17%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0 .5rem;
}
.title.larger{
    height: 20%;
    padding: 0;
}
.body{
    width: 100%;
    height: 23%;
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    font-weight: 400;
    padding: 0 .5rem;
}
.body.smaller{
    height:auto;
    padding:0;
    justify-content: flex-end;
}
.body.larger{
    height: 65%;
}
.extras{
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 400;
    padding: 0 .5rem;
}
</style>