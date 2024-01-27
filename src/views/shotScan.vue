<template>
  <div class="shotScan">
    <LanguageBar :isAuto="true" :isRotate="false" :allowSwith="false" :option1="option1"></LanguageBar>
    <video id="video" autoplay="autoplay" muted v-show="isVideo"></video>
    <div class="img" v-show="!isVideo" @click="previewImg(pasteImg ? pasteImg : imgURL)">
      <div class="wrapper" v-show="isScan"></div>
      <img :src="pasteImg ? pasteImg : imgURL" alt="">
    </div>
    <div class="settingBar">
      <van-uploader :after-read="afterRead" :before-read="beforeRead" :max-count="1" :max-size="4 * 1024 * 1024"
        @oversize="onOversize">
        <van-icon name="photo" size="50px" />
      </van-uploader>
      <div class="play" @click="takePhoto"></div>
      <van-icon name="replay" @click="toggleMode" style="font-weight: bold;" size="35px" v-show="isVideo" />
      <van-icon name="arrow-left" style="font-weight: bold;" size="35px" @click="toVideo" v-show="!isVideo" />
    </div>
  </div>
</template>

<script>
import LanguageBar from '@/components/LanguageBar.vue';
import { showNotify } from 'vant';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { pictureTranslate } from '@/api/api'
import { appid, secreKey } from '@/config.js'
import { showToast } from 'vant';
import md5 from "md5";
import fileToBuffer from '@/utils/fileToBinaryBuffer.js'
import { showImagePreview } from 'vant';

const video = ref(null)
const fileList = ref(null);
let image = ''
let pasteImg = ref("")
let isfirst = true
let to = ref('en')

export default {
  name: 'ShotScan',
  components: { LanguageBar },
  setup() {
    const video = ref(null);
    let mode = ref(true);
    let isVideo = ref(true);
    let imgURL = ref('');
    let isScan = ref(true)
    const option1 = [
      { text: '中文', value: "zh" },
      { text: '英语', value: "en" },
      { text: '日语', value: "jp" },
      { text: '韩语', value: "kor" },
      { text: '粤语', value: "yue" },
      { text: '俄语', value: "ru" },
      { text: '德语', value: "de" },
      { text: '法语', value: "fra" },
      { text: '泰语', value: "th" },
      { text: '葡萄牙语', value: "pt" },
      { text: '西班牙语', value: "spa" },
      { text: '阿拉伯语(巴林)', value: "ara" },
    ];

    onMounted(() => {
      getMedia();
    });
    onBeforeUnmount(() => {
      video.value && stopMedia()
    })

    async function getMedia() {
      const constraints = {
        video: {
          height: { min: 450 },
          width: { min: 375 },
          facingMode: mode.value ? { exact: "environment" } : 'user'
        },
        audio: false
      };

      video.value = document.getElementById("video");

      video.value.srcObject = await window.navigator.mediaDevices.getUserMedia(constraints).catch(err => {
        if (err.name === 'OverconstrainedError') {
          showNotify({ type: 'warning', message: '你的设备无后置摄像头' });
          mode.value = false;
          getMedia();
        } else {
          console.log(err);
        }
      });

      video.value.play();
    }

    function takePhoto() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext('2d');
      canvas.width = video.value.videoWidth;
      canvas.height = video.value.videoHeight;
      ctx.drawImage(video.value, 0, 0, video.value.videoWidth, video.value.videoHeight);
      imgURL.value = canvas.toDataURL('image/png');
      isVideo.value = false;
      stopMedia();
      pasteImg.value = ''
      isScan.value = true
      var binaryData = atob(imgURL.value.split(",")[1]);
      var array = new Uint8Array(binaryData.length);
      for (var i = 0; i < binaryData.length; i++) {
        array[i] = binaryData.charCodeAt(i);
      }

      console.log(array);
      translate1(array)
    }

    function stopMedia() {
      const stream = video.value.srcObject;
      if (stream != null) {
        const tracks = stream.getTracks();
        tracks.forEach(function (track) {
          track.stop();
        });
      }
      video.value.srcObject = null;
    }

    function toggleMode() {
      video.value && stopMedia();
      mode.value = !mode.value;
      getMedia();
    }

    function toVideo() {
      isVideo.value = true;
      getMedia();
    }
    const cuid = "APICUID"
    const mac = "mac"
    async function translate() {
      try {
        const sign = await signGenerate();
        console.log("sign", sign);
        console.log("image", image);
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
        if (result.data?.error_code && result.data?.error_code == "69004") {
          showNotify({ type: 'warning', message: '没有识别需要翻译的文字内容，请重试' });
          isScan.value = false
          return
        } else if (result.data.error_code != "0") {
          throw Error("err")
        }
        console.log(result);
        setTimeout(() => {
          isScan.value = false
          pasteImg.value = "data:image/png;base64," + result.data.data.pasteImg
        }, 2000)
      } catch (error) {
        console.log(error);
        isScan.value = false
        showNotify({ type: 'warning', message: '识别失败，请重试' });
      }
    }

    let salt = "";
    async function signGenerate() {
      console.log(fileList.value[0].file);
      try {
        const image1 = fileList.value[0].file;
        let buffer = await fileToBuffer(image1);
        buffer = new Blob([buffer])
        salt = Date.now();
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
    const onOversize = (file) => {
      showToast('文件大小不能超过 4MB');
    }
    const afterRead = (file) => {
      isfirst && (isfirst = false)
      !isfirst && (isScan.value = true)
      console.log(file);
      imgURL.value = file.objectUrl
      fileList.value = [file]
      translate()
    }
    const beforeRead = (file) => {
      !isfirst && (pasteImg.value = '')
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        isScan.value = false
        showToast('请上传 jpg 、jpeg 、png格式图片');
        return false;
      }
      console.log(file);
      pasteImg.value = ''
      isVideo.value = false
      video.value && stopMedia()
      return true
    }
    const previewImg = (url) => {
      showImagePreview([url]);
    }
    async function translate1(binaryData) {
      console.log("binaryData", binaryData);
      try {
        const sign = signGenerate1(binaryData)
        const data = {
          from: "auto",
          to: "en",
          appid: appid,
          salt: salt,
          cuid: cuid,
          mac: mac,
          sign: sign,
          image: binaryData,
          version: 3,
          paste: 1,
        }
        let result = await pictureTranslate(data);
        if (result.data?.error_code && result.data?.error_code == "69004") {
          showNotify({ type: 'warning', message: '没有识别需要翻译的文字内容' });
          isScan.value = false
          return
        } else if (result.data.error_code != "0") {
          throw Error("err")
        }
        setTimeout(() => {
          isScan.value = false
          pasteImg.value = "data:image/png;base64," + result.data.data.pasteImg
        }, 2000)
        console.log(result);
      } catch (error) {
        console.log(error);
        isScan.value = false
        showNotify({ type: 'warning', message: '识别失败，请重试' });
      }
    }
    function signGenerate1(binaryData) {
      salt = Date.now();
      const query = appid + md5(binaryData) + salt + cuid + mac + secreKey;
      const sign = md5(query);
      return sign
    }


    return {
      getMedia,
      takePhoto,
      stopMedia,
      toggleMode,
      isVideo,
      video,
      toVideo,
      imgURL,
      translate,
      signGenerate,
      onOversize,
      afterRead,
      pasteImg,
      beforeRead,
      isScan,
      previewImg,
      to,
      option1
    };
  },
};
</script>
<style lang="less" scoped>
@height: calc(100% - 53px - 10%);

