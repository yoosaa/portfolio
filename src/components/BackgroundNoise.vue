<template>
    <div id="overlay"></div>
</template>


<style>
#overlay{
    position: fixed;
    top: 0;
    left: 0;
    opacity: .5;
    width: 100vw;
    height: 100vh;
    opacity: 0.3;
    background: url("../assets/img/sand.jpg");
    animation: noise_anim 1s steps(10) infinite;
}

@keyframes noise_anim{
    from {
        background-position: 0 0;
    }
    to{
        background-position: 123px 456px;
    }
}
</style>