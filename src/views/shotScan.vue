<template>
  <LanguageBar></LanguageBar>
  <button @click="getMedia" >开启摄像头</button>
  <button @click="takePhoto">截图拍照</button>
  <button @click="stopMedia">停止</button>
  <div class="play" ></div>
  
  <van-icon name="replay" @click="toggleMode" tag="ddd" style="font-weight: bold;"/>
  <div>{{ mode ? "后置" : "前置" }}</div>
  <video id="video" autoplay="autoplay" muted></video>
  <canvas id="canvas" width="300" height="300"></canvas>
</template>

<script>
import LanguageBar from '@/components/LanguageBar.vue';
import { showNotify } from 'vant';
import { ref } from 'vue';
export default {
  name: 'ShotScan',
  components: { LanguageBar },
  setup() {
    const video = ref(null)
    let mode = ref(false)
    async function getMedia() {
      // 获取设备媒体的设置，通常就video和audio
      const constraints = {
        // video配置，具体配置可以看看mdn
        video: {
          height: { min: 450 },
          width: { min: 375 },
          facingMode: mode.value ? { exact: "environment" } : 'user'
        },
        // 关闭音频
        audio: false
      };
      video.value = document.getElementById("video");
      // 使用getUserMedia获取媒体流
      // 媒体流赋值给srcObject
      video.value.srcObject = await window.navigator.mediaDevices.getUserMedia(constraints).catch(err => {
        if (err.name === 'OverconstrainedError') {
          showNotify({ type: 'warning', message: '你的设备无后置摄像头' });
          mode.value = false
          getMedia()
        } else {
          console.log(err);
        }
      });
      // 直接播放就行了
      video.value.play();
    }
    // 截图拍照
    function takePhoto() {
      // video.value = document.getElementById("video");
      // 借助canvas绘制视频的一帧
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video.value, 0, 0, 300, 300);
    }
    // 停止
    function stopMedia() {
      // 获取媒体流
      const stream = video.value.srcObject;
      const tracks = stream.getTracks();
      // 停止所有轨道
      tracks.forEach(function (track) {
        track.stop();
      })
      video.value.srcObject = null;
    }
    function toggleMode() {
      video.value && stopMedia()
      mode.value = !mode.value;
      getMedia()
    }

    return {
      getMedia,
      takePhoto,
      stopMedia,
      toggleMode,
    }
  },
}
</script>

<style lang="less" scoped>
#video {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.play{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle, white 0%, white 50%, black 50%, black 100%);
  transition: background 0.3s ease;
  &:active{
    background: radial-gradient(circle, white 0%, white 50%, #555555 50%, #555555 100%);
  }
}
</style>