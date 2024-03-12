<script setup>
import { onMounted, ref, reactive } from "vue";
import { textTranslate } from '@/api/api'
import LanguageBar from "@/components/LanguageBar.vue";
import { appid, secreKey } from '@/config.js'
import MD5 from '@/utils/md5.js'
import qs from 'qs'
import textSearchHistory from '@/components/textSearchHistory.vue'
import { showFailToast } from 'vant';
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
let textSearchHistoryList = reactive([])
const localStorageTextSearchHistoryList = JSON.parse(localStorage.getItem("textSearchHistory")) || []
textSearchHistoryList.push(...localStorageTextSearchHistoryList)
// textSearchHistoryList=localStorageTextSearchHistoryList
const router = useRouter()

async function translate() {
  // 发送 HTTP 请求之前才需要对要发送的待翻译文本字段 q 做 URL encode
  const sign = signGenerate()
  let q = {
    q: text.value.trim(),
    from: "auto",
    to: to.value,
    appid,
    salt,
    sign
  }
  // q = qs.stringify(q)
  const result = await textTranslate(q)
  console.log(result);
  if (result.status == 200) {
    const from = map[result.data.from]
    const to = map[result.data.to]
    const item = {
      'from': from,
      'to': to,
      'source': result.data.trans_result[0].src,
      'target': result.data.trans_result[0].dst,
      'id': Date.now() + ''
    }
    textSearchHistoryList.unshift(item)
    localStorage.setItem('textSearchHistory', JSON.stringify(textSearchHistoryList))
    router.push({ path: `textDetail/${item.id}` })
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

</script>
<template>
  <LanguageBar :option1="option1" :isAuto="true" :isRotate="false" :allowSwith="false" @to="(val) => to = val">
  </LanguageBar>
  <van-field v-model="text" type="textarea"  :autosize="{ maxHeight: 70, minHeight: 20 }" maxlength='1500'
    placeholder="请输入要翻译的单词或者句子" right-icon="search" @click-right-icon="translate"/>
  <!--  -->
  <textSearchHistory :textSearchHistoryList="textSearchHistoryList"></textSearchHistory>
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
    border-right: 1px solid var(--theme);
  box-shadow: 5px 5px  1px 1px #bebebe;

  }

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
