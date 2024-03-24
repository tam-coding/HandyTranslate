<template>
  <div class="Index">
    <h1 class="cn">掌上译</h1>
    <div class="title" @click="handleClick" :class="{ 'animate__animated animate__hinge': isClicked }">
      <h1> <span v-for="(item, index) in 'HANDY'" :style="{ 'z-index': 'HANDY'.length - index }">{{ item }}</span></h1>
      <h1> <span v-for="(item, index) in 'TRANSLATE'" :style="{ 'z-index': 'TRANSLATE'.length - index }">{{ item }}</span>
      </h1>
    </div>
    <div class="go" @click="goHome" :class="{ 'animate__bounceOut ': isClickGo }">Go »</div>
    <div class="footer">
      <a href="https://beian.miit.gov.cn/" class="adom">粤ICP备2024178586号-1</a>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
export default {
  name: 'index',
  setup(props, context) {
   
    return { handleClick, isClicked, goHome, isClickGo }
  }
}
</script>

<style scoped>
.Index {
  height: 100vh;
  background-color: #000;
  font-family: Luckiest Guy;
  font-size: 70px;
  text-align: center;
  color: white;
}

.title {
  padding-top: 100px;
  letter-spacing: -2px;

  span {
    position: relative;
    text-shadow: 10px 0 5px #000;
    -webkit-text-shadow: 10px 0 5px #000;
  }
}

.go {
  font-size: 100px;
  padding-top: 100px;

}

.cn {
  opacity: .2;
  font-size: 100px;
  font-weight: bold;
  transform: translateY(150px);
}

.footer {
  width: 100%;
  position: absolute;
  bottom: 10px;
  text-align: center;
  font-size: 12px !important;
  color: #fff !important;

  .adom {
    color: inherit;
    font-size: 12px !important;
    color: #fff !important;
    text-decoration: none;
  }

}
</style>