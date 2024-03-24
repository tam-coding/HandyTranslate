<template>
  <div class="main">
    <div class="content">
      <div class="title">handy Translate</div>
      <div class="subtitle">翻译 , 从未如此简单</div>
      <!-- ,trigger:'onSubmit' -->
      <van-tabs v-model:active="active" :lazy-render="false">
        <van-form @submit="login">
          <van-tab title="登录 Login">
            <van-cell-group inset :border="true">
              <van-field v-model="email" left-icon="user" placeholder="请输入邮箱账号" clearable
                :rules="[{ required, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入正确邮箱账号', validateEmpty: false }]" />
              <van-field v-model="password" left-icon="lock" placeholder="请输入密码" type="password"
                :rules="[{ required, pattern: /^.{6,}$/, message: '请输入正确密码', validateEmpty: false }]" />
            </van-cell-group>
            <van-button type="primary" size="large" native-type="submit">登录</van-button>
          </van-tab>
        </van-form>
        <van-form @submit="register">
          <van-tab title="注册 Register">
            <van-cell-group inset>
              <van-field v-model="userName" left-icon="smile" clearable placeholder="请起一个响亮的用户名称"
                :rules="[{ required, pattern: /^[^\s]{1,9}$/, message: '用户名称为1-9个字符', validateEmpty: false }]" />
              <van-field v-model="email" left-icon="user" placeholder="请输入邮箱账号" clearable
                :rules="[{ required, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入正确邮箱账号', validateEmpty: false }]" />
              <van-field v-model="password" left-icon="lock" placeholder="请输入密码" type="password"
                :rules="[{ required, pattern: /^.{6,}$/, message: '密码必须大于6位', validateEmpty: false }]" />
              <van-field v-model="passwordAgain" left-icon="lock" placeholder="请再次输入密码" type="password"
                :rules="[{ required, validator: passwordValidator }]" />
              <van-field v-model="sms" center clearable placeholder="请输入邮箱验证码"
                :rules="[{ required, pattern: /^\d{6}$/, message: '验证码为6位数字', validateEmpty: false }]">
                <template #button>
                  <van-button size="small" type="primary" @click="sendEmailCode">
                    {{ isFinished ? "发送验证码" : countDown.current.value.seconds + "s" }}
                  </van-button>
                </template>
              </van-field>
            </van-cell-group>
            <van-button type="primary" size="large" native-type="submit">注册</van-button>
          </van-tab>
        </van-form>
      </van-tabs>


    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { useCountDown } from '@vant/use';
import { showToast } from 'vant';
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
const Router = useRouter()
let email = ref('');
let userName = ref('');
let password = ref('');
let passwordAgain = ref('');
let sms = ref('');
let active = ref('');
let isFinished = ref(true);
const expire = sessionStorage.getItem('expire') * 1;
const now = Date.now()
isFinished.value = expire > now ? false : true;

const userStore = useUserStore()

let countDown = useCountDown({
  time: expire > now ? expire - now : 60 * 1000, onFinish: () => {
    sessionStorage.removeItem('expire')
    isFinished.value = true;
  }
});
if (expire > now) {
  console.log("expire", expire);
  console.log("now", now);
  console.log("ountDown.start()");
  countDown.start()
}
onBeforeUnmount(() => {
  (countDown.current.value.total > 0 && countDown.current.value.total != 60 * 1000) && sessionStorage.setItem('expire', Date.now() + countDown.current.value.total);
})

const sendEmailCode = async () => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email.value)) {
    return showToast('请先输入邮箱账号');
  };
  if (countDown.current.value.total > 0 && countDown.current.value.total != 60 * 1000) return;
  try {
    const res = await userStore.sendEmailCode(email.value);
    console.log("邮箱验证码", res);
    if (res.data.code === 0) {
      isFinished.value = false;
      showToast('发送成功');
      countDown.reset(60 * 1000)
      countDown.start()
      sessionStorage.setItem('expire', Date.now() + countDown.current.value.total);
    } else {
      showToast(res.data.message);
    }
  } catch (error) {
    console.log(error);
  }


}

const login = async () => {
    const res = await userStore.login(email.value, password.value);
    console.log("login", res);
    if (res.code === 0) {
      showToast('登录成功')
      Router.push('/')
    }else{
      showToast(res.message)
    }

}
const register = async () => {
  try {
    const res = await userStore.register(userName.value, email.value, password.value, sms.value);
    console.log("register", res);
    if (res.code === 0) {
      showToast("注册成功");
      active.value = 0
      password.value = ""
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.log("regiser", error);
  }

}
const passwordValidator = () => {
  if (password.value !== passwordAgain.value) {
    return '两次密码不一致';
  } else if (passwordAgain.value == "") {
    return '不能为空';
  }
  return true;
}



</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  background-image: url('../assets/img/bg2.png');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.content {
  padding: 20px 0;
  font-family: Luckiest Guy;
  color: #fff;
  width: 320px;
  // height: 500px;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(95, 95, 95, 0.4);
  text-align: center;
  backdrop-filter: blur(-1px);

  .title {
    // margin-top: 20px;
    padding: 0 10px;
    font-size: 34px;
  }

  .subtitle {
    padding: 0 10px;
    font-size: 20px;
    letter-spacing: 3px;
  }

  :deep(.van-tabs__nav) {
    background: none;
    font-size: 18px;
  }

  :deep(.van-tab) {
    font-size: 16px;
  }

  :deep(.van-tabs__wrap) {
    padding: 0 30px;
    margin-top: 20px
  }

  :deep(.van-tabs__line) {
    width: 50%;
    background: #000000;
  }

  :deep(.van-tab__panel) {
    margin-top: 20px;
  }


  :deep(.van-field__label) {
    width: auto;
  }

  :deep(.van-field__body) {
    padding-left: 5px;
  }

  :deep(.van-field__control) {
    letter-spacing: 1px;
    line-height: 16px;
    height: 26px;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    padding-bottom: 5px;
  }

  :deep(.van-field__control:focus) {
    border-bottom: 1px solid #888;
  }

  :deep(.van-cell) {
    padding: 20px 15px;
  }

  :deep(.van-field__left-icon .van-icon, .van-field__right-icon .van-icon) {
    font-size: 24px;
    font-weight: bold;
  }

  :deep(.van-button--large) {
    margin-top: 20px;
    width: 90%;

  }

  :deep(.van-button--primary) {
    background: linear-gradient(315deg, #444 25%, #888; );
    border: 2px solid #444;
  }

}
</style>