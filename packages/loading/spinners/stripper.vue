<template>
    <div class="line-scale-pulse-out" style="text-align: center;">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
</template>

<script>
export default {
  name: 'stripper-spinner',
};
</script>

<style scoped>
  .line-scale-pulse-out > div {
    background-color: #4385FF;
    width: 5px;
    height: 35px;
    border-radius: 2px;
    margin: 2px;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block;
    animation: line-scale-pulse-out 0.9s 0s infinite cubic-bezier(.85, .25, .37, .85);
    -webkit-animation: line-scale-pulse-out 0.9s 0s infinite cubic-bezier(.85, .25, .37, .85);
    -moz-animation: line-scale-pulse-out 0.9s 0s infinite cubic-bezier(.85, .25, .37, .85);
    -ms-animation: line-scale-pulse-out 0.9s 0s infinite cubic-bezier(.85, .25, .37, .85);
    -o-animation: line-scale-pulse-out 0.9s 0s infinite cubic-bezier(.85, .25, .37, .85);
     }
  .line-scale-pulse-out > div:nth-child(2), .line-scale-pulse-out > div:nth-child(4) {
    animation-delay: 0.2s !important;
    -webkit-animation-delay: 0.2s !important;
    -moz-animation-delay: 0.2s !important;
    -ms-animation-dely:0.2s !important;
    -o-animation-delay: 0.2s !important;
     }
  .line-scale-
  pulse-out > div:nth-child(1), .line-scale-pulse-out > div:nth-child(5) {
    animation-delay: 0.4s !important;
    -webkit-animation-delay: 0.4s !important;
     -moz-animation-delay: 0.4s !important;
    -ms-animation-dely:0.4s !important;
    -o-animation-delay: 0.4s !important;
     }
   @keyframes line-scale-pulse-out {
    0% {
      -webkit-transform: scaley(1);
      transform: scaley(1); }

    50% {
      -webkit-transform: scaley(0.4);
      transform: scaley(0.4); }

    100% {
      -webkit-transform: scaley(1);
      transform: scaley(1); } }
  @-webkit-keyframes line-scale-pulse-out {
    0% {
      -webkit-transform: scaley(1);
      transform: scaley(1); }

    50% {
      -webkit-transform: scaley(0.4);
      transform: scaley(0.4); }

    100% {
      -webkit-transform: scaley(1);
      transform: scaley(1); } }
    @-ms-keyframes line-scale-pulse-out {
      0% {
        -ms-transform:scale(1);
        }

      50% {
        -ms-transform: scale(.4);}

      100% {
        -ms-transform:scale(1); }
    }
    @-moz-keyframes line-scale-pulse-out {
      0% {
        -moz-transform:scale(1);
        }

      50% {
        -moz-transform: scale(.4);}

      100% {
        -moz-transform:scale(1); }
    }
     @-o-keyframes line-scale-pulse-out {
      0% {
        -o-transform:scale(1);
        }

      50% {
        -o-transform: scale(.4);}

      100% {
        -o-transform:scale(1); }
    }
</style>
