<template>

  <div class="top">
    <van-nav-bar left-arrow @click-left="onClickLeft" class="icon" />
  </div>
  <div class="contentbox">
    <div class="content" v-for="(item, index) in picHistory" :key="item.id">
      <div class="time"> {{item.createdAt.replace("T","   ").split(".")[0]}}</div>
      <van-image width="150" height="300px" fit="contain" :src="item.picUrl" @click="preview(item.picUrl)" />
    </div>
  </div>

</template>

<script setup>
import { getPicHistory as getPicHistoryApi } from '@/api/api'
import { ref } from 'vue'
import { showImagePreview } from 'vant';

const picHistory = ref([])
async function getPicHistory() {
  const result = await getPicHistoryApi(1, 99)
  if (result.data.code == 0) {
    picHistory.value = result.data.result.records
  }
  console.log("getPicHistory", result.data);
}
getPicHistory()


function preview(url) {
  showImagePreview([url])
}

const onClickLeft = () => history.back();
</script>

<style lang="less" scoped>
@iconBg: #f5f5f5;

::v-deep .van-nav-bar__left {
  padding: 0;
  background-color: @iconBg;
  border: none;
}

::v-deep .van-nav-bar__content,
.van-nav-bar {
  width: 16px;
  height: 16px;
}

::v-deep .van-hairline--bottom:after {
  border: none;
}

.top {
  margin: 10px 0 0 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: @iconBg;
  position: relative;
  font-weight: bold;
  line-height: 25px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  .icon {
    position: absolute;
    top: 7px;
    left: 7px;
  }
}

.contentbox {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0px;
  padding: 0 10px;
  justify-content: space-between;

  .content {
    margin-top: 10px;
    border: 3px solid #f5f5f5;
    border-radius: 10px;
    height: 250px;
    width: 45%;
    text-align: center;
    overflow: hidden;
    box-shadow: 0px 0 10px #333;
    .time{
      font-size: 12px;
      color:#bebebe;
      font-family: luckiest guy;
    }
  }
}
</style>