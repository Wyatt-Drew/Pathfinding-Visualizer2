// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.

//Note: Normally Dijkstra's algorithm would be implemented with something like a minheap 
//for efficiency.  Here I have implemented it with an array which I sort each time because
//we have a relatively small number of nodes.

export function runSearchAlgorithm(grid, startNode, finishNode, method) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);
    switch (method){
      case 'dijkstra':
        return dijkstraSearch(grid, startNode, finishNode, visitedNodesInOrder, unvisitedNodes);
        break;
      case 'depthFirstSearch':
        //Depth first search priority: up, right, down, left
        depthFirstSearch(startNode, finishNode, grid, visitedNodesInOrder);
        return visitedNodesInOrder;
        break;
    }
  }

function dijkstraSearch(grid, startNode, finishNode, visitedNodesInOrder, unvisitedNodes) {
  startNode.distance = 0;
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}
function depthFirstSearch(node, finishNode, grid, visitedNodesInOrder) {
  if (node === finishNode) {
    visitedNodesInOrder.push(node);
    return true;
  }

  node.isVisited = true;
  visitedNodesInOrder.push(node);

  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    if (!neighbor.isVisited) {
      if (depthFirstSearch(neighbor, finishNode, grid, visitedNodesInOrder)) {
        return true;
      }
    }
  }

  return false;
}


//Returns the unvisted node with the lowest depth + weight
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => (nodeA.distance + nodeA.isWeight) - (nodeB.distance + nodeB.isWeight));
}
//Returns the unvisted node with the highest depth
function sortNodesByDepth(unvisitedNodes, currentNode) {
  //getUnvisitedNeighbors(currentNode, grid);
  //unvisitedNodes.sort((nodeA, nodeB) => (nodeB.distance) - (nodeA.distance));
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1 + neighbor.isWeight;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  // If we encounter a wall, we skip it.
  if (row > 0 && !grid[row - 1][col].isWall) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1 && !grid[row + 1][col].isWall) neighbors.push(grid[row + 1][col]);
  if (col > 0 && !grid[row][col - 1].isWall) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1 && !grid[row][col + 1].isWall) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the search method above has found the finishnode.
export function getNodesInShortestPathOrder(finishNode, grid) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  let north = 1;
  let east = 2;
  let south = 3;
  let west = 4;
  while (currentNode !== null) {
    if (currentNode.previousNode !== null)
    {
      //Record which direction it is moving
      if (currentNode.row < currentNode.previousNode.row) currentNode.direction = north;
      if (currentNode.row > currentNode.previousNode.row) currentNode.direction = south;
      if (currentNode.col < currentNode.previousNode.col) currentNode.direction = west;
      if (currentNode.col > currentNode.previousNode.col) currentNode.direction = east;
      console.log(currentNode.direction);
    }
    
    //Shift to the next node.
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;

  }
  return nodesInShortestPathOrder;
}