'use strict'

const simplify = require('./lib/simplify-dag.js')
const digraph = require('digraph-tag')
const test = require('tape')

test('straightaway works', function (assert) {
  const graph = digraph`
    A -> B
    B -> C
    C -> D
    D -> E
  `

  const results = simplify(graph.vertices, graph.incoming, graph.outgoing)

  assert.equal(results.vertices.size, 1)
  assert.deepEqual(results.vertices.values().next().value, ['A', 'B', 'C', 'D', 'E'])
  assert.equal(results.outgoing.size, 0)
  assert.equal(results.incoming.size, 0)
  assert.end()
})

test('complex works', function(assert) {
  /*
      A   C
       \ /
        B
        |
        D
       / \
      E   F
      |   |
      G   I
      |   |
      H   J
       \ /
        K
        |
        L
        |
        M
  */

  const graph = digraph`
    A -> B
    C -> B
    B -> D
    D -> E
    D -> F
    E -> G
    G -> H
    F -> I
    I -> J
    J -> K
    H -> K
    K -> L
    L -> M
  `
  const results = simplify(graph.vertices, graph.incoming, graph.outgoing)

  assert.equal(results.vertices.size, 6)
  assert.equal(results.outgoing.size, 5)
  assert.equal(results.incoming.size, 4)

  assert.end()
})

test('cycle works', function(assert) {
  /*
      A
     / \
    D   B
     \ /
      C
      |
      X
  */
  const graph = digraph`
    A -> B
    B -> C
    C -> D
    D -> A
    C -> X
  `
  const results = simplify(graph.vertices, graph.incoming, graph.outgoing)

  assert.equal(results.vertices.size, 2)
  assert.equal(results.outgoing.size, 1)
  assert.equal(results.incoming.size, 2)

  assert.end()
})
