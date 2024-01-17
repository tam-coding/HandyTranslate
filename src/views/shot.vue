<script setup>
import { onMounted, ref } from "vue";
import { pictureTranslate } from '@/api/api'
import { appid, secreKey } from '@/config.js'
import { showToast } from 'vant';
import md5 from "md5";
import fileToBuffer from '@/utils/fileToBinaryBuffer.js'

const video = ref(null)
const fileList = ref([]);
let image = ''

const cuid = "APICUID"
const mac = "mac"

async function getMedia() {
  // 获取设备媒体的设置，通常就video和audio
  const constraints = {
    // video配置，具体配置可以看看mdn
    video: {
      height: 200,
      width: 200,
      facingMode: { exact: "environment" },  
    },
    // 关闭音频
    audio: false
  };
  video.value = document.getElementById("video");
  // 使用getUserMedia获取媒体流
  // 媒体流赋值给srcObject
  video.value.srcObject = await window.navigator.mediaDevices.getUserMedia(constraints);
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
const onOversize = (file) => {
  showToast('文件大小不能超过 4MB');
};
let pasteImg = ref("")

async function translate() {
  try {
    const sign = await signGenerate();
    console.log("sign", sign);
    console.log("image", image);

    const formData = new FormData();
    formData.append("from", "auto");
    formData.append("to", "en");
    formData.append("appid", appid);
    formData.append("salt", salt);
    formData.append("cuid", cuid);
    formData.append("mac", mac);
    formData.append("sign", sign);
    formData.append("image", image);
    const data = {
      from: "auto",
      to: "en",
      appid: appid,
      salt: salt,
      cuid: cuid,
      mac: mac,
      sign: sign,
      image: image,
      version: 3,
      paste: 1,
    }
    let result = await pictureTranslate(data);
    console.log(result);
    pasteImg.value = "data:image/png;base64," + result.data.data.pasteImg
  } catch (error) {
    console.error(error);
  }
}

let salt = "5445035";
async function signGenerate() {
  console.log(fileList.value[0].file);
  try {
    const image1 = fileList.value[0].file;
    let buffer = await fileToBuffer(image1);
    buffer = new Blob([buffer])
    // salt = Date.now();
    console.log(buffer);
    console.log(md5(buffer));
    console.log(new Uint8Array(await buffer.arrayBuffer()));

    image = new Uint8Array(await buffer.arrayBuffer());

    const query = appid + md5(new Uint8Array(await buffer.arrayBuffer())) + salt + cuid + mac + secreKey;
    console.log("query", query);
    const sign = md5(query);
    console.log("md5(query)", sign);

    return sign;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


</script>

<template>
  <div @click="translate">click</div>
  <img :src="pasteImg" alt="">

  <div class="unload">
    <van-uploader :after-read="afterRead" upload-icon="upgrade" v-model="fileList" multiple :max-count="1"
      :max-size="4 * 1024 * 1024" @oversize="onOversize">
    </van-uploader>
    <p>上传图片</p>
  </div>

  <div class="shot">
    <video id="video" autoplay="autoplay" muted width="221px" height="221px"></video>
    <p>拍照翻译</p>
    <van-icon name="photograph" class="photograph" size="60px" />
  </div>


  <button @click="getMedia">开启摄像头</button>
  <button @click="takePhoto">截图拍照</button>
  <button @click="stopMedia">停止</button>
  <canvas id="canvas" width="300" height="300"></canvas>
</template>

<style scoped lang="less">
.unload {
  text-align: center;
  margin-top: 20px;
  color: var(--theme-active);

  ::v-deep .van-uploader__upload {
    width: 200px;
    height: 200px;
  }
}

.shot {
  text-align: center;
  margin-top: 20px;
  color: var(--theme-active);
  position: relative;

  #video {
    background-color: #f7f8fa;
  }

  .photograph {
    color: #b8bbbd;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
