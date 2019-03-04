<template>
  <div class="wrapper">
    <div id="mountNode"></div>
    <Input placeholder="在此输入人物名称..." v-model="searchValue" class="search">
    <Button slot="append" icon="ios-search" @click="handleSearch"></Button>
    </Input>
  </div>
</template>

<script>
  import {forceLayer} from 'assets/js/drawing'

  export default {
    name: "person-event",
    data: () => ({
      searchValue: ""
    }),
    mounted() {
      // forceLayer({
      //   url: apiRoot + '/all'
      // }, '#mountNode');
    },
    methods: {
      handleSearch() {
        forceLayer({
          url: apiRoot + '/person-event',
          params: {
            name: this.searchValue
          }
        }, '人物事件关系', '#mountNode');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 300px;
  }
</style>
