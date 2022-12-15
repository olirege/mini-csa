<template>
    <section>
        <div class="section-header">
            <div class="section-image" ></div>
            <span class="col- gap05">
                <div class='row- w100 border-bottom-lg align-center pd05 bg-blk-lgtr border-radius-mix1 h3rem'>
                    <div class="txt-skeleton big"></div>
                </div>
                <div class='row- w100 border-bottom-lg align-center pd05 pd1lft italic bg-wht border-radius-mix2 h3rem'>
                    <div class="txt-skeleton medium"></div>
                </div>
            </span>
        </div>
    </section>
</template>
<style scoped>
section{
    width:100%;
}
.txt-skeleton{
    background-color: var(--vt-c-secondary-dark);
    animation:pulse-bg 5s infinite;
}
.big{
    height: 1.5rem;
    width: 12rem;
}
.medium{
    height: 1.25rem;
    width: 8rem;
}
.section-title{
    font-size: 2rem;
    font-weight: 400;
    color: #333;
    padding: 0 1rem;
    margin-bottom: 0.5rem;
    background-color: var(--vt-c-);
}
.section-header{
    display:flex;
    flex-direction: column;
}
.section-image{
    height: 15rem;
    background-color: var(--vt-c-secondary-dark);
    border-radius: 10px 0px;
    width:100%;
}
.section-subtitle{
    font-size: 1rem;
    font-weight: 350;
    font-style: italic;
    color: #333;
    padding: 0 1.5rem;
    margin-bottom: 0.5rem;
}
@keyframes pulse-bg{
        0%{
            background-color: var(--vt-c-secondary-dark);
        }
        50%{
            background-color: var(--vt-c-secondary);
        }
        100%{
            background-color: var(--vt-c-secondary-dark);
        }
    }
</style>