.shotScan {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 55px - 53px + 10px);

  &::-webkit-scrollbar {
    display: none;
  }

  #video,
  .img {
    display: flex;
    align-items: center;
    width: 100%;
    max-height: @height ;
    min-height: 450px;
    min-height: 450px;
    border-radius: 10px;
    border: 2px solid #ccc;
    box-sizing: border-box;
    background-color: var(--theme);
    flex: 9;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    img {
      width: 100%;
    }

    .wrapper {
      position: absolute;
      width: 100%;
      height: calc(@height - 80px);
      background:
        linear-gradient(rgba(26, 152, 202, 0.3), rgba(26, 152, 202, 0.6)),
        /* 将透明度调低到 0.6 */
        linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 0, transparent 19px),
        linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0, transparent 19px),
        linear-gradient(transparent, rgba(26, 152, 202, 0.3));
      /* 将透明度调低到 0.6 */
      background-size: 100% 1.5%, 10% 100%, 100% 8%, 100% 100%;
      background-repeat: no-repeat, repeat, repeat, no-repeat;
      background-position: 0% 0%, 0 0, 0 0, 0 0;
      clip-path: polygon(0% 0%, 100% 0%, 100% 1.5%, 0% 1.5%);
      animation: move 2.5s infinite linear;

      @keyframes move {
        to {
          background-position: 0 100%, 0 0, 0 0, 0 0;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
      }
    }

  }

  .settingBar {
    border-radius: 10px;
    height: calc(100% - 53px - 90%);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex: 1;
    box-sizing: border-box;
    background-color: #333;

    &:first-child {
      height: 53px;
    }

    .play {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: radial-gradient(circle, white 0%, white 50%, black 50%, black 100%);
      transition: background 0.3s ease;

      &:active {
        background: radial-gradient(circle, white 0%, white 50%, #555555 50%, #555555 100%);
      }
    }
  }
}
</style>