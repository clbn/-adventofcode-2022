const dijkstra = (graph, start, end) => {
  const visited = [];
  const unvisited = [start];
  const shortestDistances = { [start]: { vertex: start, cost: 0 } };

  let vertex;
  while ((vertex = unvisited.shift())) {
    // Explore unvisited neighbors
    const neighbors = graph[vertex].filter((n) => !visited.includes(n.vertex));

    // Add neighbors to the unvisited list
    unvisited.push(...neighbors.map((n) => n.vertex));

    const costToVertex = shortestDistances[vertex].cost;

    for (let { vertex: to, cost } of neighbors) {
      let currCostToNeighbor = shortestDistances[to] && shortestDistances[to].cost;
      const newCostToNeighbor = costToVertex + cost;
      if (currCostToNeighbor === undefined || newCostToNeighbor < currCostToNeighbor) {
        // Update the table
        shortestDistances[to] = { vertex, cost: newCostToNeighbor };
      }
    }

    visited.push(vertex);
  }

  return shortestDistances[end].cost;
};

module.exports = dijkstra;
