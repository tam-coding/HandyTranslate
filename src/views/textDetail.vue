<template>
  <div class="textDetail">
    <van-nav-bar  left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="source">
      <div class="title">
        <div class="tag">{{ detail.from }}</div>
        <van-icon name="volume-o" @click="toggleAudioPlay(detail.source, detail.from)" />
      </div>
      <div class="content">
        <span v-for="(sentence, index) in detail.source.split(new RegExp('(?<=[,.，。？])'))" :key="index"
          @click="toggleAudioPlay(sentence, detail.from, index)"
          :class="{ 'playing': isCurrentPlaying && currentPlayingIndex === index && currentLang == detail.from }">{{ sentence
          }}</span>
      </div>
    </div>
    <div class="target">
      <div class="title">
        <div class="tag"> {{ detail.to }}</div>
        <van-icon name="volume-o" @click="toggleAudioPlay(detail.target, detail.to)" />
      </div>
      <div class="content">
        <span v-for="(sentence, index) in detail.target.split(new RegExp('(?<=[,.，。？])'))" :key="index"
          @click="toggleAudioPlay(sentence, detail.to, index)"
          :class="{ 'playing': isCurrentPlaying && currentPlayingIndex === index && currentLang == detail.to }">{{ sentence
          }}</span>
        <!-- {{ detail.target }} -->
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { showNotify } from 'vant';
const languageMap = {
  "中文": "zh-CN",
  "英语": "en-GB",
  "日语": "ja-JP",
  "韩语": "ko-KR",
  "粤语": "yue-Hant-HK",
  "俄语": "ru-RU",
  "德语": "de-DE",
  "法语": "fr-FR",
  "泰语": "th-TH",
  "葡萄牙语": "pt-PT",
  "西班牙语": "es-ES",
  "阿拉伯语(巴林)": "ar-BH"
};
const route = useRoute()
const { id } = route.params
const textSearchHistory = JSON.parse(localStorage.getItem('textSearchHistory')) || []
const detail = textSearchHistory.find(item => item.id == id)

const utteranceRef = ref(null);
let currentLang = ref(null)
let isCurrentPlaying = ref(false)
let currentPlayingIndex = ref(null);

onBeforeUnmount(() => {
  if (utteranceRef.value) {
    window.speechSynthesis.cancel();
  }
});

function toggleAudioPlay(word, lang, index) {
  if (utteranceRef.value) {
    if (lang == currentLang.value) {
      window.speechSynthesis.cancel();
      utteranceRef.value = null;
      isCurrentPlaying.value = false;
      currentPlayingIndex.value = null;
      currentLang.value = null
    } else {
      window.speechSynthesis.cancel();
      utteranceRef.value = null;
      currentLang.value = lang
      currentPlayingIndex.value = index;
      isCurrentPlaying.value = true;
      audioPlay(word, lang, index);
    }
  } else {
    currentLang.value = lang
    isCurrentPlaying.value = true;
    currentPlayingIndex.value = index;

    audioPlay(word, lang);
  }
}
function audioPlay(word, lang) {

  if (lang == "阿拉伯语(巴林)" || lang == "泰语") {
    return showNotify({ type: 'warning', message: '暂不支持当前语言的语言播报', background: '#bebebe', });
  }
  if ('SpeechSynthesisUtterance' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.onend = function () {
      utteranceRef.value = null;
      isCurrentPlaying.value = false;
      currentPlayingIndex.value = null;
      currentLang.value = null
    }
    utterance.lang = languageMap[lang];
    window.speechSynthesis.speak(utterance);
    utteranceRef.value = utterance;
  } else {
    showNotify({ type: 'warning', message: '你的浏览器不支持当前操作', background: '#bebebe' });
  }
}
const onClickLeft = () => history.back();

</script>

<style lang="less" scoped>
.textDetail {

  .target,
  .source {
    font-size: 16px;
    margin: 10px 5px;
    line-height: 1.4em;
    margin-top: 20px;


    .content {
      margin-left: 10px;
      margin-top: 10px;

      span {
        &.playing {
          color: #409eff;
          font-weight: bold;
        }
      }
    }
  }


  .title {
    display: flex;
    align-items: center;

    .tag {
      // display: inline-block;
      background-color: #717576;
      padding: 1px 10px 2px 10px;
      color: #fff;
      font-weight: bold;
      font-size: 14px;
      margin-right: 10px;
    }

  }
}
</style>