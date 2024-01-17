<template>
  <!-- @touchstart="startRecord" @touchend="endRecord" -->
  <div class="record" @click="startRecord">
    <svg t="1702999057866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="6543" width="100" height="100">
      <path
        d="M512 444.8c-35.2 0-67.2 28.8-67.2 67.2s28.8 67.2 67.2 67.2 64-32 64-67.2-28.8-67.2-64-67.2z m0 99.2c-16 0-32-12.8-32-32s12.8-32 32-32 32 12.8 32 32-16 32-32 32z"
        fill="#8a8a8a" p-id="6544"></path>
      <path
        d="M512 64C262.4 64 64 265.6 64 512s201.6 448 448 448 448-201.6 448-448S758.4 64 512 64z m-147.2 636.8c-6.4 6.4-12.8 9.6-19.2 9.6-6.4 0-16-3.2-19.2-9.6-51.2-51.2-76.8-115.2-76.8-188.8 0-70.4 28.8-137.6 76.8-188.8 12.8-12.8 28.8-12.8 41.6 0s12.8 28.8 0 41.6A205.44 205.44 0 0 0 307.2 512c0 54.4 22.4 108.8 60.8 147.2 9.6 9.6 9.6 28.8-3.2 41.6z m147.2-38.4c-83.2 0-150.4-67.2-150.4-150.4s67.2-150.4 150.4-150.4 150.4 67.2 150.4 150.4-67.2 150.4-150.4 150.4z m188.8 35.2c-6.4 6.4-12.8 9.6-19.2 9.6-6.4 0-16-3.2-19.2-9.6-12.8-12.8-12.8-28.8 0-41.6 38.4-38.4 60.8-89.6 60.8-147.2 0-54.4-22.4-108.8-60.8-147.2-12.8-12.8-12.8-28.8 0-41.6s28.8-12.8 41.6 0c51.2 51.2 76.8 115.2 76.8 188.8-3.2 73.6-32 140.8-80 188.8z"
        fill="#8a8a8a" p-id="6545"></path>
    </svg>
  </div>
  <van-popup v-model:show="showBottom" @click-overlay="endRecord" round position="bottom" :style="{ height: '30%' }">
    <template #default>
      <div class="popup">
        <div class="title">正在聆听</div>
        <!-- animation -->
        <div class="btn" @click="endRecord">点击翻译</div>
      </div>
    </template>
  </van-popup>
</template>

<script>
import { ref } from 'vue'

export default {
  setup(props, context) {
    let showBottom = ref(false)
    let isRecording = ref(false)
    let audioChunks = []
    let mediaStream = null
    let startTimestamp = 0;
    let stopTimestamp = 0;
    let recordingDuration = 0;

    function startRecord() {
      showBottom.value = true
      isRecording.value = true
      audioChunks = []
      startTimestamp = Date.now();
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaStream = stream
          const mediaRecorder = new MediaRecorder(stream)
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunks.push(e.data)
              // recordingDuration += e.data.duration
            }
          }
          mediaRecorder.onstop = () => {
            isRecording.value = false
            showBottom.value = false
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
            const reader = new FileReader()
            reader.onload = () => {
              const audioArrayBuffer = reader.result
              console.log(audioArrayBuffer);
              context.emit('audioData', audioArrayBuffer, audioBlob, recordingDuration);

            }
            reader.readAsDataURL(audioBlob)
          }
          mediaRecorder.start()
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error)
        })
    }

    function endRecord() {
      if (isRecording.value) {
        const mediaStreamTracks = mediaStream.getTracks()
        stopTimestamp = Date.now();
        recordingDuration = (stopTimestamp - startTimestamp) / 1000;
        console.log(recordingDuration);
        console.log(startTimestamp);
        console.log(stopTimestamp);
        mediaStreamTracks.forEach((track) => {
          track.stop()
        })
      }
    }

    return { startRecord, endRecord, showBottom }
  }
}
</script>

<style lang="less" scoped>
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.record {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -52%);
    width: 80px;
    height: 80px;
  }

  &:active::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -52%);
    width: 80px;
    height: 80px;
    border: 5px solid #bebebe;
    border-radius: 50%;
    animation: emit 2s infinite linear;
  }

  @keyframes emit {
    0% {
      width: 80px;
      height: 80px;
      opacity: 1;
      border-width: 5px;
    }

    100% {
      width: 100px;
      height: 100px;
      opacity: 0;
      border-width: 1px;
    }
  }

}

.popup {
  text-align: center;

  .title {
    color: #a4a3a3;
    margin-top: 30px;
    font-size: 18px;
  }

  .btn {
    color: #444;
    border: 1px solid #ccc;
    background-color: #eaeaea;
    font-size: 16px;
    width: 80px;
    padding: 10px 12px;
    border-radius: 20px;
    margin: 0 auto;
  }
}
</style>
