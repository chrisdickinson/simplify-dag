# simplify-dag

Given a directed acyclic graph, simplify straight-line runs into single vertices.

```javascript
const simplify = require('simplify-dag')
const digraph = require('digraph-tag')

let graph = digraph`
  A -> B
  B -> C
  C -> D
  X -> Y
  Y -> Z
  Z -> D
  D -> U
  U -> V
`

let simplified = simplify(graph) 
/*
   A   X
   ↓   ↓
   B   Y
   ↓   ↓       [A, B, C]   [X, Y, Z]
   C   Z            \___   ___/
    \ /                 \ /
     Y     --->          Y
     ↓                   ↓
     D               [D, U, V]
     ↓
     U
     ↓
     V
*/
```

**Note:** passing a graph with cycles to this module will mostly likely result
in an infinite loop. Be sure to remove cycles from your graph before applying
this module.

## API

##### `Map<Vertex → Set<Edge>> → Edges`

A `Map` from `Vertex` (whatever type you provide) to `Edge` will be defined as `Edges`.

##### `{vertices: Set<Vertex>, outgoing: Edges, incoming: Edges} → Graph`

An object with the properties `vertices`, `outgoing`, and `incoming`, whose types are
`Set<Vertex>` and `Edges` respectively will be known as a `Graph`. Incoming `Edges` will
map a given `Vertex` instance to every incoming `Edge`, and outgoing `Edges` will map `Vertex`
instances to every outgoing `Edge`. `Edge` and `Vertex` types are *user-defined* – that is,
you should provide instructions to this module on how to treat these types.

##### `Array<Vertex> → DerivedVertex`

`DerivedVertex` instances represent straight-line runs of `Vertex` instances from the original
graph. This module will *only* produce `DerivedVertex` instances.

##### `{copyEdge: Function?, getFrom: Function?, getTo: Function?}? → Interface`

An `Interface` is defined as an object that optionally defines `copyEdge`, `getFrom`, and
`getTo` properties. 

* `copyEdge` takes the original `Edge` object, and new "source" and
"edge" `DerivedVertex` instances. If not defined it will create `[newSource, newDest]` array instances.
* `getFrom` takes an `Edge` and returns the source of the edge. If not defined it will treat
edges as 2-element arrays, and attempt to take the first element as the source.
* `getTo` takes an `Edge` and returns the destination of the edge. As above, if not defined
it will treat edges as a 2-element array and return the second element as the destination.

##### `simplify(vertices: Set<Vertex>, incoming: Edges, `
##### `         outgoing: Edges, interface: Interface) → Graph`

Given a set of vertices, a map from vertex to incoming edges, a map from vertex to outgoing
edges, and optionally an interface for `Vertex` and `Edge` interaction, return a new `Graph`
instance representing a simplified DAG.

## License

MIT

