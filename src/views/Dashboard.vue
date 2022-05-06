<template>
  <Layer>
    <div class="video-main">
      <div class="video-left">
        <div class="garden-start" @click="sourceStart">
          {{ isRecord ? "结束" : "录屏" }}
        </div>
        <div class="time">{{timeFormat(timestamp)}}</div>
        <div class="video-list">
          <table cellspacing="0" cellpadding="2">
            <tr>
              <th>文件名</th>
              <th>播放</th>
              <th>打开目录</th>
            </tr>
            <tr v-for=" file in files" :key="file">
              <td>{{file}}</td>
              <td @click="handlePlay(file)">播放</td>
              <td @click="handleOpenDir(file)">目录</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="video-right">
        <video ref='videoDom' id="video" v-show="isVideo"  ></video>
        <img v-show='!isVideo' :src="previewImg"/>
      </div>
    </div>
  </Layer>
</template>

<script>
import Layer from "@/components/Layer.vue";
import { ref } from "@vue/reactivity";
import { saveVideo, directoryFiles ,timeFormat } from "@/utils/helper";
import { LOCAHOST_VIDEO_PATH } from '@/utils/constant';
const { ipcRenderer } = window.require("electron");
const getSource = () => {
  return new Promise((resolve) => {
    console.log("我进来了");
    ipcRenderer.send("recive-dasktop");

    // 接收回复
    ipcRenderer.on("reply-source", (event, data) => {
      console.log(new Date(), data);
      resolve(data);
    });
  });
};

export default {
  name: "Dashboard",
  components: {
    Layer,
  },
  data() {
    return {};
  },
  setup() {
    const isVideo = ref(false)
    const isPlay = ref(true)
    const previewImg = ref("");
    const getPreview = async () => {
      const source = await getSource();
      // console.log(source[0].thumbnail.toDataURL());
      isVideo.value = false
      previewImg.value = source[0].thumbnail.toDataURL();
    };
    getPreview();

    const timer = ref(null);
    const timestamp = ref(0);

    // 录制时间
    const countDown = ()=>{
      timestamp.value ++
      timer.value = setTimeout(()=>{
        countDown()
      },1000)
    }

    const recorder = ref(null);
    const isRecord = ref(false);
    const files = ref([]);
    files.value = directoryFiles();
    // 开始录屏，保存视频
    const recordStart = (stream) => {
      countDown()
      isRecord.value = true;
      let blobSlice = [];
      recorder.value = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      if (recorder.value) {
        recorder.value.start(1000);
        recorder.value.ondataavailable = (event) => {
          blobSlice.push(event.data);
        };
        // 视频保存 用异步
        recorder.value.onstop = async () => {
          console.log("触发了退出录制");
          isRecord.value = false;
          const blob = new Blob([...blobSlice], {
            type: "video/webm",
          });
          saveVideo(blob).then(() => {
            // console.log("保存成功");
            alert("保存成功");
            stream.clone();
            console.log(recorder.value);
            files.value = directoryFiles();
          });
        };
        recorder.value.onerror = (err) => {
          console.log(err);
        };
      }
    };

    // 开始录制 触发事件
    const sourceStart = async () => {
      // 再次点击 结束录制
      if (isRecord.value) {
        // 清理定时器
        timer.value&&clearTimeout(timer.value)
        timestamp.value = 0
        recorder.value && recorder.value.stop();
        // 录制结束改为可以播放视频
        isPlay.value = true
        console.log("退出录制");
        return;
      }

      const source = await getSource();
      // 获取视频流
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source[0].id,
            minWidth: 1280,
            maxWidth: 1920,
            minHeight: 720,
            maxHeight: 1080,
          },
        },
      });
      // console.log(stream);
      handleVideoStream(stream)
      recordStart(stream);
    };

    const videoUrl = ref('')
    // 点击播放视频
    const handlePlay = (file)=>{
      
      if(!isPlay.value){
        alert('录制过程中不可以播放哦！')
        return
      }
      isVideo.value = true
      videoUrl.value = `${LOCAHOST_VIDEO_PATH}${file}`
      if(videoDom.value.srcObject){
        videoDom.value.srcObject=null
      }
      videoDom.value.onloadedmetadata = (e) => video.pause()
      videoDom.value.src= videoUrl.value
      videoDom.value.onloadedmetadata = (e) => video.play()
    }

    // 打开文件目录
    const handleOpenDir = (file)=>{
      ipcRenderer.send('dir-open',file)
    }

    // 录屏视频实时显示
    const videoDom = ref(null)
    const handleVideoStream = (stream) =>{
      
      isPlay.value = false
      // const videoStream = document.querySelector('#video')
      isVideo.value = true
      // console.log(videoDom.value,stream);
      // console.log(document.querySelector('#video'));
      videoDom.value.onloadedmetadata = (e) => video.pause()
      videoDom.value.srcObject = stream
      videoDom.value.onloadedmetadata = (e) => video.play()
      // console.log(videoDom.value.srcObject.getTracks()[0]);
    }

    return {
      previewImg,
      sourceStart,
      isRecord,
      files,
      timestamp,
      timeFormat,
      videoUrl,
      handlePlay,
      handleOpenDir,
      videoDom,
      isVideo
    };
  },
  methods: {
    // async getSource(){
    //   return new Promise(resolve => {
    //     console.log('我进来了');
    //     ipcRenderer.send('recive-dasktop')
    //     // 接收回复
    //     ipcRenderer.on('reply-source',(event,data) =>{
    //       console.log(data);
    //       resolve(data)
    //     })
    //   })
    // },
  },
  mounted() {
    // const source = this.getSource()
    // source.then((data)=>{
    //   console.log(data.thumbnail.toDataURL);
    // })
  },
};
</script>

<style lang="scss" scope>
.video-main {
  display: flex;
  justify-content: space-around;
  background-color: red;
  width: 100%;
  height: 100%;
  .video-left {
    width: 300px;
    display: flex;
    flex-direction: column;
    padding: 0 5px;
    border-radius: 15px;
    border: 4px solid #000;
    .garden-start {
      width: 145px;
      height: 145px;
      border-radius: 145px;
      background: #fff;
      line-height: 145px;
      margin: 40px auto 20px auto;
    }
    .time {
      margin: 40px 0;
      padding: 20px;
      background: #fff;
    }
    .video-list {
      background: #fff;
      width: 100%;
      margin: 0 auto;
      min-height: 500px;
      overflow: auto;
      table {
        width: 100%;
        th {
          border-bottom-width: 1px;
          border-bottom-style: double;
        }
        tr {
          margin: 10px 0;
        }
      }
    }
  }
  .video-right {
    width: 100vh;
    display: flex;
    flex-direction: column;
    background: #000;
    video,
    img {
      margin: auto 0;
    }
  }
}
</style>
