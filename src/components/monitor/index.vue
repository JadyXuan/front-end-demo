<template>
  <body>
    <el-container>
      <el-main style="background-color: #fff;">
        <el-row style="text-align: right;">
          <el-button type="primary" icon="el-icon-plus" round @click="add_camera">Add Device</el-button>
        </el-row>
        <el-row>
          <!--
          <transition-group name="fade">
            <el-col :span="3" v-for="camera in cameras" :key="camera.id">
              <el-button type="success" class="buttonCamera" :id="camera.id" circle @click="show_cam_info($event)">{{camera.name}}</el-button>
            </el-col>
          </transition-group>
          -->
          <el-table
            :data="deviceData">
            <el-table-column
              prop="id"
              label="Device ID"
              width="200">
            </el-table-column>
            <el-table-column
              label="Device Type"
              width="200">
              <template slot-scope="scope">
                <i :class="scope.row.type" style="font-size: 25px;color: #3598FF;"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="location"
              label="Location"
              width="200">
            </el-table-column>
            <el-table-column
              prop="status"
              label="Detection Last 24hrs"
              width="250">
            </el-table-column>
            <el-table-column
              label="Action"
              width="200">
              <template slot-scope="scope">
                <el-popover
                  placement="bottom"
                  trigger="click">
                  <div style="text-align: center;"><el-button type="text" @click="jump_to_cam()">Monitor</el-button></div>
                  <div style="text-align: center;"><el-button type="text" disabled>View Records</el-button></div>
                  <div style="text-align: center;"><el-button type="text" disabled>Disconnected</el-button></div>
                  <i class="el-icon-more" slot="reference"></i>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-drawer :visible.sync="cam_drawer" :direction="direction">
            <el-card title="Camera Details">
              <img :src="view_src" class="cam_image">
              <span>{{ view_discribe }}</span>
              <div style="display: flex; justify-content: center;">
                <el-button type="success" style="margin: auto;" round @click="jump_to_cam()">Click to See Camera</el-button>
              </div>
            </el-card>
          </el-drawer>
        </el-row>
      </el-main>
    </el-container>
  </body>
</template>

<script>
// import DropdownMenu from '@/components/Share/DropdownMenu'
const cameras = [{ id: '1', name: 'Camera1' }, { id: '2', name: 'Camera2' }]
let id = cameras.length + 1
export default {
  name: 'Monitor',
  data () {
    return {
      cameras,
      cam_drawer: false,
      direction: 'rtl',
      view_src: require('@/assets/logo/1.png'),
      logo_src: require('@/assets/logo/thingx.png'),
      view_discribe: 'placeholder',
      deviceData: [
        {id: 'THfje978024', type: 'el-icon-video-camera', location: 'RM579', status: 'Fall Detection', act: ''},
        {id: 'TH10jhfg71u681', type: 'el-icon-video-camera', location: 'RM509', status: '-', act: ''},
        {id: 'BH04fnw7812', type: 'el-icon-magic-stick', location: 'L1 Bathroom', status: '-', act: ''}
      ]
    }
  },
  methods: {
    add_camera () {
      var newcam = { id: id++, name: 'default' }
      this.cameras.push(newcam)
    },
    show_cam_info (event) {
      this.cam_drawer = true
      console.log('@/assets/fake_data/' + event.currentTarget.id + '.jpg')
      this.view_src = require('@/assets/fake_data/' + event.currentTarget.id + '.jpg')
    },
    jump_to_cam () {
      this.$router.push({
        path: '/thermal'
      })
    }
  }
}
</script>

<style>
.fade-enter-active,
.icon-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
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
</style>
