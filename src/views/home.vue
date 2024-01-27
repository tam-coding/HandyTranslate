<script setup>
import { ref, onMounted, onBeforeUpdate } from 'vue';

let active = ref(0);

onBeforeUpdate(() => {
  sessionStorage.setItem('tabIndex', JSON.stringify(active.value));
}),

  onMounted(() => {
    active.value = JSON.parse(sessionStorage.getItem('tabIndex')) || 0;
    sessionStorage.removeItem('tabIndex');
  });

</script>

<template>
  <router-view />
  <van-tabbar route v-model="active" @change="onChange" style="z-index: 101;height: 55px">
    <van-tabbar-item replace to="/chat" :icon="active == 0 ? 'chat' : 'chat-o'">
      <span :class="active === 0 ? 'active' : 'nagative'">对话翻译</span>
    </van-tabbar-item>
    <van-tabbar-item replace to="/shotScan" :icon="active == 1 ? 'photo' : 'photo-o'">
      <span :class="active == 1 ? 'active' : 'nagative'">拍照翻译</span>
    </van-tabbar-item>
    <van-tabbar-item replace to="/text" :icon="active == 2 ? 'font' : 'font-o'">
      <span :class="active == 2 ? 'active' : 'nagative'">文本翻译</span>
    </van-tabbar-item>
    <!-- <van-tabbar-item replace to="/" :icon="active == 3 ? 'wap-home' : 'wap-home-o'">
      <span :class="active == 2 ? 'active' : 'nagative'">首页</span>
    </van-tabbar-item> -->
  </van-tabbar>
</template>

<style scoped lang="less">
:deep(.van-tabbar) {
  background-color: #fcfcfc;
}

:deep(.van-tabbar-item__text) {
  color: #333;
}

.active {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.nagative {
  font-weight: bold;
  font-size: 12px;
  color: #444;
}
</style>
