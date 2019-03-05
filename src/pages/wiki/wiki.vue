<template>
  <div id="wiki-wrapper">
    <div v-if="!$route.query.wd">
      <div class="search">
        <AutoComplete
          :data="autoCompleteData"
          :filter-method="filterMethod"
          placeholder="请输入人物、事件、会议名称"
          icon="ios-search"
          size="large"
          @on-search="handleSearch"
          :maxShow=5
        >
        </AutoComplete>
      </div>
    </div>
    <div style="overflow: hidden;" v-show="$route.query.wd&&node">
      <div class="search2">
        <AutoComplete
          :data="autoCompleteData"
          :filter-method="filterMethod"
          placeholder="请输入人物、事件、会议名称"
          icon="ios-search"
          size="large"
          @on-search="handleSearch"
          :maxShow=5
        >
        </AutoComplete>
      </div>
      <Row type="flex" justify="center" align="top" class="content" :gutter=50>
        <Col :span="eventTree?20:8" v-if="node">
          <Card :bordered="false" :title="`${map_type_name[node.type]}信息`" class="guide" dis-hover shadow>
            <h2 style="text-align: center;">{{node.name}}</h2>
            <p>类型: {{map_type_name[node.type]}}</p>
            <p v-if="node.properties.wordming">字/号: {{node.properties.wordming}}</p>
            <p v-if="node.properties.duration">时期: {{node.properties.duration}}</p>
            <p v-if="node.properties.datetime">时间: {{node.properties.datetime}}</p>
            <p v-if="node.properties.location">地点: {{node.properties.location}}</p>
            <p v-if="node.properties.birthdate || node.properties.deathdate">
              生卒: {{node.properties.birthdate || " "}}-{{node.properties.deathdate || ' '}}</p>
            <p v-if="node.properties.pname">原名: {{node.properties.pname}}</p>
            <p v-if="node.properties.othername">别名: {{node.properties.othername}}</p>
            <p v-if="node.properties.birthplace">籍贯: {{node.properties.birthplace}}</p>
            <p v-if="node.properties.achievement" style="white-space: pre-wrap">成就:
              {{node.properties.achievement}}</p>
            <p v-if="node.properties.summary" style="white-space: pre-wrap;">简述: {{node.properties.summary}}</p>
          </Card>
        </Col>
        <Col span="8" v-if="relations">
          <Card :bordered="false" title="人物关系" class="guide" dis-hover shadow>
            <div v-for="item of relations" class="personCard" :key="item.value">
              <Row>
                <Tag :color="map_type_color['Person']"
                     @click.native="$router.push({path:'/wiki',query:{wd:item.name}})">{{item.name}}
                </Tag>
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
      <Row type="flex" justify="center" class="content" :gutter=50 v-show="eventTree">
        <Col span="20">
          <Card :bordered="false" title="事件关系树" class="guide" dis-hover shadow>
            <div id="mountNode"></div>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  import AutoComplete from 'components/auto-complete'
  import {map_type_name, tree} from 'assets/js/drawing'

  export default {
    name: "wiki",
    components: {AutoComplete},
    data: () => ({
      autoCompleteData: [],
      nodeData: [],
      node: null,
      relations: null,
      map_type_name,
      map_type_color: {
        "Event": '#2F4554',
        "Meeting": "#61A0A8",
        "Person": "#C23531"
      },
      cnt: 0,
      eventTree: null
    }),
    async mounted() {
      this.$Spin.show();
      await this.loadAutoCompleteData();
      if (this.$route.query.wd) {
        await this.loadNodeData();
      }
      this.$Spin.hide();
    },
    watch: {
      async '$route.query.wd'() {
        this.$Spin.show();
        if (!this.$route.query.wd) {
          await this.loadAutoCompleteData();
        } else {
          await this.loadNodeData();
        }
        this.$Spin.hide();
      }
    },
    methods: {
      async handleClickPage(val) {
        this.$Spin.show();
        await this.loadNodeData(val);
        this.$Spin.hide();
      },
      loadNodeData(page = 0) {
        let type = this.nodeData.find((x) => {
          return x.name === this.$route.query.wd;
        }).type;
        let axios = null;
        switch (type) {
          case "Person":
            axios = this.$axios({
              url: apiRoot + '/personRelation',
              params: {
                person: this.$route.query.wd,
                page,
                pageSize: 5
              }
            }).then((res) => {
              this.node = res.data.data.node;
              this.relations = res.data.data.relations;
              this.cnt = res.data.data.count;
            }).catch(() => {

            });
            break;
          case "Event":
          case "Meeting":
            axios = tree({
              url: apiRoot + '/eventTree', params: {
                eventName: this.$route.query.wd
              }
            }, '#mountNode').then((res) => {
              this.eventTree = res.tree;
              this.node = res.node;
            })
        }
        return axios
      },
      loadAutoCompleteData() {
        return this.$axios({
          url: apiRoot + '/allName',
          params: {
            type: ['Person', 'Event', 'Meeting']
          }
        }).then((res) => {
          this.nodeData = res.data.data;
          this.autoCompleteData = this.nodeData.map((x) => {
            return x.name;
          });
          console.log(this.autoCompleteData, this.nodeData)
        }).catch(() => {

        })
      },
      handleSearch(value) {
        if (this.autoCompleteData.indexOf(value) !== -1) {
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
    min-height: 100%;
    min-width: 100%;
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

  .content {
    padding: 20px 0;
    p {
      padding-top: 0.5em;
      line-height: 1.65em;
    }
  }

  .personCard {
    padding: 5px 10px;
    background: rgba(0, 0, 0, .05);
    border: 1px solid rgba(0, 0, 0, .08);
    box-shadow: rgba(0, 0, 0, .15) 0 3px 10px;
    &:not(:first-child) {
      margin-top: 5px;
    }
  }

  .page {
    margin-top: 10px;
    text-align: center;
  }

  .search2 {
    width: 80vw;
    max-width: 800px;
    text-align: center;
    margin: 20px auto auto;
  }
</style>
