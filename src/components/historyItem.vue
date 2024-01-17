<template>
  <van-swipe-cell>
    <div class="item" @click="checkDetail">
      <div class="tag">
        {{ history.from.slice(0, 1) + history.to.slice(0, 1) }}
      </div>
      <div class="from " :class="{ singleLine: !isShowTo }" ref="fromDom">
        {{ history.source }}
      </div>
      <div class="to singleLine" ref="toDom" v-show="isShowTo">
        {{ history.target }}
      </div>
    </div>
    <template #right>
      <van-button circle text="删除" type="danger" class="delete-button" size="small" @click="deleteItem" />
    </template>
  </van-swipe-cell>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'historyItem',
  props: {
    history: {
      default: "",
      type: Object
    },

  },
  setup(props, context) {
    const fromDom = ref(null)
    const toDom = ref(null)
    const isShowTo = ref(true)
    const router = useRouter()
    onMounted(() => {
      if (fromDom.value.scrollWidth > 290) {
        isShowTo.value = false
      }
    })
    function deleteItem() {
      context.emit('deleteItem', props.history.id)
    }
    function checkDetail() {
      router.push({ path: `textDetail/${props.history.id}` })
    }
    return { fromDom, toDom, isShowTo, deleteItem, checkDetail }
  }
}
</script>

<style lang="less" scoped>
.item {
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  align-items: center;

  .tag {
    background-color: #eee;
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 10px;
    color: #777777;
    min-width: 24px;
  }

  .from {
    font-size: 14px;
    font-weight: bold;
    margin-left: 12px;
    color: #3f3f3f;
    white-space: nowrap;
    word-wrap: none;
  }

  .to {
    font-size: 14px;
    margin-left: 12px;
    color: #a8a5a5;
    min-width: 0;
  }
}

::v-deep .delete-button{
margin-right: 5px;
background-color: var(--theme-active);
border-color: #3f3f3f;
}
</style>