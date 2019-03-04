<template>
  <div class="wrapper">
    <div id="mountNode"></div>
    <Input placeholder="在此输入事件/会议名称..." v-model="searchValue" class="search">
    <Button slot="append" icon="ios-search" @click="handleSearch"></Button>
    </Input>
  </div>
</template>

<script>
  import {forceLayer} from 'assets/js/drawing'

  export default {
    name: "event-person",
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
          url: apiRoot + '/event-person',
          params: {
            name: this.searchValue
          }
        }, '事件人物关系', '#mountNode');
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
