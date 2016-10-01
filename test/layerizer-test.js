var assert = require('assert');
var graphlib = require('graphlib');
var layerize = require('../index').layerize;

describe('layerizer', function() {
  it('works', function() {
    assert.equal(-1, [1,2,3].indexOf(4));

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

    assert.deepEqual(
      [ [ [ 'v' ], [ 'g' ], [ 'h', 'j', 'i' ], [ 'u' ] ],
        [ [ 'd', 'c' ], [ 'f' ] ],
        [ [ 'e' ] ],
        [ [ 'b' ] ],
        [ [ 'a' ] ] ],
      layerize(g)
    )
  });
});
