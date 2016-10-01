var graphlib = require("graphlib");

module.exports.layerize = function(graph) {
  var clusters = graphlib.alg.tarjan(g);
  var acyclic = convertToAcyclicGraphByReplacingStronglyConnectedClustersWithSingleNodes(g, clusters);
  var layers = findLayersInAcyclicGraph(acyclic.graph);
  return layers.map(function(layer){
    return layer.map(function(nodeOrCluster){
      var clusterNodes = acyclic.clusters[nodeOrCluster]
      return clusterNodes === undefined ? [nodeOrCluster] : clusterNodes;
    });
  });
}

// Converts a graph to an acyclic graph, by replacing strongly connected clusters with a single node.
// Returns a new graph and a dictionary of clusterId => Array of node IDs.
// Note: The nodes in the new graph won't have any properties.
function convertToAcyclicGraphByReplacingStronglyConnectedClustersWithSingleNodes(graph, stronglyConnectedClusters) {
  var nodeIdToClusterId = {};
  var clusterIdToNodeIds = {};

  function translateNodeId(x) {
    return nodeIdToClusterId[x] === undefined ? x : nodeIdToClusterId[x];
  }
  stronglyConnectedClusters.map(function(cluster) {
    if (cluster.length > 1) {
      var clusterId = "";
      cluster.map(function(nodeId) { clusterId += nodeId; });
      cluster.map(function(nodeId) {
        nodeIdToClusterId[nodeId] = clusterId;
      });
      clusterIdToNodeIds[clusterId] = cluster;
    }
  });
  var newGraph = new graphlib.Graph();
  graph.nodes().map(function(nodeId) {
    graph.outEdges(nodeId).map(function(edge){
      var newV = translateNodeId(edge.v);
      var newW = translateNodeId(edge.w);
      if (newV !== newW) {
        newGraph.setEdge(newV, newW);
      }
    });
  });
  return {graph: newGraph, clusters: clusterIdToNodeIds};
}

// Takes an acyclic graph and groups nodes into layers, so that each edge will point from a higher layer to a lower layer.
// Returns Array of layers, each layer consists of an array of node IDs.
function findLayersInAcyclicGraph(graph) {
  var layers = [];
  var queue = [];
  var nodeLevel = {}; // nodeId => level(int)/undefined
  var nodeEdgeProcessed = {}; // nodeId => { targetNodeId => true/undefined }

  function allEdgesProcessed(source) {
    var edges = graph.outEdges(source);
    for (var i = 0; i < edges.length; i++) {
      var target = edges[i].w;
      if (!nodeEdgeProcessed[source][target]) return false;
    }
    return true;
  }

  function updateLevelIfHigher(node, level) {
    if (nodeLevel[node] === undefined) nodeLevel[node] = 0;
    if (nodeLevel[node] < level) nodeLevel[node] = level;
  }

  function markEdgeAsProcessed(source, target) {
    if (nodeEdgeProcessed[source] === undefined) nodeEdgeProcessed[source] = {};
    nodeEdgeProcessed[source][target] = true;
  }

  function addNodeToLayer(node, level) {
    if (layers[level] === undefined) layers[level] = [];
    layers[level].push(node);
  }

  function propagateLevelThroughEdge(source, target, level) {
    updateLevelIfHigher(source, level);
    markEdgeAsProcessed(source, target);
    if (allEdgesProcessed(source)) {
      addNodeToLayer(source, level);
      queue.push(source);
    }
  }

  graph.sinks().map(function(node) {
    updateLevelIfHigher(node, 0);
    addNodeToLayer(node, 0);
    queue.push(node);
  });

  var nodeId;
  while ((nodeId = queue.shift()) !== undefined) {
    var level = nodeLevel[nodeId];
    graph.inEdges(nodeId).map(function(edge) {
      propagateLevelThroughEdge(edge.v, edge.w, level + 1);
    });
  }

  return layers;
}

var edges = [
  ['a', 'b'],
  ['a', 'c'],
  ['b', 'e'],
  ['b', 'f'],
  ['c', 'd'],
  ['c', 'v'],
  ['c', 'g'],
  ['c', 'h'],
  ['d', 'c'],
  ['d', 'i'],
  ['d', 'j'],
  ['e', 'f'],
  ['e', 'u'],
  ['f', 'u'],
  ['f', 'v'],
  ['h', 'i'],
  ['i', 'j'],
  ['j', 'h']
]

var g = new graphlib.Graph();
edges.map(function(edge) {
  g.setEdge(edge[0], edge[1]);
});

var r = module.exports.layerize(g);
console.log("Result:");
console.log(r);
