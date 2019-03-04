<template>
  <div id="mountNode"></div>
</template>

<script>
  import {forceLayer} from 'assets/js/drawing'

  export default {
    name: "all",
    mounted() {
      forceLayer({
        url: apiRoot + '/all'
      }, '知识图谱总览', '#mountNode');
    }
  }
</script>

<style lang="scss" scoped>

</style>
