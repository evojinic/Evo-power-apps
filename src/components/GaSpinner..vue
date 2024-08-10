<template>
  <div class="loader"></div>
</template>

<script>
export default {
  props: {
    height: { type: Number, default: 30 },
  },
};
</script>

<style scoped>
.loader {
  margin: 0px auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #002B49;
  background: -moz-linear-gradient(left, #002B49 10%, rgba(255, 255, 255, 0) 50%);
  background: -webkit-linear-gradient(left, #002B49 10%, rgba(255, 255, 255, 0) 50%);
  background: -o-linear-gradient(left, #002B49 10%, rgba(255, 255, 255, 0) 50%);
  background: -ms-linear-gradient(left, #002B49 10%, rgba(255, 255, 255, 0) 50%);
  background: linear-gradient(to right, #002B49 10%, rgba(255, 255, 255, 0) 50%);
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
/* .loader:before {
  width: 50%;
  height: 50%;
  background: #002B49;
  border-radius: 100% 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
} */
.loader:after {
  background: #862633;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 3px solid #D6D2C4;
  content: '';
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
@-webkit-keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
