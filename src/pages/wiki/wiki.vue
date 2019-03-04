<template>
  <div id="wiki-wrapper">
    <div v-if="!$route.query.wd">
      <div class="search">
        <AutoComplete
          :data="autoCompleteData"
          :filter-method="filterMethod"
          placeholder="请输入人物名称"
          icon="ios-search"
          size="large"
          @on-search="handleSearch"
          :maxShow=5
        >
        </AutoComplete>
      </div>
    </div>
    <div style="overflow: hidden;" v-if="$route.query.wd&&node">
      <div class="search2">
        <AutoComplete
          :data="autoCompleteData"
          :filter-method="filterMethod"
          placeholder="请输入人物名称"
          icon="ios-search"
          size="large"
          @on-search="handleSearch"
          :maxShow=5
        >
        </AutoComplete>
      </div>
      <Row type="flex" justify="center" align="top" class="content" :gutter=50>
        <Col span="8">
          <Card :bordered="false" title="人物信息" class="guide" dis-hover shadow>
            <h2 style="text-align: center;">{{node.name}}</h2>
            <p>类型: {{map_type_name[node.type]}}</p>
            <p v-if="node.properties.wordming">字/号: {{node.properties.wordming}}</p>
            <p v-if="node.properties.birthdate || node.properties.deathdate">生卒: {{node.properties.birthdate || ' '}}-{{node.properties.deathdate || ' '}}</p>
            <p v-if="node.properties.pname">原名: {{node.properties.pname}}</p>
            <p v-if="node.properties.othername">别名: {{node.properties.othername}}</p>
            <p v-if="node.properties.birthplace">籍贯: {{node.properties.birthplace}}</p>
            <p v-if="node.properties.achievement" style="max-width:500px;white-space: pre-wrap">成就: {{node.properties.achievement}}</p>
            <p v-if="node.properties.summary" style="max-width:500px;white-space: pre-wrap;">简述: {{node.properties.summary}}</p>
          </Card>
        </Col>
        <Col span="8">
          <Card :bordered="false" title="人物关系" class="guide" dis-hover shadow>
            <div v-for="item of relations" class="personCard" :key="item.value">
              <Row>
                <Tag :color="map_type_color['Person']" @click.native="$router.push({path:'/wiki',query:{wd:item.name}})">{{item.name}}</Tag>
              </Row>
              <Row>
                相关度: {{item.weight}}
              </Row>
              <Row>
                共同参与:
                <div>
                  <Tag v-for="e of item.events" :key="e.value" :color="map_type_color[e.type]">{{e.name}}</Tag>
                </div>
              </Row>
            </div>
            <Page :total="cnt" size="small" show-total class="page" @on-change="handleClickPage"/>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  import AutoComplete from 'components/auto-complete'
  import {map_type_name} from 'assets/js/drawing'
  export default {
    name: "wiki",
    components:{AutoComplete},
    data: () => ({
      autoCompleteData: [],
      node:null,
      map_type_name,
      map_type_color:{
        "Event": '#2F4554',
        "Meeting": "#61A0A8",
        "Person": "#C23531"
      },
      cnt:0
    }),
    async mounted() {
      let promises=[];
      promises.push(this.loadAutoCompleteData());
      if(this.$route.query.wd){
        promises.push(this.loadNodeData());
      }
      this.$Spin.show();
      await Promise.all(promises);
      this.$Spin.hide();
    },
    watch:{
      async '$route.query.wd'(){
        this.$Spin.show();
        if(!this.$route.query.wd){
          await this.loadAutoCompleteData();
        }else{
          await this.loadNodeData();
        }
        this.$Spin.hide();
      }
    },
    methods: {
      async handleClickPage(val){
        this.$Spin.show();
        await this.loadNodeData(val);
        this.$Spin.hide();
      },
      loadNodeData(page=0){
        return this.$axios({
          url:apiRoot+'/person-relation',
          params:{
            person:this.$route.query.wd,
            page,
            pageSize:5
          }
        }).then((res)=>{
          this.node=res.data.data.node;
          this.relations=res.data.data.relations;
          this.cnt=res.data.data.count;
        }).catch(()=>{

        })
      },
      loadAutoCompleteData(){
        return this.$axios({
          url: apiRoot + '/allName',
          params: {
            type: ['Person']
          }
        }).then((res) => {
          this.autoCompleteData = res.data.data.map((x)=>{
            return x.name;
          });
          console.log(this.autoCompleteData)
        }).catch(()=>{

        })
      },
      handleSearch(value) {
        if(this.autoCompleteData.indexOf(value)!==-1){
          this.$router.push({
            path: '/wiki', query: {
              wd: value
            }
          })
        }
      },
      filterMethod(value, option) {
        return option.indexOf(value) !== -1;
      }
    }
  }
</script>

<style lang="scss" scoped>
  #wiki-wrapper {
    min-height:100%;
    min-width:100%;
    background-image: url(../../assets/img/blue-lines.jpg);
    background-size: cover;
  }

  .search {
    position: fixed;
    width: 80vw;
    max-width: 800px;
    text-align: center;
    top: 40vh;
    left: 0;
    right: 0;
    margin: auto;
  }

  .content{
    padding-top:20px;
  }

  .personCard{
    padding:5px 10px;
    background: rgba(0,0,0,.05);
    border:1px solid rgba(0,0,0,.08);
    box-shadow: rgba(0,0,0,.15) 0 3px 10px;
    &:not(:first-child){
      margin-top:5px;
    }
  }
  .page{
    margin-top:10px;
    text-align: center;
  }
  .search2{
    width: 80vw;
    max-width: 800px;
    text-align: center;
    margin:20px auto auto;
  }
</style>
