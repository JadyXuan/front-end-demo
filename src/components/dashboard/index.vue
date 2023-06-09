<template>
  <body>
    <el-container>
      <el-aside width="50%">
        <el-row class="l-row"><div style="color: black; font-size: 25px; font-weight: bold; text-align: left; padding: 5px;">Recently View</div></el-row>
        <el-row class="l-row" style="padding-bottom: 10px;">
          <el-col :span="6" v-for="rcard in recent_card" :key="rcard">
            <el-card class="recent-card" shadow="always" style="text-align: left;">
              <div>
                <div style="font-size: 15px;">{{ rcard.name }}</div>
              </div>
              <i :class="rcard.icon" :style="{'font-size': '30px', 'color': rcard.color}"></i>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="l-row"><div style="color: black; font-size: 25px; font-weight: bold; text-align: left; padding: 5px;">Statistics</div></el-row>
        <el-row class="l-row">
          <el-col span="8">
            <el-card class="recent-card" shadow="always" :body-style="{ padding: '17px'}">
              <div>Number of Users</div>
              <i class="el-icon-user" style="font-size: 35px;"></i>
              <div style="display: inline-block;font-size: 23px;">519</div>
            </el-card>
          </el-col>
          <el-col span="8">
            <el-card class="recent-card" shadow="always">
              <div>Number of Devices</div>
              <i class="el-icon-connection" style="font-size: 30px;color: #3598FF;"></i>
              <div style="display: inline-block;font-size: 20px;">40</div>
              <i class="el-icon-connection" style="font-size: 30px;color: #7F7F7F;"></i>
              <div style="display: inline-block;font-size: 20px;">3</div>
            </el-card>
          </el-col>
          <el-col span="8">
            <el-card class="recent-card" shadow="always" :body-style="{ padding: '17px'}">
              <div>Monthly Alerts</div>
              <i class="el-icon-warning-outline" style="font-size: 35px;color: #F56C6C;"></i>
              <div style="display: inline-block;font-size: 23px;">26</div>
            </el-card>
          </el-col>
        </el-row>
        <el-row style="background:#eeeeee;text-align: left;padding-top: 20px;">
          <el-card class="chart-card" shadow="always">
            <span style="color: black;">Fall Events</span>
            <line-chart :chart-data="lineChartData.fallEvents" style="width: 100%;height: 120px;background-color: #fff;"/>
          </el-card>
        </el-row>
        <el-row style="background:#eeeeee;text-align: left;padding-top: 20px;">
          <el-card class="chart-card" shadow="always">
            <span style="color: black;">Abnormal Data</span>
            <line-chart :chart-data="lineChartData.abnormalData" :legend="abnormalChart" style="width: 100%;height: 120px;background-color: #fff;"/>
          </el-card>
        </el-row>
      </el-aside>
      <el-main>
        <el-row class="l-row"><div style="color: black; font-size: 25px; font-weight: bold; text-align: left;">Notification</div></el-row>
        <el-card>
          <el-table
            :data="this.GLOBAL.eventTableData">
            <el-table-column
              prop="time"
              label="Time&Date"
              width="180">
            </el-table-column>
            <el-table-column
              label="Event"
              width="350">
              <template slot-scope="scope">
                <i :class=scope.row.type style="font-size: 20px;"></i>
                <div style="display: inline-block;font-weight: bold;">{{ scope.row.location }}</div>
                <span>{{ scope.row.event }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </body>
</template>

<script>
import LineChart from '@/components/Charts/LineChart'

const lineChartData = {
  fallEvents: {
    expectedData: [3, 2, 0, 1, 5, 0, 1],
    actualData: [],
    setInterval: 1,
    setLegend: ['', '']
  },
  abnormalData: {
    expectedData: [10, 9, 18, 5, 8, 12, 4],
    actualData: [5, 10, 9, 2, 0, 1, 2],
    setInterval: 2,
    setLegend: ['Abnormal Breath Rate', 'Abnormal Heart Rate']
  }
}

export default {
  name: 'Thermal',
  components: {
    LineChart
  },
  data () {
    return {
      recent_card: [
        {name: 'RM250', icon: 'el-icon-video-camera', color: '#3598FF'},
        {name: 'RM300', icon: 'el-icon-video-camera', color: '#3598FF'},
        {name: 'L3 Bathroom', icon: 'el-icon-coffee-cup', color: '#3598FF'},
        {name: 'RM413', icon: 'el-icon-video-camera', color: '#7F7F7F'}
      ],
      lineChartData,
      notificationData: [
        {Date: '06-06 12:00:01', Event: 'fall detected', location: 'RM579', type: 'el-icon-alarm-clock'},
        {Date: '06-06 09:34:12', Event: 'press help button', location: 'RM509', type: 'el-icon-bell'}
      ]
    }
  }
}
</script>

<style>
.recent-card {
  width: 90%;
  height: 90%;
  margin: auto;
  color: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.chart-card {
  width: 98%;
  height: 90%;
  margin: auto;
  color: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.l-row {
  background-color: #eeeeee;
}
</style>
