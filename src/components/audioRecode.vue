<template>
  <!-- <div class="record-box"> -->
    <div class="record" @click="startRecord">
      <svg t="1702999057866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="6543" width="90" height="90">
        <path
          d="M512 444.8c-35.2 0-67.2 28.8-67.2 67.2s28.8 67.2 67.2 67.2 64-32 64-67.2-28.8-67.2-64-67.2z m0 99.2c-16 0-32-12.8-32-32s12.8-32 32-32 32 12.8 32 32-16 32-32 32z"
          fill="#8a8a8a80" p-id="6544"></path>
        <path
          d="M512 64C262.4 64 64 265.6 64 512s201.6 448 448 448 448-201.6 448-448S758.4 64 512 64z m-147.2 636.8c-6.4 6.4-12.8 9.6-19.2 9.6-6.4 0-16-3.2-19.2-9.6-51.2-51.2-76.8-115.2-76.8-188.8 0-70.4 28.8-137.6 76.8-188.8 12.8-12.8 28.8-12.8 41.6 0s12.8 28.8 0 41.6A205.44 205.44 0 0 0 307.2 512c0 54.4 22.4 108.8 60.8 147.2 9.6 9.6 9.6 28.8-3.2 41.6z m147.2-38.4c-83.2 0-150.4-67.2-150.4-150.4s67.2-150.4 150.4-150.4 150.4 67.2 150.4 150.4-67.2 150.4-150.4 150.4z m188.8 35.2c-6.4 6.4-12.8 9.6-19.2 9.6-6.4 0-16-3.2-19.2-9.6-12.8-12.8-12.8-28.8 0-41.6 38.4-38.4 60.8-89.6 60.8-147.2 0-54.4-22.4-108.8-60.8-147.2-12.8-12.8-12.8-28.8 0-41.6s28.8-12.8 41.6 0c51.2 51.2 76.8 115.2 76.8 188.8-3.2 73.6-32 140.8-80 188.8z"
          fill="#8a8a8a80" p-id="6545"></path>
      </svg>
    </div>
  <!-- </div> -->

  <van-popup v-model:show="isRecording" @click-overlay="stopRecord" round position="bottom" :style="{ height: '30%' }">
    <template #default>
      <div class="popup">
        <div class="title">正在聆听</div>
        <div class="recwave"></div>
        <div class="btn" @click="stopRecord">点击翻译</div>
      </div>
    </template>
  </van-popup>
</template>

<script>
import { ref, inject } from 'vue';
import Recorder from "recorder-core"
// import 'recorder-core/src/engine/mp3'
// import 'recorder-core/src/engine/pcm'
// import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/engine/wav';
import Wav2Other from '@/utils/wavTopcm.js';
import readAsDataURLAsync from '@/utils/readAsDataURLAsync.js';
import 'recorder-core/src/extensions/waveview'
export default {
  setup(props, context) {
    let isRecording = ref(false);
    let recorder = null

    function startRecord(success) {
      let wave
      recorder = new Recorder({
        type: "wav",//录音格式，可以换成wav等其他格式
        sampleRate: 16000, //录音的采样率，越大细节越丰富越细腻
        bitRate: 16, //录音的比特率，越大音质越好
        onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) => {
          wave && wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
        }
      })
      recorder.open(function () {//打开麦克风授权获得相关资源
        recorder.start()
        //创建可视化，指定一个要显示的div
        if (Recorder.WaveView) wave = Recorder.WaveView({ elem: ".recwave" });
        // success && success();
      }, function (msg, isUserNotAllow) {//用户拒绝未授权或不支持
        console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
      })
      isRecording.value = true;

    }

    function stopRecord() {
      if (isRecording.value) {
        isRecording.value = false;
        recorder.stop(function (blob, duration) {
          // 成功回调函数
          //简单利用URL生成本地文件地址，注意不用了时需要revokeObjectURL，否则霸占内存
          //此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
          var localUrl = (window.URL || webkitURL).createObjectURL(blob);
          recorder.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
          recorder = null;
          const set = {
            type: "pcm"
            , sampleRate: 16000
            , bitRate: 16
          }
          Wav2Other(set, blob, function (pcmBlob, duration, recorder) {

            console.log("转换成功，PCM 数据：", pcmBlob, "时长：", duration, "毫秒");
            
            if(duration<= 60*1000&&pcmBlob.size<4*1024*1024){
              Promise.all([readAsDataURLAsync(pcmBlob), readAsDataURLAsync(blob)]).then(([result1, result2]) => {
              context.emit("audioData", result1, localUrl, result2)
            }).catch((error) => {
              console.log(error);
            })
            }else{
              if(duration>60*1000){
                context.emit("audioData", 1, 1, 1,1)
              }else{
                context.emit("audioData", 2, 2, 2,2)
              }
              
            }
            // let reader = new FileReader();
            // reader.onloadend = function () {
            //   pcmBlob = reader.result.split(",")[1];
            //   context.emit("audioData", pcmBlob, localUrl, blob)
            // }
            // reader.readAsDataURL(pcmBlob)

          }, function (error) {
            // 失败回调函数
            console.error("转换失败，原因：", error);
          });


        }, function (msg) {
          console.log("录音失败:" + msg);
          recorder.close();//可以通过stop方法的第3个参数来自动调用close
          recorder = null;
        });
      }
    }

    return { startRecord, stopRecord, isRecording };
  },
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

// .record-box {
//   width: 100%;
//   background-color: var(--bg);
//   height: 89px;
//   z-index: 1000;
// }

.record {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;

  // &::before {
  //   content: '';
  //   position: absolute;
 
  //   transform: translate(-50%, -52%);
  //   width: 80px;
  //   height: 80px;
  // }

  // &:active::before {
  //   content: '';
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -52%);
  //   width: 80px;
  //   height: 80px;
  //   border: 5px solid #bebebe;
  //   border-radius: 50%;
  //   animation: emit 2s infinite linear;
  // }

  // @keyframes emit {
  //   0% {
  //     width: 80px;
  //     height: 80px;
  //     opacity: 1;
  //     border-width: 5px;
  //   }

  //   100% {
  //     width: 100px;
  //     height: 100px;
  //     opacity: 0;
  //     border-width: 1px;
  //   }
  // }

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

.recwave {
  width: 100%;
  height: 100px;
}
</style>
