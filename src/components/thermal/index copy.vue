<template>
  <body>
    <el-container>
      <el-header>
        <el-row :gutter="20">
          <el-col :span="8"><div style="font-size: 20px; font-weight: bold;">Thermal System v0.2</div></el-col>
          <el-col :span="8"><div class="grid-content"></div></el-col>
          <el-col :span="4"><div class="grid-content"></div></el-col>
          <el-col :span="4"><el-image style="width: 200px;" :src="logo_src"></el-image></el-col>
          <el-button type="success" style="margin: auto;" round @click="fallingWarning()"></el-button>
        </el-row>
      </el-header>
      <el-container direction="rtl">
        <el-main>
          <video name="videoElement" id="videoElement" class="centeredVideo" controls muted autoplay width="1000" height="500">
              Your browser is too old which doesn't support HTML5 video.
          </video>
          <el-card shadow="never">
            <div :class="connectionLight" style="display: inline-block;"></div>
            <span style="display: inline-block;">{{ connectionText }}</span>
            <div style="display: inline-block; padding-right: 10px;">{{ FormatTime(nowTime)}}</div>
          </el-card>
          <el-alert
            :title="fallingbox.title"
            :type="fallingbox.type"
            :description="fallingbox.description"
            :center="true"
            :closable="false"
            >
          </el-alert>
        </el-main>
        <el-aside width="10px" class="bg-blue">
        </el-aside>
        <el-aside width="450px" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <el-table
          :data="tableData"
          height="250"
          border
          style="width: 100%">
          <el-table-column
            prop="status"
            label="Event"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="start_time"
            label="Start"
            width="170"
          ></el-table-column>
          <el-table-column
            prop="end_time"
            label="End"
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
import { getStatus } from '@/API/api.js'

export default {
  name: 'Thermal',
  data () {
    return {
      nowTime: new Date(),
      alarm: new Audio('http://' + location.host + '/static/alarm.mp3'),
      logo_src: require('@/assets/logo/thingx.png'),
      tableData: [
        {status: 'Falling', start_time: '11:34 pm 2023/5/30', end_time: '11:35 pm 2023/5/30'},
        {status: 'Falling', start_time: '12:08 pm 2023/5/30', end_time: '12:08 pm 2023/5/30'}
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
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: 'http://' + location.host + '/live?port=40002&app=test&stream=aaa',
          enableWorker: true,
          enableStashBuffer: false, // 缓冲区
          stashInitialSize: 128,
          isLive: true
        })
        flvPlayer.attachMediaElement(videoElement)
        flvPlayer.load()
        flvPlayer.play()
      }
      videoElement.addEventListener('progress', () => {
        let end = flvPlayer.buffered.end(0)
        let delta = end - flvPlayer.currentTime
        // 断连跳帧：当网页焦点不在该页面上时，画面帧会暂停。需要追帧
        if (delta > 5 || delta < 0) {
          flvPlayer.currentTime = flvPlayer.buffered.end(0) - 1
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
    },
    fallingWarning () {
      getStatus()
        .then(data => {
          this.falling_status = data
        })
        .catch(error => {
          console.error(error)
        })
      if (this.falling_status === 'Falling') {
        if (this.falling_risk === 0) {
          this.start_stamp = this.nowTime
          this.fallingbox = {
            type: 'warning', title: 'Warning!', description: 'Detected fall risk'
          }
        } else if (this.falling_risk < 3) {
          this.fallingbox = {
            type: 'warning', title: 'Warning!', description: 'Detected fall risk'
          }
          this.alarm.play()
        } else if (this.falling_risk >= 3) {
          this.fallingbox = {
            type: 'error', title: 'Warning!', description: 'Detected falling'
          }
          if (!this.msg_box) {
            this.msg_box = true
            this.$alert('Room 001 Detected Falling', 'Fallling Event', {
              confirmButtonText: 'confirm',
              callback: action => {
                this.$message({
                  type: 'error',
                  message: 'Room 001 Detected Falling!'
                })
                this.msg_box = false
              }
            })
          }
        }
        this.falling_risk += 1
      } else {
        this.fallingbox = {
          type: 'info', title: 'Normal', description: 'No falling detected'
        }
        this.alarm.pause()
        if (this.falling_risk >= 3) {
          this.end_stamp = this.nowTime
          this.tableData.push({status: 'Falling', start_time: this.start_stamp, end_time: this.end_stamp})
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
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
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
width:15px;
height:15px;
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
width:15px;
height:15px;
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
