<template>
  <div id="bowlG">
    <div id="bowl_ringG">
      <div class="ball_holderG">
        <div class="ballG">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ball-ring-spinner',
};
</script>

<style scoped>
  /*code from CSSLoad.net*/
  #bowlG{
    position:relative;
    width:46px;
    height:46px;
    margin:auto;
    margin-left: 21px;
  }

  #bowl_ringG{
    position:absolute;
    width:46px;
    height:46px;
    border:4px solid rgb(67,133,255);
    border-radius:46px;
    -o-border-radius:46px;
    -ms-border-radius:46px;
    -webkit-border-radius:46px;
    -moz-border-radius:46px;
  }

  .ball_holderG{
    position:absolute;
    width:12px;
    height:46px;
    left:17px;
    top:0px;
    animation-name:ball_moveG;
    -o-animation-name:ball_moveG;
    -ms-animation-name:ball_moveG;
    -webkit-animation-name:ball_moveG;
    -moz-animation-name:ball_moveG;
    animation-duration:1.5s;
    -o-animation-duration:1.5s;
    -ms-animation-duration:1.5s;
    -webkit-animation-duration:1.5s;
    -moz-animation-duration:1.5s;
    animation-iteration-count:infinite;
    -o-animation-iteration-count:infinite;
    -ms-animation-iteration-count:infinite;
    -webkit-animation-iteration-count:infinite;
    -moz-animation-iteration-count:infinite;
    animation-timing-function:linear;
    -o-animation-timing-function:linear;
    -ms-animation-timing-function:linear;
    -webkit-animation-timing-function:linear;
    -moz-animation-timing-function:linear;
  }

  .ballG{
    position:absolute;
    left:0px;
    top:-11px;
    width:19px;
    height:19px;
    background:rgb(67,133,255);
    border-radius:15px;
    -o-border-radius:15px;
    -ms-border-radius:15px;
    -webkit-border-radius:15px;
    -moz-border-radius:15px;
  }

  @keyframes ball_moveG{
    0%{
      transform:rotate(0deg)
    }

    100%{
      transform:rotate(360deg)
    }
  }

  @-o-keyframes ball_moveG{
    0%{
      -o-transform:rotate(0deg)
    }

    100%{
      -o-transform:rotate(360deg)
    }
  }

  @-ms-keyframes ball_moveG{
    0%{
      -ms-transform:rotate(0deg)
    }

    100%{
      -ms-transform:rotate(360deg)
    }
  }

  @-webkit-keyframes ball_moveG{
    0%{
      -webkit-transform:rotate(0deg)
    }

    100%{
      -webkit-transform:rotate(360deg)
    }
  }

  @-moz-keyframes ball_moveG{
    0%{
      -moz-transform:rotate(0deg)
    }

    100%{
      -moz-transform:rotate(360deg)
    }
  }
</style>
