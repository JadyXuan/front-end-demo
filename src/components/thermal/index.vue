<template>
  <body>
    <el-container>
      <!--
      <el-header>
        <el-row :gutter="20">
          <el-col :span="8"><div style="font-size: 20px; font-weight: bold;">Thermal System v0.2</div></el-col>
          <el-col :span="8"><div class="grid-content"></div></el-col>
          <el-col :span="4"><div class="grid-content"></div></el-col>
          <el-col :span="4"><el-image style="width: 200px;" :src="logo_src"></el-image></el-col>
          <el-button type="success" style="margin: auto;" round @click="fallingWarning()"></el-button>
        </el-row>
      </el-header>
      -->
      <el-container direction="rtl">
        <el-main style="background-color: #fff;">
          <div style="color: black;margin-top: -20px;font-size: 30px;font-weight: bold;">Room 579 Realtime Monitor</div>
          <i class="el-icon-video-camera" style="display: inline-block; color: #3598FF; font-size: 25px;"></i>
          <div :class="connectionLight" style="display: inline-block;"></div>
          <span style="display: inline-block; color: black;">{{ connectionText }}</span>
          <div style="display: inline-block; padding-right: 10px; color: black;">{{ FormatTime(nowTime)}}</div>
          <video name="videoElement" id="videoElement" class="centeredVideo" controls muted autoplay width="720" height="458">
              Your browser is too old which doesn't support HTML5 video.
          </video>
          <el-alert
            :title="fallingbox.title"
            :type="fallingbox.type"
            :description="fallingbox.description"
            :center="true"
            :closable="false"
            >
          </el-alert>
        </el-main>
        <el-aside width="450px" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <div style="text-align: left;font-weight: bold;font-size: 25px;padding: 10px;">Detection Last 42hrs</div>
          <el-table
          :data="this.GLOBAL.eventTableData"
          height="250"
          style="width: 100%">
          <el-table-column
            prop="time"
            label="Time&Date"
            width="170"
          ></el-table-column>
          <el-table-column
            prop="event"
            label="Event"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="duration"
            label="Duration"
            width="170"
          ></el-table-column>
        </el-table>
        </el-aside>
      </el-container>
    </el-container>
  </body>
</template>

<script>
import flvjs from 'flv.js'

export default {
  name: 'Thermal',
  data () {
    return {
      nowTime: new Date(),
      logo_src: require('@/assets/logo/thingx.png'),
      playerConf: {
        type: 'flv',
        url: 'http://' + location.host + '/live?port=40002&app=test&stream=aaa',
        // url: 'http://127.0.0.1/live?port=1935&app=test&stream=aaa',
        enableWorker: true,
        enableStashBuffer: false, // 缓冲区
        stashInitialSize: 128,
        isLive: true
      },
      flvPlayer: null,
      tableData: [
        {status: 'Fell', start_time: '11:34 pm 2023/5/30', end_time: '11:35 pm 2023/5/30'},
        {status: 'Fell', start_time: '12:08 pm 2023/5/30', end_time: '12:08 pm 2023/5/30'}
      ],
      falling_status: null,
      timer: null,
      fallingbox: {
        type: 'info', title: 'Warning!', description: 'Detected fall risk'
      },
      connectionLight: 'redDotClass',
      connectionText: 'No Connection',
      start_stamp: null,
      end_stamp: null,
      falling_risk: 0,
      msg_box: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.videoPlayer()
    })
    this.getNowTime()
  },
  methods: {
    videoPlayer () {
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement')
        this.flvPlayer = flvjs.createPlayer(this.playerConf)
        this.flvPlayer.attachMediaElement(videoElement)
        this.flvPlayer.load()
        this.flvPlayer.play()
      }
      videoElement.addEventListener('progress', () => {
        let end = this.flvPlayer.buffered.end(0)
        let delta = end - this.flvPlayer.currentTime
        // 断连跳帧：当网页焦点不在该页面上时，画面帧会暂停。需要追帧
        if (delta > 5 || delta < 0) {
          this.flvPlayer.currentTime = this.flvPlayer.buffered.end(0) - 1
          return
        }
        // 缓存追帧：当后台输出速度大于播放速度时追帧
        if (delta > 1) {
          videoElement.playbackRate = 1.1
        } else {
          videoElement.playbackRate = 1
        }
      })
      videoElement.addEventListener('durationchange', () => {
        this.connectionLight = 'greenDotClass'
        this.connectionText = 'Live'
        console.log('on')
      })
      videoElement.addEventListener('ended', () => {
        this.connectionLight = 'redDotClass'
        this.connectionText = 'No Connection'
        console.log('off')
      })
      this.flvPlayer.on('error', () => {
        this.flvPlayer.destroy()
        this.flvPlayer = flvjs.createPlayer(this.playerConf)
        this.flvPlayer.attachMediaElement(videoElement)
        this.flvPlayer.load()
        this.flvPlayer.play()
      })
    },
    fallingWarning () {
      if (this.GLOBAL.fallingStatus === 'Falling') {
        if (this.falling_risk === 0) {
          // this.start_stamp = this.nowTime
          this.fallingbox = {
            type: 'warning', title: 'Warning!', description: 'Detected fall risk'
          }
        } else if (this.falling_risk < 3) {
          this.fallingbox = {
            type: 'warning', title: 'Warning!', description: 'Detected fall risk'
          }
        } else if (this.falling_risk >= 3) {
          this.fallingbox = {
            type: 'error', title: 'Warning!', description: 'Detected falling'
          }
        }
        this.falling_risk += 1
      } else {
        this.fallingbox = {
          type: 'info', title: 'Normal', description: 'No falling detected'
        }
        this.falling_risk = 0
      }
    },
    getNowTime () {
      let that = this
      let theNowTime = function () {
        that.nowTime = that.FormatTime()
      }
      setInterval(theNowTime, 1000)
    },
    FormatTime () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth()
      var day = date.getDate()
      var hour = this.checkTime(date.getHours())
      var minute = this.checkTime(date.getMinutes())
      var second = this.checkTime(date.getSeconds())
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    checkTime (time) {
      if (time < 10) {
        time = '0' + time
      }
      return time
    }
  },
  created () {
    console.log(location.host)
    this.fallingWarning()
    this.timer = setInterval(this.fallingWarning, 3000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.clock_timer)
  }
}
</script>

<style>
.buttonCamera {
  width: 120px;
  height: 120px;
  font-size: 18px;
}
.cam_image {
  object-fit: cover;
  width: 400px;
  height: 400px;
}
.el-header {
  background-color: #ffffff;
  color: rgb(203, 222, 255)fff;
  line-height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .25);
}

.el-aside {
  color: #333;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.bg-blue {
    background: #4169E1;
  }
.redDotClass {
width:12px;
height:12px;
border-radius: 50%;
display: block;
margin-left: 10px;
animation: red_light 1s ease-in-out infinite alternate;
background-color: red;
}
@keyframes red_light{
from{
box-shadow:0 0 4px #fd4848;
}
to{
box-shadow: 0 0 20px #fd3b3b
}
}
.greenDotClass {
width:12px;
height:12px;
border-radius: 50%;
display: block;
margin-left: 10px;
animation: green_light 1s ease-in-out infinite alternate;
background-color: rgb(26, 255, 0);
}
@keyframes green_light{
from{
box-shadow:0 0 4px #2bff00;
}
to{
box-shadow: 0 0 20px #55ff00
}
}

</style>
