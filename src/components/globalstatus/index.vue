<script>
import { getStatus } from '@/API/api.js'
var fallingStatus = 'Normal'
var eventTableData = [
  {time: '06-06 12:00:01', location: 'RM001', event: 'Fall', duration: '12s', name: 'Bob', type: 'el-icon-bell'}
]
function getFallingStatus () {
  getStatus()
    .then(data => {
      this.status_code = data
    })
    .catch(error => {
      console.error(error)
    })
  return this.status_code
}
export default
{
  fallingStatus,
  eventTableData,
  getFallingStatus,
  data () {
    return {
      status_code: 'Normal'
    }
  }
}
</script>
