<template>
  <div class="main">
    <div class="info">
      <van-icon name="user-circle-o" size="2.5rem" />
      <div class="right">
        <div class="name">
          <div class="userName">{{ user.user_name }} </div>
        </div>
        <div class="email">{{ user.email }}</div>
      </div>
    </div>
    <div class="Index">
      <h1 class="cn">掌上译</h1>
      <div class="title" @click="handleClick" :class="{ 'animate__animated animate__hinge': isClicked }">
        <h1> <span v-for="(item, index) in 'HANDY'" :style="{ 'z-index': 'HANDY'.length - index }">{{ item }}</span>
        </h1>
        <h1> <span v-for="(item, index) in 'TRANSLATE'" :style="{ 'z-index': 'TRANSLATE'.length - index }">{{ item
            }}</span>
        </h1>
      </div>
      <!-- » -->
      <!-- <div class="go" @click="goHome" :class="{ 'animate__bounceOut ': isClickGo }">Go </div> -->
      <div class="footer">
        <a href="https://beian.miit.gov.cn/" class="adom">粤ICP备2024178586号-1</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router';
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
// function clickCell(index){
//   sessionStorage.setItem('tabIndex', JSON.stringify(index));
// }
let isClicked = ref(false)
    let isClickGo = ref(false)
    const router = useRouter()
    function handleClick() {
      isClicked.value = true;
      setTimeout(() => {
        isClicked.value = false;
      }, 2000);
    }
    const goHome = () => {
      isClickGo.value = true;
      sessionStorage.setItem('tabIndex', '3');
      setTimeout(() => {
        isClickGo.value = false;
        // router.push('/my')
      }, 500);
    }
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: calc(100vh - 55px);
  background: linear-gradient(115deg, #c1c1c1 20%, #aeaeae 40%, #bbb 70%, #aaa);
  z-index: 1;
  overflow: auto;
  position: relative;
  overflow: hidden;
}

.info {
  display: flex;
  margin: 30px 10px;
  border: 2px solid #888;
  border-radius: 10px;
  padding: 10px;
  background: linear-gradient(45deg, #7b7b7b 8%, transparent, #e2e2e2 80%, #9f9f9f 92%);
  box-shadow: 3px 3px 10px #151515;

  font-family: Luckiest Guy;

  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 15px;

    .name {
      display: flex;
      margin-top: 5px;

      .userName {
        text-align: center;
        font-size: 20px;
        min-width: 100px;
        padding-right: 10px;
        text-decoration: underline;
      }
    }

    .email {
      height: 20px;
      min-width: 10px;
      background-color: #cccccc;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      letter-spacing: 3px;
      border: 1px solid #888;
      margin-bottom: 5px;
    }
  }

}

// .func {
//   font-size: 50px;
//   font-family: Luckiest Guy;
//   word-wrap: break-word;
// }
.Index {
  height: calc( 100vh - 6.2rem);
  // background-color: #000;
  font-family: Luckiest Guy;
  font-size: 70px;
  text-align: center;
  color: white;
}

.title {
  // padding-top: 100px;
  letter-spacing: -2px;
  // transform: translateY(-55px);

  span {
    position: relative;
    text-shadow: 10px 0 5px #000;
    -webkit-text-shadow: 10px 0 5px #000;
  }
}

.go {
  font-size: 100px;
  // padding-top: 100px;

}

.cn {
  // opacity: .2;
  font-size: 100px;
  font-weight: bold;
  // transform: translateY(150px);
  color: #a9a9a9;
  color: #fff;
  position: relative;
  &::before{
    content: '掌上译';
    position: absolute;
    left: 0;
    top: 0;
    color: #000;
    transform: skew(50deg) scaleY(0.5) translate(-23px, 26px);
    z-index: -1;
    filter: blur(3px);
    -webkit-mask: linear-gradient(transparent, #000);
  }
}

.footer {
  width: 100%;
  position: absolute;
  bottom: 20px;
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