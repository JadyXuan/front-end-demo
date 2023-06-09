<template>
  <el-container class="container">
    <el-header>
      <el-row :gutter="20">
          <el-col :span="4"><el-image style="width: 180px;" :src="logo_src"></el-image></el-col>
          <el-col :span="15"><div class="grid-content"></div></el-col>
          <el-col :span="1"><i class="el-icon-search" style="font-size: 30px;"></i></el-col>
          <el-col :span="1"><i class="el-icon-setting" style="font-size: 30px;"></i></el-col>
          <el-col :span="1"><i class="el-icon-bell" style="font-size: 30px;"></i></el-col>
          <el-col :span="2">
            <div>
              <img :src="headUrl" style="height: 40px;border-radius: 50%"/>
            </div>
          </el-col>
          <!-- el-button type="success" style="margin: auto;" round @click="fallingWarning()"></el-button -->
        </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 左侧导航 --><!-- default-active="/management/guanli" 默认加载页路由路径 -->
        <el-menu
        default-active="/dashboard"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#FFFFFF"
        text-color="#7F7F7F"
        active-text-color="#3598FF"
        :router="true"><!-- :router="true"开启导航 -->
          <el-menu-item index="/dashboard" style="text-align: left;">
            <i class="el-icon-menu" style="font-size: 30px;"></i>
            <span slot="title">Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/monitor" style="text-align: left;">
            <i class="el-icon-s-platform" style="font-size: 30px;"></i>
            <span slot="title">Devices</span>
          </el-menu-item>
          <el-menu-item index="/history" style="text-align: left;">
            <i class="el-icon-s-order" style="font-size: 30px;"></i>
            <span slot="title">History</span>
          </el-menu-item>
          <!--
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/thermal">选项1</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          -->
        </el-menu>
        <!-- 左侧导航 -->
      </el-aside>
      <el-main>
        <router-view /><!-- 路由出口 -->
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      timer: null,
      logo_src: require('@/assets/logo/thingx.png'),
      headUrl: require('@/assets/logo/1.png'),
      alarm: new Audio(require('@/assets/sound/alarm.mp3')),
      start_stamp: null,
      end_stamp: null,
      duration: null,
      falling_risk: 0,
      msg_box: false,
      event_box: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    globalFallingWarning () {
      this.GLOBAL.fallingStatus = this.GLOBAL.getFallingStatus()
      console.log(this.GLOBAL.fallingStatus)
      if (this.GLOBAL.fallingStatus === 'Falling') {
        if (this.falling_risk === 0) {
          this.start_stamp = this.getNowTime()
        } else if (this.falling_risk >= 2) {
          if (!this.msg_box && !this.event_box) {
            this.alarm.play()
            this.msg_box = true
            this.event_box = true
            this.$alert('Room 001 Detected Falling', 'Fallling Event', {
              confirmButtonText: 'confirm',
              callback: action => {
                this.$message({
                  type: 'error',
                  message: 'Room 001 Detected Falling!'
                })
                this.alarm.pause()
                this.msg_box = false
              }
            })
          }
        }
        this.falling_risk += 1
      } else {
        this.event_box = false
        if (this.falling_risk >= 3) {
          this.end_stamp = this.getNowTime()
          this.duration = this.getDuration(this.start_stamp, this.end_stamp)
          this.GLOBAL.eventTableData.push({
            time: this.FormatTime(this.start_stamp),
            location: 'RM001',
            event: 'Fall',
            duration: this.duration,
            name: 'Volunteer A',
            type: 'el-icon-bell'})
        }
        this.falling_risk = 0
      }
    },
    getNowTime () {
      var time = new Date()
      return time
    },
    getDuration (start, end) {
      var difftime = (end - start) / 1000
      var hours = parseInt(difftime / 3600)
      var minutes = parseInt(difftime % 3600 / 60)
      var seconds = parseInt(difftime % 60)
      var duration = `${minutes}m ${seconds}s`
      if (hours !== 0) {
        duration = `${hours}h ` + duration
      }
      return duration
    },
    FormatTime (date) {
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
    this.timer = setInterval(this.globalFallingWarning, 3000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style>
/* 去掉选项右侧边框 */
.el-menu {
  border-right: none;
}
/* 设置整体布局高度 */
.container {
  height: 100vh;
}

.el-header,
.el-footer {
  background-color: #ffffff;
  color: #7a7a7a;
  text-align: center;
}

.el-aside {
  background-color: #ffffff;
  color: #ffffff;
  text-align: center;
}

.el-main {
  background-color: #eeeeee;
  color: #ededed;
  text-align: center;
}

body>.el-container {
  margin-bottom: 20px;
  margin-top: -20px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
