<script setup>
import { onMounted, ref, reactive } from "vue";
import { textTranslate, textTran, getTextHistory, deleteTextById } from '@/api/api'
import LanguageBar from "@/components/LanguageBar.vue";
import { appid, secreKey } from '@/config.js'
import MD5 from '@/utils/md5.js'
import qs from 'qs'
import textSearchHistory from '@/components/textSearchHistory.vue'
import { showFailToast, showSuccessToast } from 'vant';
import { useRouter } from 'vue-router';
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
const map = {
  "zh": "中文",
  "en": "英语",
  "jp": "日语",
  "kor": "韩语",
  "yue": "粤语",
  "ru": "俄语",
  "de": "德语",
  "fra": "法语",
  "th": "泰语",
  "pt": "葡萄牙语",
  "spa": "西班牙语",
  "ara": "阿拉伯语(巴林)"
}
const text = ref("");
const to = ref("en")
let textSearchHistoryList = ref([])
const getTextHis = async function () {
  let result = await getTextHistory(1, 99)
  console.log(result);
  if (result.data.code === 0) {
    textSearchHistoryList.value = result.data.result.records.map(item => {
      item.from = map[item.from]
      item.to = map[item.to]
      return item
    })
    localStorage.setItem('textSearchHistory', JSON.stringify(textSearchHistoryList.value))
  }
}
getTextHis()
// const localStorageTextSearchHistoryList = JSON.parse(localStorage.getItem("textSearchHistory")) || []
// textSearchHistoryList.push(...localStorageTextSearchHistoryList)
// textSearchHistoryList=localStorageTextSearchHistoryList
const router = useRouter()

async function translate() {
  // 发送 HTTP 请求之前才需要对要发送的待翻译文本字段 q 做 URL encode
  const sign = signGenerate()
  let q = {
    q: text.value,
    from: "auto",
    to: to.value,
    appid,
    salt,
    sign
  }
  // q = qs.stringify(q)
  const result = await textTran(q)
  console.log(result.data);
  if (result.data.code === 0) {
    result.data.result.from = map[result.data.result.from]
    result.data.result.to = map[result.data.result.to]
    // const item = {
    //   'from': from,
    //   'to': to,
    //   'source': result.data.result.trans_result[0].src,
    //   'target': result.data.result.trans_result[0].dst,
    //   'id': Date.now() + ''
    // }
    textSearchHistoryList.value.unshift(result.data.result)
    localStorage.setItem('textSearchHistory', JSON.stringify(textSearchHistoryList.value))
    router.push({ path: `textDetail/${result.data.result.id}` })
  } else {
    showFailToast("翻译失败，请重试")
  }
}
let salt = ''
function signGenerate() {
  // appid+q+salt+密钥
  salt = Date.now()
  const query = appid + text.value + salt + secreKey
  return MD5(query)
}

async function deleteItem(id) {
  const result = await deleteTextById(id)
  if (result.data.code === 0) {
    showSuccessToast("删除成功")
    getTextHis()
  } else {
    showFailToast("删除失败")
  }
}

onMounted(() => {
  recognition.lang = 'zh';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.addEventListener('result', onresult);
  recognition.addEventListener('end', onEnd);
  recognition.addEventListener('start', () => {
    emptyTime = 0
    loading.value = true;
  });
  recognition.addEventListener('error', () => {
    showFailToast("当前浏览器不支持该功能或者发送错误")
  });
  return () => {
    if (recognition) {
      recognition.removeEventListener('result', onresult);
    }
  };
});

const loading = ref(false);
const recognition = new window.webkitSpeechRecognition();
const lastLength = ref(0);
let emptyTime = 0

const click = () => {
  if (!('webkitSpeechRecognition' in window)) {
    showFailToast("当前浏览器不支持该功能")
    return
  }
  console.log('webkitSpeechRecognition' in window);
  if (loading.value) {
    recognition.stop();
    loading.value = false;
    return;
  }
  lastLength.value = 0;
  loading.value = true
  recognition.start();
};
const onEnd = (event) => {
  console.log("end", event);
  // const index = text.value.lastIndexOf(',')
  // if (index !== -1) {
  //   const newText = text.value.substring(0, index) + ' ' + text.value.substring(index + 1);
  //   text.value = newText
  // }
  loading.value = false;
};

const onresult = (event) => {
  console.log(event);
  if (emptyTime == 2) {
    recognition.stop()
    return
  }
  const length = event.results.length;
  console.log("lastLength", lastLength.value);
  console.log("length", event.results.length);
  if (lastLength.value === length) {
    return;
  }
  lastLength.value = length;
  const transcript = event.results[length - 1]?.[0]?.transcript;
  if (transcript) {
    emptyTime = 0
    console.log("transcript", transcript);
    text.value += transcript + " ";

  } else {
    emptyTime++
  }
};


</script>
<template>
  <LanguageBar :option1="option1" :isAuto="true" :isRotate="false" :allowSwith="false" @to="(val) => to = val">
  </LanguageBar>
  <div style="text-align: center; ">
    <van-field v-model="text" size="large" :autosize="{ maxHeight: 70, minHeight: 20 }" placeholder="请输入要翻译的单词或者句子">
      <template #right-icon>
        <div v-show="!loading" class="buts">
          <van-button round type="primary" icon="stop-circle-o" @click="click" color="#555" />
          <van-button round type="primary" icon="search" @click="translate" color="#555" />
        </div>
        <van-loading type="spinner" color="#333" v-show="loading" @click="click" vertical
          text-size="6px">结束识别</van-loading>
      </template>
    </van-field>
  </div>

  <!-- <van-field v-model="text" type="textarea" :autosize="{ maxHeight: 70, minHeight: 20 }" maxlength='1500'
    placeholder="请输入要翻译的单词或者句子" right-icon="search" @click-right-icon="translate" /> -->
  <!--  -->
  <textSearchHistory :textSearchHistoryList="textSearchHistoryList" @deleteItem="deleteItem"></textSearchHistory>
</template>

<style scoped lang="less">
::v-deep .van-field__control {
  border-bottom: 1px solid var(--theme);
  font-size: 20px;
  padding: 10px 0;
  white-space: pre-line;
  line-height: 1.1em;
  letter-spacing: 1px;

  &:focus {
    // border-bottom: 2.5px solid var(--theme-active);
    // border-right: 1px solid var(--theme);
    // box-shadow: 5px 5px 1px 1px #bebebe;

  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.buts {
  display: flex;
  flex-direction: column;
}

:deep(.van-button) {
  height: auto;
  width: 20px;
  margin-bottom: 5px;
  width: 30px;
  font-size: 14px;
}

:deep(.van-field__right-icon) {
  margin: 0;
  padding-right: 0;
  width: 30px;
}

:deep(.van-loading__text) {
  margin: 0;
  line-height: 16px;
}
</style>
