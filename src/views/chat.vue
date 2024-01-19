<script setup>
import { onMounted, ref, reactive, watch, shallowRef, nextTick } from "vue";
import { voiceTranslate } from "@/api/api.js";
import LanguageBar from "@/components/LanguageBar.vue";
import audioRecode from '@/components/audioRecode.vue'
import MessageBubble from "@/components/MessageBubble.vue";
import { showFailToast } from 'vant';
import CryptoJS from 'crypto-js'
import { appid, secreKey } from '@/config.js'

let voice = null
let sourceAudioUrl = ref("")
// let targetAudioBase64 = ref("")
let from = ref("zh")
let to = ref("en")
let audioDuration = ref(0)
let isRotate = ref(false)
let messageList = reactive([])
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

let sourceAudioBase64, targetAudioBase64
onMounted(() => {
  const data = JSON.parse(localStorage.getItem("messageList")) || []
  data.length > 0 && messageList.push(...data)
  nextTick(() => {
    const scrollContainer = document.querySelector('.main');
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  })
})
// watch(isRotate, () => {
//   [from.value, to.value] = [to.value, from.value]
// })
async function fn_voiceTranslate() {
  let headers = handleHeader(voice)
  if (isRotate.value) {
    var [fromtemp, totemp] = [to.value, from.value]
  } else {
    var [fromtemp, totemp] = [from.value, to.value]
  }
  const data = {
    from: fromtemp,
    to: totemp,
    "format": "pcm",
    "voice": voice
  }
  let result = await voiceTranslate(data, headers)
  if (result.data.code === 20200) {
    showFailToast("翻译失败，请重试")
    return
  }
  if (result.data.code === 0) {
    console.log(result)
    targetAudioBase64 = "data:audio/wav;base64," + result.data.data.target_tts
    sourceAudioBase64 = "data:audio/wav;base64," + sourceAudioBase64
    // alert(result.data.data.source)
    // alert(result.data.data.target)

    const message = {
      source: sourceAudioBase64,
      target: targetAudioBase64,
      sourceText: result.data.data.source,
      targetText: result.data.data.target,
      sourceLanguage: fromtemp,
      targetLanguage: totemp,
      position: isRotate.value ? 'right' : 'left'
    }

    messageList.push(message)
    nextTick(() => {
      const scrollContainer = document.querySelector('.main');
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    })
    localStorage.setItem("messageList", JSON.stringify(messageList))
  }

}
function encodeVoice(voice) {
  let hmac = CryptoJS.HmacSHA256(voice, secreKey);
  let base64 = CryptoJS.enc.Base64.stringify(hmac)
  console.log("header的-Sign", base64);
  return base64
}

function handleHeader(voice) {
  //将音频文件进行base64编码，得到音频编码 ，即用于请求参数中的 voice 字段
  //拼接字符串： X-Appid +  X-Timestamp + voice  
  //使用 hmac_sha256 加密算法对（2）中的字符串进行加密
  // const voice = window.btoa(voice1)
  const timestamp = Math.floor(Date.now() / 1000)
  const msg = appid + timestamp + voice

  return {
    "Content-type": "application/json;charset=utf-8",
    "X-Appid": appid,
    "X-Timestamp": timestamp,
    "X-Sign": encodeVoice(msg)
  }
}
function handleAudio(pcmBase64, sourceAudioUrlTemp, sourceAudioBase64Temp, bul) {

  if (bul == 1) {
    showFailToast("录音时长不能大于60秒")
    return
  } else if (bul == 2) {
    showFailToast("录音文件过大，请重试")
    return
  }
  //pcmBase64是用来加密的，sourceAudioUrlTemp是测试的方便，sourceAudioBase64是要储存的音频
  console.log(pcmBase64);
  console.log(sourceAudioUrlTemp);
  console.log(sourceAudioBase64Temp);
  voice = pcmBase64
  sourceAudioBase64 = sourceAudioBase64Temp
  // sourceAudioUrl.value = URL.createObjectURL(audioBlob);
  sourceAudioUrl.value = sourceAudioUrlTemp;
  fn_voiceTranslate()


}

</script>

<template>
  <LanguageBar @from="(val) => from = val" @to="(val) => to = val" v-model:isRotate="isRotate" :option1="option1">
  </LanguageBar>
  <div class="main">
    <MessageBubble v-for="(message, index) in messageList" :key="index" :message="message"></MessageBubble>
  </div>
  <audioRecode @audioData="handleAudio"></audioRecode>
</template>

<style scoped lang="less">
.main {
  max-height: calc( 100vh - 55px - 55px - 53px + 2px);
  background-color: var(--bg);
  box-sizing: border-box;
  margin-bottom: 55px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: block;
  }
}
</style>
