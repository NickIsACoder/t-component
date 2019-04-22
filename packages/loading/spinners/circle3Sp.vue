<template>
  <div id="circleG">
    <div id="circleG_1" class="circleG"></div>
    <div id="circleG_2" class="circleG"></div>
    <div id="circleG_3" class="circleG"></div>
  </div>
</template>

<script>
export default {
  name: 'circle3-spinner',
};
</script>

<style scoped>
  #circleG{
    width:90px;
    margin:auto;
    margin-left: -1px;
  }

  .circleG{
    background-color: rgb(255, 255, 255);
    float:left;
    height:19px;
    margin-left:10px;
    width:19px;
    animation-name:bounce_circleG;
    -o-animation-name:bounce_circleG;
    -ms-animation-name:bounce_circleG;
    -webkit-animation-name:bounce_circleG;
    -moz-animation-name:bounce_circleG;
    animation-duration:0.8775s;
    -o-animation-duration:0.8775s;
    -ms-animation-duration:0.8775s;
    -webkit-animation-duration:0.8775s;
    -moz-animation-duration:0.8775s;
    animation-iteration-count:infinite;
    -o-animation-iteration-count:infinite;
    -ms-animation-iteration-count:infinite;
    -webkit-animation-iteration-count:infinite;
    -moz-animation-iteration-count:infinite;
    animation-direction:normal;
    -o-animation-direction:normal;
    -ms-animation-direction:normal;
    -webkit-animation-direction:normal;
    -moz-animation-direction:normal;
    border-radius:13px;
    -o-border-radius:13px;
    -ms-border-radius:13px;
    -webkit-border-radius:13px;
    -moz-border-radius:13px;
  }

  #circleG_1{
    animation-delay:0.1795s;
    -o-animation-delay:0.1795s;
    -ms-animation-delay:0.1795s;
    -webkit-animation-delay:0.1795s;
    -moz-animation-delay:0.1795s;
  }

  #circleG_2{
    animation-delay:0.4055s;
    -o-animation-delay:0.4055s;
    -ms-animation-delay:0.4055s;
    -webkit-animation-delay:0.4055s;
    -moz-animation-delay:0.4055s;
  }

  #circleG_3{
    animation-delay:0.5285s;
    -o-animation-delay:0.5285s;
    -ms-animation-delay:0.5285s;
    -webkit-animation-delay:0.5285s;
    -moz-animation-delay:0.5285s;
  }

  @keyframes bounce_circleG{
    0%{}

    50%{
      background-color:rgb(67,133,255);
    }

    100%{}
  }

  @-o-keyframes bounce_circleG{
    0%{}

    50%{
      background-color:rgb(67,133,255);
    }

    100%{}
  }

  @-ms-keyframes bounce_circleG{
    0%{}

    50%{
      background-color:rgb(67,133,255);
    }

    100%{}
  }

  @-webkit-keyframes bounce_circleG{
    0%{}

    50%{
      background-color:rgb(67,133,255);
    }

    100%{}
  }

  @-moz-keyframes bounce_circleG{
    0%{}

    50%{
      background-color:rgb(67,133,255);
    }

    100%{}
  }
</style>
