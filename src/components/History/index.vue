<template>
  <el-container>
    <el-table
      :data="this.GLOBAL.eventTableData">
      <el-table-column
        prop="time"
        label="Time&Date"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="location"
        label="Location"
        width="180">
      </el-table-column>
      <el-table-column
        prop="event"
        label="Event Type"
        width="180">
      </el-table-column>
      <el-table-column
        prop="duration"
        label="Duration"
        width="180">
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
export default {
  name: 'history',
  data () {
    return {
      notificationData: [
        {time: '06-06 12:00:01', name: 'TREVOR KIRK', event: 'fall detected', location: 'RM579', duration: '12s', type: 'el-icon-alarm-clock'},
        {time: '06-06 09:34:12', name: 'FRANK CAMPBELL', event: 'fall detection', location: 'RM509', duration: '30s', type: 'el-icon-bell'}
      ]
    }
  }
}
</script>
