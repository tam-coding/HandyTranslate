<template>
  <div class="bubble">
    <div class="voice" :style="{
      margin: message?.position == 'right' ? '0 10px 0 auto' : '0 0 0 10px',
      'border-radius': message?.position == 'right' ? '7px 0px 7px 7px' : '0 7px 7px',
      'background': message?.position == 'right' ? 'var(--bg-blue)' : 'var(--bg-red)'
    }">
      <p class="source">
      <div class="bg" :class="{ voicePlay: isSourcePlaying }" @click="handlePlay(0)"></div>
      <div class="lang">{{ message?.sourceLanguage}}</div>
      <audio :src="message?.source" ref="sourceAudio" @ended="handleUnplay(0)"></audio>
      {{ message?.sourceText ?? "" }}
      </p>

      <div :class="message?.position == 'right' ? 'divide-blue' : 'divide-red'"></div>

      <p class="target">
      <div class="bg" :class="{ voicePlay: isTargetPlaying }" @click="handlePlay(1)"></div>
      <div class="lang">{{ message?.targetLanguage}}</div>
      <audio :src="message?.target" ref="targetAudio" @ended="handleUnplay(1)"></audio>
      {{ message?.targetText ?? "" }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
let isTargetPlaying = ref(false)
let isSourcePlaying = ref(false)
const { message } = defineProps(['message'])
const sourceAudio = ref("")
const targetAudio = ref("")
function handlePlay(bul) {
  if (bul === 1) {
    isTargetPlaying.value = !isTargetPlaying.value
    sourceAudio.value.pause()
    isTargetPlaying.value ? targetAudio.value.play() : targetAudio.value.pause()
  }
  if (bul === 0) {
    isSourcePlaying.value = !isSourcePlaying.value
    targetAudio.value.pause()
    isSourcePlaying.value ? sourceAudio.value.play() : sourceAudio.value.pause()
  }

}
function handleUnplay(bul) {
  if(bul === 1){
    isTargetPlaying.value = !isTargetPlaying.value
  }else{
    isSourcePlaying.value = !isSourcePlaying.value
  }
  
}
const audioUrl = ref("")
</script>

<style lang='less' scoped>
.bubble {
  width: 100%;
  margin-top: 10px;
  .source,
  .target {
    max-width: calc(100% - 40px);
    word-wrap: break-word;
    position: relative;
    min-height: 20px;
    padding-bottom: 10px;
  }

}

.voice {
  padding: 12px 10px 12px 10px;
  width: 80%;
  border-radius: 0 7px 7px;
  position: relative;


}

.bg {
  position: absolute;
  top: 0px;
  right: -35px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAYCAYAAAAF6fiUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzlFRDZDRDNENzlFMTFFNkJDN0NFMjA2QTFFRTRDQkIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzlFRDZDRDJENzlFMTFFNkJDN0NFMjA2QTFFRTRDQkIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTAxQkEzQ0RENzM2MTFFNjgyMEI5MTNDRkQ0OTM5QUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTAxQkEzQ0VENzM2MTFFNjgyMEI5MTNDRkQ0OTM5QUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4K4iKVAAACUUlEQVR42uSazytEURTHvTHjR4kaU8xsSDZSdmbjx4oSK8XGQrJlpSwYTSmxEWWhUIpsZK3kD7DRNBuSBZFCNjZ+JPKcV6ecXu/d3sy7595bc+vbfXPue5/749z77o83lm3bZYYFC8RZqAbQAigP2tXNj5aZF7gdkAZNk9+7WvnOCCgxRUCb9n/o1sk3pUH6QDHF/GNsoM+QeYfiy6qkFeLZDBb0GlTB4AAR/xXT9nXxZVa0WCekQd9Y0HOJjg3CHySviiZmfjO3AyIhnu0gBc0wjAIR/wLtW8z87aAOWAI9gqaYRoAff4ZUoi7EKCiUP462j4CdSCrfK4N1Ahpi6I0i/hPa50M4oFB+Dbm/SzXfL5MD4rUogxP8+Itozynm59E+q5ovyuQdHxphWh568XvR5kxq1SEn40L4e0XMA1L4EcEe7RTjLqYdqRf/gezQUwr5LxjXq+aLHPCFcTmTA7z4tutIQhXfLiJPKXyRA/oxzgW8v9DgxU+S62eF/ATGr6r5fg26Corj9RHD4Z0fvwfjS9CbQn4bxrfK+R6TyzxZNk260solTL4i/g3al10TsMXIryA72T7VfK8MnJO8X9CKy14lafXjxx8jFUsSeyUzfxhtPwHPoqTy/TJJMJzJiPgNpJdsuNJizPwztB/q4JtwHN2KW3sn3HuMOouR30l6bbsOvgkOyGIBnaPbRldalJl/h2knuvgmOKAWNAFKMUz4Iv4O6Z1xXXxTPxtazHy6khnVyS/Fb8IDpHGyuvmWgX9L4Q4toDnQFWhNN/9PgAEAR4w1ULjdCbEAAAAASUVORK5CYII=) right 0 no-repeat;
  width: 20px;
  height: 20px;
  background-size: 400%;
  z-index: 100;
}
.lang{
  position: absolute;
  bottom: -5px;
  left: 0px;
  font-size: 12px;
  z-index: 99;
  font-weight: bold;
  color: #fff;
}

.voicePlay {
  animation-name: voicePlay;
  animation-duration: 1s;
  animation-direction: normal;
  animation-iteration-count: infinite;
  animation-timing-function: steps(3);
}

@keyframes voicePlay {
  0% {
    background-position: 0;
  }

  100% {
    background-position: 100%;
  }
}
</style>