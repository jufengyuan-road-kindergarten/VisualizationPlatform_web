import axios from 'axios'
let map_type_name = {
  "Event": "事件",
  "Meeting": "会议",
  "Person": "人物",
  "Movement": "运动"
};
function forceLayer(axiosParams, title, mountNode) {
  let dom = document.querySelector(mountNode);
  let myChart = echarts.init(dom);
  let app = {};
  let option = null;
  app.title = '力引导布局';
  let map_type_category = {};
  let map_nodeId_index = {};
  let map_edgeId_index = {};

  myChart.showLoading();
  axios(axiosParams).then((data) => {
    myChart.hideLoading();

    let graph = data.data.data;
    console.log(graph);
    let categories = [];
    let cnt = 0;
    graph.nodes.forEach(function (node, index) {
      map_nodeId_index[node.id] = index;
      node.itemStyle = null;
      const base = 30;
      node.symbolSize = parseInt((Math.log(node.degree) * base).toFixed(0));
      node.symbolSize = !Number.isInteger(node.symbolSize) || node.symbolSize < base ? base : node.symbolSize;
      // console.log(node.degree, node.symbolSize);
      // node.symbolSize = 10;
      node.value = node.symbolSize;
      if (!(node.type in map_type_category)) {
        categories.push({
          name: map_type_name[node.type]
        });
        map_type_category[node.type] = cnt++;
      }
      node.category = map_type_category[node.type];
      // Use random x, y
      node.x = node.y = null;
      node.draggable = true;
      // node.symbolSize = [10, 20];
    });
    graph.edges.forEach((edge, index) => {
      map_edgeId_index[edge.id] = index;
      // edge.symbolSize = edge.properties.priority;
      edge.value = edge.properties.priority || 5;
      edge.itemStyle = null;
      // edge.label = {show: true, formatter: "{c}"}
    });
    option = {
      title: {
        text: title,
        subtext: 'Default layout',
        top: 'bottom',
        left: 'right'
      },
      tooltip: {
        formatter(params, ticket, callback) {
          console.log(params)
          switch (params.dataType) {
            case 'edge':
              return `
<p style="text-align:center;font-weight:bold;">${graph.nodes[map_nodeId_index[params.data.source]].name} <span style="color:#f990ff;font-style: italic;font-size:0.95em">-${params.data.properties.type}-></span> ${graph.nodes[map_nodeId_index[params.data.target]].name}</p>
<p>关系权重: ${params.data.value}</p>`;
            case 'node':
              return `
<p style="text-align:center;font-weight:bold;">${params.data.name}</p>
<p>类型: ${map_type_name[params.data.type]}</p>
${params.data.properties.wordming ? `<p>字/号: ${params.data.properties.wordming}</p>` : ''}
${params.data.properties.duration ? `<p>时期: ${params.data.properties.duration}</p>` : ''}
${params.data.properties.datetime ? `<p class="line3">时间: ${params.data.properties.datetime}</p>` : ''}
${params.data.properties.location ? `<p class="line3">地点: ${params.data.properties.location}</p>` : ''}
${params.data.properties.birthdate || params.data.properties.deathdate ? `<p>生卒: ${params.data.properties.birthdate ? params.data.properties.birthdate : ' '}-${params.data.properties.deathdate ? params.data.properties.deathdate : ' '}</p>` : ''}
${params.data.properties.pname ? `<p>原名: ${params.data.properties.pname}</p>` : ''}
${params.data.properties.othername ? `<p>别名: ${params.data.properties.othername}</p>` : ''}
${params.data.properties.birthplace ? `<p>籍贯: ${params.data.properties.birthplace}</p>` : ''}
${params.data.properties.achievement ? `<p style="max-width:500px;white-space: pre-wrap;display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5; overflow: hidden">成就: ${params.data.properties.achievement}</p>` : ''}
${params.data.properties.summary ? `<p style="max-width:500px;white-space: pre-wrap;display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 10; overflow: hidden">简述: ${params.data.properties.summary}</p>` : ''}
`;
            default:
              return `not support dataType`
          }
        }
      },
      legend: [{
        // selectedMode: 'single',
        data: categories.map(function (a) {
          return a.name;
        })
      }],
      animation: false,
      series: [
        {
          name: title,
          type: 'graph',
          layout: 'force',
          data: graph.nodes,
          edges: graph.edges,
          categories: categories,
          roam: true,
          label: {
            show: true
          },
          edgeLabel: {
            show: true,
            formatter(params) {
              return params.data.properties.type;
            }
          },
          force: {
            repulsion: 300,
            edgeLength: [100, 50]
          },
          symbol: 'circle',
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 10,
          lineStyle: {
            width: 2,
            color: 'rgba(0,0,0,.5)'
          }
        }
      ]
    };

    myChart.setOption(option);
    myChart.on('click', {dataType: 'node'}, function (params) {
      window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
    });
    // myChart.on('mouseover', {dataType: 'node'}, function (params) {
    //   console.log("!!", params)
    //   event.preventDefault();
    //   event.stopImmediatePropagation();
    //   // name 为 'my_el' 的元素被 'mouseup' 时，此方法被回调。
    // });
    if (option && typeof option === "object") {
      myChart.setOption(option, true);
    }
  });
}

export {forceLayer,map_type_name};
