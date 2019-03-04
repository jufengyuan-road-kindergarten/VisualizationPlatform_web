<template>
  <div class="page-wrapper">
    <Card :bordered="false" title="导航" class="guide" dis-hover shadow>
      <Button to="/all">知识图谱总览</Button>
      <Button to="/person-event">人物事件关系</Button>
      <Button to="/event-person">事件人物关系</Button>
      <Button to="/wiki">百科</Button>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "mainpage",
  }
</script>

<style lang="scss" scoped>
  @import 'mainpage';
</style>

<style lang="scss">
  .guide .ivu-btn {
    display: block;
    margin: 10px 20px;
  }
</style>
