<template>
  <svg class="svg-icon" aria-hidden="true" v-if="iconName">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import '@/assets/icons/index'
export default {
  name: 'SvgIcon',
  props: {
    name: {
      default: '',
      type: String
    }
  },
  computed: {
    iconName () {
      let name = this.name
      if (name) {
        return `#icon-${name}`
      } else {
        return '#icon-icon'
      }
    }
  }
}
</script>
