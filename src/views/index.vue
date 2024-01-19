<template>
  <div @click="handleClick" :class="{ 'animate__animated animate__hinge': isClicked }">
    handyTranlator
  </div>
</template>

<script>
import {ref} from 'vue'
export default {
  name: 'index',
  setup(props, context) {
    let isClicked = ref(false)
    function handleClick() {
      isClicked.value = true;
      setTimeout(() => {
        isClicked.value = false;
      }, 2000); 
    }
    return { handleClick, isClicked }
  }
}
</script>

<style scoped></style>