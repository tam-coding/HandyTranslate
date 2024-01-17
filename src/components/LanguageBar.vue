<template>
  <div class="languageBar">
    <van-icon name="arrow" class="arrow" v-if="!allowSwith" />
    <van-icon name="arrow" class="arrow" @click="handleSwith" v-else
      :style="{ 'transform': isRotate ? 'scale(0.6) rotate(180deg)' : '' }" />

    <van-dropdown-menu>
      <van-dropdown-item v-model="value1" :options="isAuto ? autoOption : option1" @change="handleFrom" />
      <van-dropdown-item v-model="value2" :options="option1" @change="handleTo" />
    </van-dropdown-menu>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  name: "LanguageBar,option1",
  props: {
    'isRotate': Boolean,
    'option1': Array,
    'isAuto': Boolean,
    'allowSwith': {
      type: Boolean,
      default: true
    }
  },
  setup(prop, context) {
    const value1 = ref("zh");
    const value2 = ref("en");
    const isRotate = ref(prop.isRotate);
    const autoOption = [{ text: '自动检测', value: 'auto' }]
    if (prop.isAuto) {
      value1.value = 'auto'
    }

    const handleFrom = (val) => {
      context.emit("from", val)
    }
    const handleTo = (val) => {
      context.emit("to", val)
    }
    function handleSwith() {
      isRotate.value = !isRotate.value;
      context.emit("update:isRotate", isRotate.value);
    }

    return {
      value1,
      value2,
      handleFrom,
      handleTo,
      handleSwith,
      isRotate,
      autoOption
    };
  }
}
</script>

<style lang="less" scoped>
.languageBar {
  position: relative;
  z-index: 1001;

  .arrow {
    transform: scale(0.6);
    z-index: 100;
    position: absolute;
    left: 4.7rem;
    top: 0.28rem;
    border: 1px solid #bebebe;
    padding: 3px 10px;
    border-radius: 20px;

  }
}

::v-deep .van-dropdown-menu__title {
  font-weight: bold;
  color: var(--theme-active);
}

::v-deep .van-dropdown-menu__title:after {
  transform: rotate(-45deg), scale(1.5);
  color: transparent transparent var(--theme-active) var(--theme-active);
  border-color: transparent transparent var(--theme-active) var(--theme-active);
}

::v-deep .van-dropdown-menu__bar {
  background-color: #fcfcfc;
}
</style>