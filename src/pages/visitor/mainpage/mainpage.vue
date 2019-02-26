<template>
  <div id="mountNode" style="background: currentColor"></div>
</template>

<script>
  export default {
    name: "mainpage",
    mounted() {
      this.$axios({
        // url: '/static/xiaomi.json'
        url: '/vp/all'
      }).then((res) => {
          let data = res.data.data;
          var Mapper = G6.Plugins['tool.d3.mapper'];
          var _d = d3,
            forceSimulation = _d.forceSimulation,
            forceLink = _d.forceLink,
            forceManyBody = _d.forceManyBody,
            forceX = _d.forceX,
            forceY = _d.forceY,
            forceCollide = _d.forceCollide;

          var nodeMap = {};
          var nodeSizeMapper = new Mapper('node', 'degree', 'size', [8, 48], {
            legendCfg: null
          });
          var nodeColorMapper = new Mapper('node', 'type', 'color', ['#e18826', '#002a67', '#006739']);
          var G = G6.G;
          var simulation = void 0;
          var graph = new G6.Graph({
            container: 'mountNode',
            height: window.innerHeight,
            plugins: [nodeSizeMapper, nodeColorMapper],
            modes: {
              default: ['rightPanCanvas']
            },
            layout: function layout(nodes, edges) {
              if (simulation) {
                simulation.alphaTarget(0.3).restart();
              } else {
                simulation = forceSimulation(nodes).force('charge', forceManyBody().strength(-100)).force('link', forceLink(edges).id(function (model) {
                  return model.id;
                })).force('collision', forceCollide().radius(function (model) {
                  return model.size / 2 * 1.2;
                })).force('y', forceY()).force('x', forceX()).on('tick', function () {
                  graph.updateNodePosition();
                });
              }
            }
          });
          graph.node({
            style: function style(model) {
              switch (model.type) {
                case 'Person':
                  return {
                    fill: '#e18826',
                    shadowColor: 'rgba(0,0,0, 0.3)',
                    shadowBlur: 3,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    stroke: null
                  };
                case 'Event':
                  return {
                    fill: '#002a67',
                    shadowColor: 'rgba(0,0,0, 0.3)',
                    shadowBlur: 3,
                    shadowOffsetX: 3,
                    shadowOffsetY: 5,
                    stroke: null
                  };
                case 'Meeting':
                  return {
                    fill: '#006739',
                    shadowColor: 'rgba(0,0,0, 0.3)',
                    shadowBlur: 3,
                    shadowOffsetX: 3,
                    shadowOffsetY: 5,
                    stroke: null
                  };
              }
            },
            label: function label(model) {
              return {
                text: model.properties['name'],
                stroke: null,
                fill: '#fff'
              };
            }
          });
          graph.edge({
            style: function style() {
              return {
                stroke: '#b3b3b3',
                lineWidth: 2
              };
            }
          });
          graph.read(data);
          graph.translate(graph.getWidth() / 2, graph.getHeight() / 2);

          // 拖拽节点交互
          var subject = void 0; // 逼近点
          graph.on('mousedown', function (ev) {
            if (ev.domEvent.button === 0) {
              subject = simulation.find(ev.x, ev.y);
            }
          });

          graph.on('dragstart', function (ev) {
            subject && simulation.alphaTarget(0.3).restart();
          });

          graph.on('drag', function (ev) {
            if (subject) {
              subject.fx = ev.x;
              subject.fy = ev.y;
            }
          });

          graph.on('mouseup', resetState);
          graph.on('canvas:mouseleave', resetState);

          function resetState() {
            if (subject) {
              simulation.alphaTarget(0);
              subject.fx = null;
              subject.fy = null;
              subject = null;
            }
          }

          // 鼠标移入节点显示 label
          function tryHideLabel(node) {
            var model = node.getModel();
            var label = node.getLabel();
            var labelBox = label.getBBox();
            if (labelBox.maxX - labelBox.minX > model.size) {
              label.hide();
              graph.draw();
            }
          }

          var nodes = graph.getNodes();
          var edges = graph.getEdges();

          edges.forEach(function (edge) {
            edge.getGraphicGroup().set('capture', false); // 移除边的捕获，提升图形拾取效率
          });

          nodes.forEach(function (node) {
            tryHideLabel(node);
          });

          graph.on('node:mouseenter', function (ev) {
            var item = ev.item;
            graph.toFront(item);
            item.getLabel().show();
            graph.draw();
          });

          graph.on('node:mouseleave', function (ev) {
            var item = ev.item;
            tryHideLabel(item);
          });
        }
      )
    }
  }
</script>

<style lang="scss" scoped>
  @import 'mainpage';
</style>
