<template>
  <div class="top">
    <div class="title">最近搜索</div>
    <!-- <van-icon name="delete-o" color="#aaa" class="van-icon" @click="deleteAll" /> -->
  </div>
  <div class="main">
      <historyItem v-for="(item, index) in textSearchHistoryList" :key="index" :history="item" @deleteItem="deleteItem">
      </historyItem>
    <van-back-top target=".main" bottom="10vh" class="custom" />
  </div>
</template>

<script>
import historyItem from './historyItem.vue'
import { showConfirmDialog } from 'vant';
export default {
  name: 'textSearchHistory',
  components: {
    historyItem
  },
  props: {
    textSearchHistoryList: {
      default: [],
      type: Array
    }
  },
  setup(props, context) {

    function deleteItem(id) {
      console.log(id);
      context.emit('deleteItem', id)
    }

    function deleteAll() {
      showConfirmDialog({ message: "确定要删除全部记录吗" }).then(() => {
        props.textSearchHistoryList.splice(0, props.textSearchHistoryList.length)
        localStorage.setItem('textSearchHistory', JSON.stringify(props.textSearchHistoryList))
      })
    }

    return { deleteItem, deleteAll }
  }
}
</script>

<style lang="less" scoped>
.main {
  max-height: calc(100vh - 50px - 50px - 26px - 88px - 10px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.top {
  box-sizing: border-box;
  padding: 5px 30px 5px 10px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  margin: 8px 0;

  .title {
    border-left: 5px solid #666;
    padding-left: 10px
  }

  .van-icon {
    transform: scale(1.2);
  }

}
</style>