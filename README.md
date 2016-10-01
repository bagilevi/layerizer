# layerizer

Arrange a graph into layers.

Can be used on a dependency graph, where an `a -> b` edge represents "a depends on b".

The nodes on layer 0 don't have inbound edges. The nodes on layer _x_ only point to nodes to layer _x_ & _x+1_.

It returns an array of layers, where a layer is an array of clusters, where a cluster is an array of strongly connected node IDs.

## Installation

    npm install layerizer

## Example

    var graphlib = require('graphlib');
    var layerize = require('layerizer').layerize;

    var g = new graphlib.Graph();
    g.setEdge('a', 'b');
    g.setEdge('a', 'c');
    g.setEdge('b', 'e');
    g.setEdge('b', 'f');
    g.setEdge('c', 'd');
    g.setEdge('c', 'v');
    g.setEdge('c', 'g');
    g.setEdge('c', 'h');
    g.setEdge('d', 'c');
    g.setEdge('d', 'i');
    g.setEdge('d', 'j');
    g.setEdge('e', 'f');
    g.setEdge('e', 'u');
    g.setEdge('f', 'u');
    g.setEdge('f', 'v');
    g.setEdge('h', 'i');
    g.setEdge('i', 'j');
    g.setEdge('j', 'h');

    console.log(layerize(g));

Outputs:

    [ [ [ 'a' ] ],
      [ [ 'b' ], [ 'd', 'c' ] ],
      [ [ 'e' ], [ 'g' ], [ 'h', 'j', 'i' ] ],
      [ [ 'f' ] ],
      [ [ 'u' ], [ 'v' ] ] ],
