'use strict'

module.exports = contractEdges

const φ = new Set()

function contractEdges(vertices, incoming, outgoing, accessors) {
  // * find a "starting" vertex – good starting vertices have
  //   either NO incoming edges, or 2+ incoming edges
  // * walk from "starting" vertex until we find a vertex that has
  //   more than two incoming edges, or two outgoing edges
  // * if the node has >2 incoming, restart at that node
  //   otherwise find a new starting vertex
  const seenVertices = new Map()
  const newIncoming  = new Map()
  const newOutgoing  = new Map()

  accessors      = accessors || {}
  const copyEdge = accessors.copyEdge || defaultCopyEdge
  const getFrom  = accessors.getFrom || defaultGetFrom
  const getTo    = accessors.getTo || defaultGetTo

  const groups = new Set()

  do {
    let targetVertex = null
    for (let vertex of vertices) {
      if (seenVertices.has(vertex)) {
        continue
      }
      let incomingEdges = incoming.get(vertex) || φ

      // break if we have more than one incoming edge, or no incoming edges
      // or if we're the direct child of a vertex that has >1 outgoing edges
      if (
        incomingEdges.size !== 1 ||
        (outgoing.get(getFrom(head(incomingEdges))) || φ).size > 1
      ) {
        targetVertex = vertex
        break
      }
    }

    if (!targetVertex) {
      break
    }

    // collect the set of vertices
    let group = []
    let lastOutgoing = null
    do {
      lastOutgoing = outgoing.get(targetVertex) || φ
      group.push(targetVertex)
      seenVertices.set(targetVertex, group)
      if (lastOutgoing.size === 0) {
        break
      }
      let edge = head(lastOutgoing)
      targetVertex = getTo(edge)
      if ((outgoing.get(targetVertex) || φ).size !== 1) {
        group.push(targetVertex)
        seenVertices.set(targetVertex, group)
        break
      }
    } while(
      (incoming.get(targetVertex) || φ).size === 1
    )
    groups.add(group)
  } while (true)

  for (let group of groups) {
    let incomingEdges = incoming.get(group[0]) || φ
    let outgoingEdges = outgoing.get(group[group.length - 1]) || φ

    let newIncomingEdges = new Set()
    let newOutgoingEdges = new Set()
    for (let edge of incomingEdges) {
      newIncomingEdges.add(
        copyEdge(edge, seenVertices.get(getFrom(edge)), group)
      )
    }
    if (newIncomingEdges.size) {
      newIncoming.set(group, newIncomingEdges)
    }

    for (let edge of outgoingEdges) {
      newOutgoingEdges.add(
        copyEdge(edge, group, seenVertices.get(getTo(edge)))
      )
    }
    if (newOutgoingEdges.size) {
      newOutgoing.set(group, newOutgoingEdges)
    }
  }

  return {
    vertices: groups,
    outgoing: newOutgoing,
    incoming: newIncoming
  }
}

function head(xs) {
  for (let ii of xs) {
    return ii
  }
  return null
}

function defaultGetFrom(edge) {
  return edge[0]
}

function defaultGetTo(edge) {
  return edge[1]
}

function defaultCopyEdge(edge, from, to) {
  return [from, to]
}
