<template>
  <div class="cssload-container">
    <div class="cssload-loading"><i></i><i></i><i></i><i></i></div>
  </div>
</template>

<script>
export default {
  name: 'ball-queue-spinner',
};
</script>

<style scoped>
  .cssload-container{
    display: block;
    margin:50px auto;
    width:100px;
  }

  .cssload-loading i{
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
    background: #00b3d5;
  }
  .cssload-loading i:first-child{
    opacity: 0;
    animation:cssload-loading-ani2 0.5s linear infinite;
    -o-animation:cssload-loading-ani2 0.5s linear infinite;
    -ms-animation:cssload-loading-ani2 0.5s linear infinite;
    -webkit-animation:cssload-loading-ani2 0.5s linear infinite;
    -moz-animation:cssload-loading-ani2 0.5s linear infinite;
    transform:translate(-20px);
    -o-transform:translate(-20px);
    -ms-transform:translate(-20px);
    -webkit-transform:translate(-20px);
    -moz-transform:translate(-20px);
  }
  .cssload-loading i:nth-child(2),
  .cssload-loading i:nth-child(3){
    animation:cssload-loading-ani3 0.5s linear infinite;
    -o-animation:cssload-loading-ani3 0.5s linear infinite;
    -ms-animation:cssload-loading-ani3 0.5s linear infinite;
    -webkit-animation:cssload-loading-ani3 0.5s linear infinite;
    -moz-animation:cssload-loading-ani3 0.5s linear infinite;
  }
  .cssload-loading i:last-child{
    animation:cssload-loading-ani1 0.5s linear infinite;
    -o-animation:cssload-loading-ani1 0.5s linear infinite;
    -ms-animation:cssload-loading-ani1 0.5s linear infinite;
    -webkit-animation:cssload-loading-ani1 0.5s linear infinite;
    -moz-animation:cssload-loading-ani1 0.5s linear infinite;
  }


  @keyframes cssload-loading-ani1{
    100%{
      transform:translate(40px);
      opacity: 0;
    }
  }

  @-o-keyframes cssload-loading-ani1{
    100%{
      -o-transform:translate(40px);
      opacity: 0;
    }
  }

  @-ms-keyframes cssload-loading-ani1{
    100%{
      -ms-transform:translate(40px);
      opacity: 0;
    }
  }

  @-webkit-keyframes cssload-loading-ani1{
    100%{
      -webkit-transform:translate(40px);
      opacity: 0;
    }
  }

  @-moz-keyframes cssload-loading-ani1{
    100%{
      -moz-transform:translate(40px);
      opacity: 0;
    }
  }

  @keyframes cssload-loading-ani2{
    100%{
      transform:translate(20px);
      opacity: 1;
    }
  }

  @-o-keyframes cssload-loading-ani2{
    100%{
      -o-transform:translate(20px);
      opacity: 1;
    }
  }

  @-ms-keyframes cssload-loading-ani2{
    100%{
      -ms-transform:translate(20px);
      opacity: 1;
    }
  }

  @-webkit-keyframes cssload-loading-ani2{
    100%{
      -webkit-transform:translate(20px);
      opacity: 1;
    }
  }

  @-moz-keyframes cssload-loading-ani2{
    100%{
      -moz-transform:translate(20px);
      opacity: 1;
    }
  }

  @keyframes cssload-loading-ani3{
    100%{
      transform:translate(20px);
    }
  }

  @-o-keyframes cssload-loading-ani3{
    100%{
      -o-transform:translate(20px);
    }
  }

  @-ms-keyframes cssload-loading-ani3{
    100%{
      -ms-transform:translate(20px);
    }
  }

  @-webkit-keyframes cssload-loading-ani3{
    100%{
      -webkit-transform:translate(20px);
    }
  }

  @-moz-keyframes cssload-loading-ani3{
    100%{
      -moz-transform:translate(20px);
    }
  }
</style>
