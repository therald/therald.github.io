var cy;
var edges = {};
// var obj = {
//     "source_id": lastId.toString(),
//     "source_x": 200,
//     "source_y": 250,
//     "target_id": thisId.toString(),
//     "target_x": 400,
//     "target_y": 250,
//     "obstace": obstacleIdCount,
//     "length": length
// }
var nodes = {};
// var nodeObj = {
//     "edges": [],
//     "x": 250,
//     "y": 250,
//     "obstacleId": obstacleId
// }
var obstacles = {};
// var obstacleObj = {
//     "edges": [],
//     "nodes": [],
//     "x": 250,
//     "y": 250
// }
var visibleEdges = {};
var shortestPathEdges = {};

var idCount = 1;
var edgeIdCount = 1;
var obstacleIdCount = 1;
var visibilityEdgeCount = 1;
var shortestPathEdgesCount = 1;
var visGraphCreated = false;
var deleteSelected = false;
var shortestPathSelected = false;

window.onload = function() {
    //eles.dijkstra()
    cy = cytoscape({

      container: document.getElementById('cy'), // container to render in

      elements: [ // list of graph elements to start with
        { // node a
          data: {
              id: 's'
          }
        },
        { // node b
          data: { id: 't' }
        }
      ],

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#000',
            'width': '7px',
            'height': '7px'
          }
        },
        {
          selector: ':parent',
          style: {
            'background-opacity': 0,
            'border-color': '#FFFFFF'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#000',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      },

      // initial viewport state:
      zoom: 1,
      pan: { x: 0, y: 0 },

      // interaction options:
      minZoom: 1e-50,
      maxZoom: 1e50,
      zoomingEnabled: false,
      userZoomingEnabled: false,
      panningEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      selectionType: 'single',
      touchTapThreshold: 8,
      desktopTapThreshold: 4,
      autolock: false,
      autoungrabify: false,
      autounselectify: false,

      // rendering options:
      headless: false,
      styleEnabled: true,
      hideEdgesOnViewport: false,
      hideLabelsOnViewport: false,
      textureOnViewport: false,
      motionBlur: false,
      motionBlurOpacity: 0.2,
      wheelSensitivity: 1,
      pixelRatio: 'auto'
    });

    cy.style()
        .selector(cy.getElementById('s'))
            .css({
                'content': 'data(id)',
                'background-color': 'red'
            })
        .update()
    ;
    cy.style()
        .selector(cy.getElementById('t'))
            .css({
                'content': 'data(id)',
                'background-color': 'red'
            })
        .update()
    ;

    var sourceNodePos = cy.getElementById("s")._private.position;
    var sourceNodeObj = {
        "edges": [],
        "x": sourceNodePos.x,
        "y": sourceNodePos.y,
        "obstacleId": "NONE"
    }
    nodes["s"] = sourceNodeObj;

    var targetNodePos = cy.getElementById("t")._private.position;
    var targetNodeObj = {
        "edges": [],
        "x": targetNodePos.x,
        "y": targetNodePos.y,
        "obstacleId": "NONE"
    }
    nodes["t"] = targetNodeObj;

    document.getElementById("newObstacle-btn").addEventListener("click", function() {
        var newNodes = {};
        var newEdges = {};
        var newObstacle = {};

        var n = document.getElementById("newObstacle-txtb").value;
        if (n > 1 && n <= 10) {
            var r = 40;
            var firstId = idCount;

            var obstacleId = "o" + obstacleIdCount;
            cy.add({
                group: "nodes",
                data: {
                    id: obstacleId
                },
                position: { x: 250, y: 250 }
            });

            var obstacleObj = {
                "edges": [],
                "nodes": [],
                "x": 250,
                "y": 250
            }
            obstacles[obstacleId] = obstacleObj;

            for (i = 0; i < n; i++) {
                var prevXVal;
                var prevYVal;
                var xVal = Math.round(r * Math.cos(2 * Math.PI * i / n) + 250);
                var yVal = Math.round(r * Math.sin(2 * Math.PI * i / n) + 250);
                var lastId = idCount - 1;
                var thisId = idCount;

                cy.add({
                    group: "nodes",
                    data: {
                        id: idCount.toString(),
                        parent: obstacleId
                    },
                    position: { x: xVal, y: yVal },
                });

                var nodeObj = {
                    "edges": [],
                    "x": xVal,
                    "y": yVal,
                    "obstacleId": obstacleId
                }
                nodes[idCount.toString()] = nodeObj;
                obstacles[obstacleId].nodes.push(idCount.toString());

                if (i > 0) {
                    var edgeId = "e" + edgeIdCount;

                    prevXVal = Math.round(r * Math.cos(2 * Math.PI * (i - 1) / n) + 250);
                    prevYVal = Math.round(r * Math.sin(2 * Math.PI * (i - 1) / n) + 250);

                    var length = Math.sqrt(Math.pow((xVal - prevXVal),2) + Math.pow((yVal - prevYVal),2));

                    cy.add({
                        group: "edges",
                        data: {
                            id: edgeId,
                            source: lastId.toString(),
                            target: thisId.toString(),
                            weight: length
                        }
                    });

                    var obj = {
                        "source_id": lastId.toString(),
                        "source_x": prevXVal,
                        "source_y": prevYVal,
                        "target_id": thisId.toString(),
                        "target_x": xVal,
                        "target_y": yVal,
                        "obstacle_id": ("o" + obstacleIdCount),
                        "length": length
                    }
                    edges[edgeId] = obj;
                    nodes[thisId.toString()].edges.push(edgeId);
                    nodes[lastId.toString()].edges.push(edgeId);
                    obstacles[obstacleId].edges.push(edgeId);

                    edgeIdCount++;
                }
                if (i == (n - 1) && n > 2) {
                    var edgeId = "e" + edgeIdCount;

                    var length = Math.sqrt(Math.pow((xVal - (r * Math.cos(0) + 250)),2) + Math.pow((yVal - (r * Math.sin(0) + 250)),2));

                    cy.add({
                        group: "edges",
                        data: {
                            id: edgeId,
                            source: thisId.toString(),
                            target: firstId.toString(),
                            weight: length
                        }
                    });

                    var obj = {
                        "source_id": thisId.toString(),
                        "source_x": xVal,
                        "source_y": yVal,
                        "target_id": firstId.toString(),
                        "target_x": r * Math.cos(0) + 250,
                        "target_y": r * Math.sin(0) + 250,
                        "obstacle_id": ("o" + obstacleIdCount),
                        "length": length
                    }
                    edges[edgeId] = obj;
                    nodes[thisId.toString()].edges.push(edgeId);
                    nodes[firstId.toString()].edges.push(edgeId);
                    obstacles[obstacleId].edges.push(edgeId);
                    edgeIdCount++;
                }
                idCount++;
            }

            obstacleIdCount++;
        }
    });

    document.getElementById("deleteObject-btn").addEventListener("click", function() {
        deleteSelected = !deleteSelected;

        if (deleteSelected) {
            document.getElementById("deleteObject-btn").classList.add("selected");
        }
        else {
            document.getElementById("deleteObject-btn").classList.remove("selected");
        }
    });

    document.getElementById("createVisibilityGraph-btn").addEventListener("click", function() {
        updateVisibilityGraph();
        constructConvexHulls();

        document.getElementById("stepThroughVisibilityGraph-btn").style.display = 'none';
        document.getElementById("createVisibilityGraph-btn").style.margin = "0px 0px 0px 0px";
        document.getElementById("findShortestPath-btn").style.display = 'block';
    });

    document.getElementById("stepThroughVisibilityGraph-btn").addEventListener("click", function() {
        currentStep++;

        if (currentStep == 1) {
            for (var sNode in nodes) {
                sourceIds.push(sNode);
                visibleNodesPerSource[sNode] = [];
            }
            currentSourceNode = sourceIds[currentSourceNodeIndex];

            getVisibleEdgesToStepThrough();
            drawStartingSweepLine();
            unsortedNodeArrayFromSource = populateUnsortedNodes(currentSourceNode, nodes);
            unsortedNodeMapFromSource = getAnglesOfAllNodesFromSourceNode(currentSourceNode, unsortedNodeArrayFromSource);

            var radialSortReturnFromSource = radialSort(currentSourceNode, unsortedNodeArrayFromSource, unsortedNodeMapFromSource);
            sortedNodeArrayFromSource = radialSortReturnFromSource.sortedArray;
            sortedNodeMapFromSource = radialSortReturnFromSource.sortedMap;

            currentTargetNode = sortedNodeArrayFromSource[currentTargetNodeIndex];
        }

        if ((currentStep % (idCount + 2)) == 0) {
            if (currentStep == (idCount + 2)){
                var vertexArray = visibleNodesPerSource[currentSourceNode];
                //draw visible edges from this source node
                if (vertexArray.length > 0) {
                    for (var vertex in vertexArray) {
                        var vEdgeId = "v" + visibleStepThroughEdgesCount;

                        var length = Math.sqrt((Math.pow((nodes[currentSourceNode].x - nodes[vertexArray[vertex]].x),2)) + (Math.pow((nodes[currentSourceNode].y - nodes[vertexArray[vertex]].y),2)));

                        cy.add({
                            group: "edges",
                            data: {
                                id: vEdgeId,
                                source: currentSourceNode,
                                target: vertexArray[vertex],
                                weight: length
                            },
                            style: {
                                'line-color': '#8888CC'
                            }
                        });

                        var obj = {
                            "source_id": currentSourceNode,
                            "source_x": nodes[currentSourceNode].x,
                            "source_y": nodes[currentSourceNode].y,
                            "target_id": vertexArray[vertex],
                            "target_x": nodes[vertexArray[vertex]].x,
                            "target_y": nodes[vertexArray[vertex]].y,
                            "obstacle_id": "NONE",
                            "length": length
                        }

                        visibleEdges[vEdgeId] = obj;
                        visibleStepThroughEdgesCount++;
                    }
                }
            }

            sweepStarting = true;
            currentSourceNodeIndex++;
            currentSourceNode = sourceIds[currentSourceNodeIndex];
            currentTargetNodeIndex = 0;

            removeSweepLine()
            drawStartingSweepLine();
            unsortedNodeArrayFromSource = populateUnsortedNodes(currentSourceNode, nodes);
            unsortedNodeMapFromSource = getAnglesOfAllNodesFromSourceNode(currentSourceNode, unsortedNodeArrayFromSource);

            var radialSortReturnFromSource = radialSort(currentSourceNode, unsortedNodeArrayFromSource, unsortedNodeMapFromSource);
            sortedNodeArrayFromSource = radialSortReturnFromSource.sortedArray;
            sortedNodeMapFromSource = radialSortReturnFromSource.sortedMap;

            currentTargetNode = sortedNodeArrayFromSource[currentTargetNodeIndex];
        }

        if (sweepStarting) {
            updateColoringOfNodes(currentSourceNode);
            sweepStarting = false;
            nodesSeenFromCurrentSource = [];
        }
        else if ((currentStep % (idCount + 2)) < (idCount + 2) && currentSourceNode != currentTargetNode) {
            updateColoringOfNodes(currentSourceNode);
            updateColoringOfVisibleNode(sortedNodeArrayFromSource[currentTargetNodeIndex - 1]);
            updateColoringOfTargetNode(currentTargetNode);

            removeSweepLine();

            if (currentTargetNodeIndex == sortedNodeArrayFromSource.length) {
                if (currentSourceNode == "t") {
                    visGraphCreated = true;
                    updateVisibilityGraph();
                    constructConvexHulls();
                    document.getElementById("stepThroughVisibilityGraph-btn").style.display = 'none';
                    document.getElementById("createVisibilityGraph-btn").style.margin = "0px 0px 0px 0px";
                    document.getElementById("findShortestPath-btn").style.display = 'block';
                }
                else {
                    var vertexArray = visibleNodesPerSource[currentSourceNode];
                    //draw visible edges from this source node
                    if (vertexArray.length > 0) {
                        for (var vertex in vertexArray) {
                            var vEdgeId = "v" + visibleStepThroughEdgesCount;

                            var length = Math.sqrt((Math.pow((nodes[currentSourceNode].x - nodes[vertexArray[vertex]].x),2)) + (Math.pow((nodes[currentSourceNode].y - nodes[vertexArray[vertex]].y),2)));

                            cy.add({
                                group: "edges",
                                data: {
                                    id: vEdgeId,
                                    source: currentSourceNode,
                                    target: vertexArray[vertex],
                                    weight: length
                                },
                                style: {
                                    'line-color': '#8888CC'
                                }
                            });

                            var obj = {
                                "source_id": currentSourceNode,
                                "source_x": nodes[currentSourceNode].x,
                                "source_y": nodes[currentSourceNode].y,
                                "target_id": vertexArray[vertex],
                                "target_x": nodes[vertexArray[vertex]].x,
                                "target_y": nodes[vertexArray[vertex]].y,
                                "obstacle_id": "NONE",
                                "length": length
                            }

                            visibleEdges[vEdgeId] = obj;
                            visibleStepThroughEdgesCount++;
                        }
                    }
                }
            }
            else {
                drawSweepLine();
            }

            currentTargetNodeIndex++;
            currentTargetNode = sortedNodeArrayFromSource[currentTargetNodeIndex];
        }
    });

    document.getElementById("clearVisibilityGraph-btn").addEventListener("click", function() {
        if (!!cy.getElementById("sweep_target")) {
            cy.remove(cy.getElementById("sweep_target"));
        }
        if (!!cy.getElementById("sweep_line")) {
            cy.remove(cy.getElementById("sweep_line"));
        }

        document.getElementById("findShortestPath-btn").classList.remove("selected");
        for (var pathEdge in shortestPathEdges) {
            cy.remove(cy.getElementById(pathEdge));
        }
        shortestPathEdges = {};
        shortestPathEdgesCount = 1;
        shortestPathSelected = false;

        for (var visibleEdge in visibleEdges) {
            cy.remove(cy.getElementById(visibleEdge));
        }
        visibilityEdgeCount = 1;
        visGraphCreated = false;

        updateToDefaultColoring();

        currentStep = 0;
        sourceIds = [];
        currentSourceNodeIndex = 0;
        currentSourceNode;
        currentTargetNodeIndex = 0;
        currentTargetNode = "";
        sweepStarting = true;
        visibleStepThroughEdgesCount = 1;
        visibleNodesPerSource = {};
        nodesSeenFromCurrentSource = [];
        unsortedNodeArrayFromSource = [];
        unsortedNodeMapFromSource = {};
        sortedNodeArrayFromSource = [];
        sortedNodeMapFromSource = {};
        convexHull = [];
        convexHullWithoutDuplicates = [];

        document.getElementById("stepThroughVisibilityGraph-btn").style.display = 'block';
        document.getElementById("createVisibilityGraph-btn").style.margin = "15px 0px 0px 0px";
        document.getElementById("findShortestPath-btn").style.display = 'none';
    });

    document.getElementById("findShortestPath-btn").addEventListener("click", function() {
        shortestPathSelected = !shortestPathSelected;

        if (shortestPathSelected) {
            document.getElementById("findShortestPath-btn").classList.add("selected");
            shortestPath();
        }
        else {
            document.getElementById("findShortestPath-btn").classList.remove("selected");
            for (var pathEdge in shortestPathEdges) {
                cy.remove(cy.getElementById(pathEdge));
            }
            shortestPathEdges = {};
            shortestPathEdgesCount = 1;
            updateToDefaultColoring()
        }
    });

    // document.getElementById("exportToPng-btn").addEventListener("click", function() {
    //     var pngData = cy.png();
    //     var data = encodeURI(pngData);
    //     var link;
    //     var fileName = "cytoscape_export.png";
    //
    //     link = document.createElement('a');
    //     link.setAttribute('href', data);
    //     link.setAttribute('download', fileName);
    //
    //     cy.style()
    //         .selector('node')
    //             .css({
    //                 'background-color': '#CCCCCC'
    //             })
    //         .update()
    //     ;
    //     cy.style()
    //         .selector('edge')
    //             .css({
    //                 'line-color': '#CCCCCC'
    //             })
    //         .update()
    //     ;
    //
    //     link.click();
    //
    //     if (visGraphCreated == false && currentStep > 0) {
    //         updateColoringOfNodes(cy, currentSourceNode);
    //         updateColoringOfVisibleNode(cy, sortedNodeArrayFromSource[currentTargetNodeIndex - 1]);
    //         updateColoringOfTargetNode(cy, currentTargetNode);
    //
    //         if (!!cy.getElementById("sweep_line")) {
    //             cy.style()
    //                 .selector(cy.getElementById("sweep_line"))
    //                     .css({
    //                         'line-color': '#0000FF'
    //                     })
    //                 .update()
    //             ;
    //         }
    //     }
    // });

    cy.on("select", "node", function(event) {
        if (deleteSelected) {
            var elementToDeleteId = event.target._private.data.id;
            var isNumeric = parseInt(elementToDeleteId);
            if (isNaN(isNumeric)) {
                if (elementToDeleteId != "s" && elementToDeleteId != "t") {
                    var obstacle = obstacles[elementToDeleteId];
                    var nodesToDelete = obstacle.nodes;
                    var edgesToDelete = obstacle.edges;

                    for (var edge in edgesToDelete) {
                        cy.remove(cy.getElementById(edgesToDelete[edge]));
                        delete edges[edgesToDelete[edge]];
                    }

                    for (var node in nodesToDelete) {
                        cy.remove(cy.getElementById(nodesToDelete[node]));
                        delete nodes[nodesToDelete[node]];
                    }

                    cy.remove(cy.getElementById(elementToDeleteId));
                    delete obstacles[elementToDeleteId];
                }
            }
        }
        if (visGraphCreated) {
            updateVisibilityGraph();
            constructConvexHulls();
            if (shortestPathSelected) {
                shortestPath();
            }
        }
    });

    cy.on("drag", "node", function(event) {
        var elementMovedId = event.target._private.data.id;
        var elementMovedPosition = event.target._private.position;
        var obj = {};

        if (isNaN(elementMovedId.charAt(0))) {
            if (elementMovedId.charAt(0) == 'o') {
                var obj = obstacles[elementMovedId];
                obstacles[elementMovedId].x = elementMovedPosition.x;
                obstacles[elementMovedId].y = elementMovedPosition.y;
            }
            else if (elementMovedId.length == 1 && elementMovedId == "s") {
                nodes[elementMovedId].x = elementMovedPosition.x;
                nodes[elementMovedId].y = elementMovedPosition.y;
            }
            else if (elementMovedId.length == 1 && elementMovedId == "t") {
                nodes[elementMovedId].x = elementMovedPosition.x;
                nodes[elementMovedId].y = elementMovedPosition.y;
            }
        }
        else {
            obj = nodes[elementMovedId];
            var nodeEdges = obj.edges;

            nodes[elementMovedId].x = elementMovedPosition.x;
            nodes[elementMovedId].y = elementMovedPosition.y;

            for (var i = 0; i < nodeEdges.length; ++i) {
                var edge = edges[nodeEdges[i]];

                if (elementMovedId == edge.source_id) {
                    edges[nodeEdges[i]].source_x = elementMovedPosition.x;
                    edges[nodeEdges[i]].source_y = elementMovedPosition.y;
                }
                else if (elementMovedId == edge.target_id) {
                    edges[nodeEdges[i]].target_x = elementMovedPosition.x;
                    edges[nodeEdges[i]].target_y = elementMovedPosition.y;
                }

                var xVal1 = edges[nodeEdges[i]].source_x;
                var xVal2 = edges[nodeEdges[i]].target_x;
                var yVal1 = edges[nodeEdges[i]].source_y;
                var yVal2 = edges[nodeEdges[i]].target_y;
                var length = Math.sqrt(Math.pow((xVal1 - xVal2),2) + Math.pow((yVal1 - yVal2),2));

                cy.edges(cy.getElementById(nodeEdges[i]))[0]._private.data.weight = length;

                edges[nodeEdges[i]].length = length;
            }

            var parentObstacleId = cy.getElementById(elementMovedId).parent()._private.data.id;
            var parentObstacleObj = cy.getElementById(parentObstacleId);
            var parentObstaclePos = parentObstacleObj._private.position;

            obstacles[parentObstacleId].x = parentObstaclePos.x;
            obstacles[parentObstacleId].y = parentObstaclePos.y;
        }

        if (visGraphCreated) {
            for (var visibleEdge in visibleEdges) {
                if (elementMovedId == visibleEdges[visibleEdge].source_id) {
                    visibleEdges[visibleEdge].source_x = elementMovedPosition.x;
                    visibleEdges[visibleEdge].source_y = elementMovedPosition.y;
                }
                else if (elementMovedId == visibleEdges[visibleEdge].target_id) {
                    visibleEdges[visibleEdge].target_x = elementMovedPosition.x;
                    visibleEdges[visibleEdge].target_y = elementMovedPosition.y;
                }

                var xVal1 = visibleEdges[visibleEdge].source_x;
                var xVal2 = visibleEdges[visibleEdge].target_x;
                var yVal1 = visibleEdges[visibleEdge].source_y;
                var yVal2 = visibleEdges[visibleEdge].target_y;
                var length = Math.sqrt(Math.pow((xVal1 - xVal2),2) + Math.pow((yVal1 - yVal2),2));

                cy.edges(cy.getElementById(visibleEdge))[0]._private.data.weight = length;

                visibleEdges[visibleEdge].length = length;
            }
        }

        // if (visGraphCreated) {
        //     updateVisibilityGraph(cy);
        //     constructConvexHulls(cy);
        // }
    });

    cy.on("free", "node", function(event) {
        if (visGraphCreated) {
            updateVisibilityGraph();
            constructConvexHulls();
            if (shortestPathSelected) {
                shortestPath();
            }
        }
    });
};

//------------------------------------------------------------------------------------------------------------------
// STEPPING THROUGH THE ALGORITHM FUNCTIONS: ALL ME AS WELL
//------------------------------------------------------------------------------------------------------------------

var currentStep = 0;
var sourceIds = [];
var currentSourceNodeIndex = 0;
var currentSourceNode;
var currentTargetNodeIndex = 0;
var currentTargetNode = "";
var sweepStarting = true;
var visibleStepThroughEdgesCount = 1;
var visibleNodesPerSource = {};
var nodesSeenFromCurrentSource = [];
var unsortedNodeArrayFromSource = [];
var unsortedNodeMapFromSource = {};
var sortedNodeArrayFromSource = [];
var sortedNodeMapFromSource = {};

//References:
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function drawStartingSweepLine() {
    var startingNode = nodes[currentSourceNode];
    var target_x = 1000;
    var target_y = startingNode.y;

    cy.add({
        group: "nodes",
        data: {
            id: "sweep_target"
        },
        position: { x: target_x, y: target_y },
    });

    cy.add({
        group: "edges",
        data: {
            id: "sweep_line",
            source: currentSourceNode,
            target: "sweep_target"
        },
        style: {
            'line-color': '#0000FF'
        }
    });
}

//References:
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function drawSweepLine() {

    cy.add({
        group: "edges",
        data: {
            id: "sweep_line",
            source: currentSourceNode,
            target: currentTargetNode
        },
        style: {
            'line-color': '#0000FF'
        }
    });
}

//References:
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function removeSweepLine() {
    var targetShouldBeRemoved = !!cy.getElementById("sweep_target");
    cy.remove(cy.getElementById("sweep_line"));

    if (targetShouldBeRemoved) {
        cy.remove(cy.getElementById("sweep_target"));
    }
}

//References:
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
//  - document.getElementById("clearVisibilityGraph-btn") event listener
//  - updateVisibilityGraph
function updateToDefaultColoring() {
    cy.style()
        .selector('node')
            .css({
                'background-color': '#000000'
            })
        .update()
    ;
    cy.style()
        .selector('edge')
            .css({
                'line-color': '#000000'
            })
        .update()
    ;
    cy.style()
        .selector(cy.getElementById("s"))
            .css({
                'background-color': 'red'
            })
        .update()
    ;
    cy.style()
        .selector(cy.getElementById("t"))
            .css({
                'background-color': 'red'
            })
        .update()
    ;
}

//References:
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function updateColoringOfNodes(sourceNodeId) {
    cy.style()
        .selector('node')
            .css({
                'background-color': '#BBBBBB'
            })
        .update()
    ;
    cy.style()
        .selector('edge')
            .css({
                'line-color': '#BBBBBB'
            })
        .update()
    ;
    cy.style()
        .selector(cy.getElementById(sourceNodeId))
            .css({
                'background-color': 'red'
            })
        .update()
    ;
}

//References:
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function updateColoringOfTargetNode(targetNodeId) {
    cy.style()
        .selector(cy.getElementById(targetNodeId))
            .css({
                'background-color': 'blue'
            })
        .update()
    ;
}

//References:
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function updateColoringOfVisibleNode(targetNodeId) {
    var targetNodeArray = visibleNodesPerSource[currentSourceNode];
    for (var targetNode in targetNodeArray) {
        if (targetNodeArray[targetNode] == targetNodeId) {
            nodesSeenFromCurrentSource.push(targetNodeId);
        }
    }
    for (var visibleNode in nodesSeenFromCurrentSource) {
        cy.style()
            .selector(cy.getElementById(nodesSeenFromCurrentSource[visibleNode]))
                .css({
                    'background-color': 'cyan'
                })
            .update()
        ;
    }
}

//References:
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function getVisibleEdgesToStepThrough() {
    for (var node in nodes) {
        var visibleVertices = [];
        visibleVertices = computeVisibleVertices(node);

        for (var visibleVertex in visibleVertices) {
            var visibleEdgeId = "v" + visibleStepThroughEdgesCount;
            var length = Math.sqrt((Math.pow((nodes[node].x - nodes[visibleVertices[visibleVertex]].x),2)) + (Math.pow((nodes[node].y - nodes[visibleVertices[visibleVertex]].y),2)));
            var obj = {
                "source_id": node,
                "source_x": nodes[node].x,
                "source_y": nodes[node].y,
                "target_id": visibleVertices[visibleVertex],
                "target_x": nodes[visibleVertices[visibleVertex]].x,
                "target_y": nodes[visibleVertices[visibleVertex]].y,
                "obstacle_id": "NONE",
                "length": length
            }
            // visibleEdgesToStepThrough[visibleEdgeId] = obj;
            //
            // visibleStepThroughEdgesCount++;

            for (var vertex in visibleVertices) {
                visibleNodesPerSource[node].push(visibleVertices[vertex]);
                visibleNodesPerSource[visibleVertices[vertex]].push(node);
            }
        }
    }

    constructConvexHullsForAdditionalVisibleEdgesToStepThrough();

    for (var visibleNode in visibleNodesPerSource) {
        var theArray = visibleNodesPerSource[visibleNode];
        theArray = theArray.sort();
        for (var i = 0; i < theArray.length; ++i) {
            if (i == 0) {
                //do nothing; the first has to exist
            }
            else {
                if (theArray[i] === theArray[i-1]) {
                    theArray.splice(i, 1);
                    i--;
                }
            }
        }
        theArray = theArray.sort(function(a,b) {
            if (parseInt(a) != NaN && parseInt(b) != NaN) {
                return parseInt(a) > parseInt(b);
            }
            return a > b;
        });
        visibleNodesPerSource[visibleNode] = theArray;
    }
}

//References:
//  - getVisibleEdgesToStepThrough
function constructConvexHullsForAdditionalVisibleEdgesToStepThrough() {
    for (var obstacle in obstacles) {
        var theObstacle = obstacles[obstacle];
        var obstacleNodes = theObstacle.nodes;
        var numberOfNodes = obstacleNodes.length;
        if (numberOfNodes > 2) {
            var nodeObjectArray = [];

            for (var node in obstacleNodes) {
                var nodeId = obstacleNodes[node];
                var nodeObj = nodes[nodeId];
                var nodeObjForArray = {
                    "id": nodeId,
                    "x": nodeObj.x,
                    "y": nodeObj.y
                };
                nodeObjectArray.push(nodeObjForArray);
            }

            getConvexHullOfObstacle(nodeObjectArray, numberOfNodes);

            for (var j = 0; j < convexHull.length; ++j) {
                if (convexHullWithoutDuplicates.includes(convexHull[j])) {
                    //don't add it
                }
                else {
                    convexHullWithoutDuplicates.push(convexHull[j]);
                }
            }

            //add appropriate visible edges
            var sortedConvexHull = convexHullWithoutDuplicates.sort(function(a,b) {
                return parseInt(a.id) - parseInt(b.id);
            })

            for (var h = 0; h < sortedConvexHull.length; ++h) {
                var theSource = sortedConvexHull[h].id;
                var theTarget = sortedConvexHull[((h+1) % sortedConvexHull.length)].id;
                if (h == sortedConvexHull.length - 1) {
                    if (Math.abs(parseInt(theSource) - parseInt(theTarget)) != (numberOfNodes - 1)) {
                        var visibleEdgeId = "v" + visibleStepThroughEdgesCount;
                        var length = Math.sqrt((Math.pow((nodes[theSource].x - nodes[theTarget].x),2)) + (Math.pow((nodes[theSource].y - nodes[theTarget].y),2)));
                        var obj = {
                            "source_id": theSource,
                            "source_x": nodes[theSource].x,
                            "source_y": nodes[theSource].y,
                            "target_id": theTarget,
                            "target_x": nodes[theTarget].x,
                            "target_y": nodes[theTarget].y,
                            "obstacle_id": "NONE",
                            "length": length
                        }
                        // visibleEdgesToStepThrough[visibleEdgeId] = obj;
                        //
                        // visibleStepThroughEdgesCount++;

                        visibleNodesPerSource[theSource].push(theTarget);
                        visibleNodesPerSource[theTarget].push(theSource);
                    }
                }
                else if (Math.abs(parseInt(theSource) - parseInt(theTarget)) > 1) {
                    var visibleEdgeId = "v" + visibilityEdgeCount;
                    var length = Math.sqrt((Math.pow((nodes[theSource].x - nodes[theTarget].x),2)) + (Math.pow((nodes[theSource].y - nodes[theTarget].y),2)));
                    var obj = {
                        "source_id": theSource,
                        "source_x": nodes[theSource].x,
                        "source_y": nodes[theSource].y,
                        "target_id": theTarget,
                        "target_x": nodes[theTarget].x,
                        "target_y": nodes[theTarget].y,
                        "obstacle_id": "NONE",
                        "length": length
                    }
                    // visibleEdgesToStepThrough[visibleEdgeId] = obj;
                    //
                    // visibilityEdgeCount++;

                    visibleNodesPerSource[theSource].push(theTarget);
                    visibleNodesPerSource[theTarget].push(theSource);
                }
            }

            convexHull = [];
            convexHullWithoutDuplicates = [];
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
// CONVEX HULL FUNCTIONS: COURTESY OF http://www.geeksforgeeks.org/quickhull-algorithm-convex-hull/
//------------------------------------------------------------------------------------------------------------------

var convexHull = [];
var convexHullWithoutDuplicates = [];

//References:
//  - document.getElementById("createConvexHull-btn") event listener
//  - document.getElementById("createVisibilityGraph-btn") event listener
//  - document.getElementById("stepThroughVisibilityGraph-btn")
//  - cy.on(free)
//  - cy.on(select)
function constructConvexHulls() {
    for (var obstacle in obstacles) {
        var theObstacle = obstacles[obstacle];
        var obstacleNodes = theObstacle.nodes;
        var numberOfNodes = obstacleNodes.length;
        if (numberOfNodes > 2) {
            var nodeObjectArray = [];

            for (var node in obstacleNodes) {
                var nodeId = obstacleNodes[node];
                var nodeObj = nodes[nodeId];
                var nodeObjForArray = {
                    "id": nodeId,
                    "x": nodeObj.x,
                    "y": nodeObj.y
                };
                nodeObjectArray.push(nodeObjForArray);
            }

            getConvexHullOfObstacle(nodeObjectArray, numberOfNodes);

            for (var j = 0; j < convexHull.length; ++j) {
                if (convexHullWithoutDuplicates.includes(convexHull[j])) {
                    //don't add it
                }
                else {
                    convexHullWithoutDuplicates.push(convexHull[j]);
                }
            }

            //add appropriate visible edges
            var sortedConvexHull = convexHullWithoutDuplicates.sort(function(a,b) {
                return parseInt(a.id) - parseInt(b.id);
            })

            for (var h = 0; h < sortedConvexHull.length; ++h) {
                var theSource = sortedConvexHull[h].id;
                var theTarget = sortedConvexHull[((h+1) % sortedConvexHull.length)].id;
                if (h == sortedConvexHull.length - 1) {
                    if (Math.abs(parseInt(theSource) - parseInt(theTarget)) != (numberOfNodes - 1)) {
                        var visibleEdgeId = "v" + visibilityEdgeCount;

                        var length = Math.sqrt((Math.pow((nodes[theSource].x - nodes[theTarget].x),2)) + (Math.pow((nodes[theSource].y - nodes[theTarget].y),2)));

                        cy.add({
                            group: "edges",
                            data: {
                                id: visibleEdgeId,
                                source: theSource,
                                target: theTarget,
                                weight: length
                            },
                            style: {
                                'line-color': '#8888CC'
                            }
                        });

                        var obj = {
                            "source_id": theSource,
                            "source_x": nodes[theSource].x,
                            "source_y": nodes[theSource].y,
                            "target_id": theTarget,
                            "target_x": nodes[theTarget].x,
                            "target_y": nodes[theTarget].y,
                            "obstacle_id": "NONE",
                            "length": length
                        }
                        visibleEdges[visibleEdgeId] = obj;

                        visibilityEdgeCount++;
                    }
                }
                else if (Math.abs(parseInt(theSource) - parseInt(theTarget)) > 1) {
                    var visibleEdgeId = "v" + visibilityEdgeCount;

                    var length = Math.sqrt((Math.pow((nodes[theSource].x - nodes[theTarget].x),2)) + (Math.pow((nodes[theSource].y - nodes[theTarget].y),2)));

                    cy.add({
                        group: "edges",
                        data: {
                            id: visibleEdgeId,
                            source: theSource,
                            target: theTarget,
                            weight: length
                        },
                        style: {
                            'line-color': '#8888CC'
                        }
                    });

                    var obj = {
                        "source_id": theSource,
                        "source_x": nodes[theSource].x,
                        "source_y": nodes[theSource].y,
                        "target_id": theTarget,
                        "target_x": nodes[theTarget].x,
                        "target_y": nodes[theTarget].y,
                        "obstacle_id": "NONE",
                        "length": length
                    }
                    visibleEdges[visibleEdgeId] = obj;

                    visibilityEdgeCount++;
                }
            }

            convexHull = [];
            convexHullWithoutDuplicates = [];
        }
    }
}

//References:
//  - constructConvexHulls
//  - constructConvexHullsForAdditionalVisibleEdgesToStepThrough
function getConvexHullOfObstacle(nodeArray, numberOfNodes) {
    var minXIndex = 0;
    var maxXIndex = 0;
    for (var i = 1; i < numberOfNodes; ++i) {
        if (nodeArray[i].x < nodeArray[minXIndex].x) {
            minXIndex = i;
        }
        if (nodeArray[i].x > nodeArray[maxXIndex].x) {
            maxXIndex = i;
        }
    }

    quickHull(nodeArray, numberOfNodes, nodeArray[minXIndex], nodeArray[maxXIndex], 1);
    quickHull(nodeArray, numberOfNodes, nodeArray[minXIndex], nodeArray[maxXIndex], -1);
}

//References:
//  - getConvexHullOfObstacle
function quickHull(nodeArray, n, min, max, side) {
    var index = -1;
    var maxDistance = 0;

    for (var i = 0; i < n; ++i) {
        var temp = computeDistanceFromLineToPoint(min, max, nodeArray[i]);
        if (findSide(min, max, nodeArray[i]) == side && temp > maxDistance) {
            index = i;
            maxDistance = temp;
        }
    }

    if (index == -1) {
        convexHull.push(min);
        convexHull.push(max);
        return;
    }

    quickHull(nodeArray, n, nodeArray[index], min, -findSide(nodeArray[index], min, max));
    quickHull(nodeArray, n, nodeArray[index], max, -findSide(nodeArray[index], max, min));
}

//References:
//  - quickHull
function findSide(min, max, point) {
    var side = ((point.y - min.y) * (max.x - min.x)) - ((max.y - min.y) * (point.x - min.x));

    if (side > 0) {
        return 1;
    }
    if (side < 0) {
        return -1;
    }
    return 0;
}

//References:
//  - quickHull
function computeDistanceFromLineToPoint(minXNode, maxXNode, point) {
    return Math.abs(((point.y - minXNode.y) * (maxXNode.x - minXNode.x)) - ((maxXNode.y - minXNode.y) * (point.x - minXNode.x)));
}

//------------------------------------------------------------------------------------------------------------------
//THE BELOW IS 100% MY WORK, WITH THE EXCEPTION OF SOME DEBUGGING FIXES WITH THE HELP OF RUDY ZHOU AND CODY MERIDITH
//------------------------------------------------------------------------------------------------------------------

function shortestPath() {
    for (var pathEdge in shortestPathEdges) {
        cy.remove(cy.getElementById(pathEdge));
    }
    shortestPathEdges = {};
    shortestPathEdgesCount = 1;

    var dijkstra = cy.elements().dijkstra(cy.getElementById('s'), function(edge){
        var weight = edge.data('weight');
        return weight;
    });

    var path = dijkstra.pathTo(cy.getElementById('t'));

    for (var element = 0; element < path.length; ++element) {
        if (element % 2 == 0) {
            var node = path[element]._private.data.id;
            cy.style()
                .selector(cy.getElementById(node))
                    .css({
                        'background-color': '#FF0000'
                    })
                .update()
            ;
        }
        else {
            var edge = path[element]._private.data.id;
            var edgeWeight = path[element]._private.data.weight;
            var edgeDetail;
            if (edge.charAt(0) == 'e') {
                edgeDetail = edges[edge];
            }
            else {
                edgeDetail = visibleEdges[edge];
            }

            var shortestPathEdgeId = "p" + shortestPathEdgesCount;

            cy.add({
                group: "edges",
                data: {
                    id: shortestPathEdgeId,
                    source: edgeDetail.source_id,
                    target: edgeDetail.target_id,
                    weight: edgeWeight
                },
                style: {
                    'line-color': 'red'
                }
            });

            var obj = {
                "source_id": edgeDetail.source_id,
                "source_x": edgeDetail.source_x,
                "source_y": edgeDetail.source_y,
                "target_id": edgeDetail.target_id,
                "target_x": edgeDetail.target_x,
                "target_y": edgeDetail.target_y,
                "obstace": "NONE",
                "length": edgeWeight
            }

            shortestPathEdges[shortestPathEdgeId] = obj;
            shortestPathEdgesCount++;
        }
    }
}

//References:
//  - cy.on(free)
//  - cy.on(select)
//  - document.getElementById("createVisibilityGraph-btn") event listener
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function updateVisibilityGraph() {
    updateToDefaultColoring();

    if (!!cy.getElementById("sweep_target")) {
        cy.remove(cy.getElementById("sweep_target"));
    }
    if (!!cy.getElementById("sweep_line")) {
        cy.remove(cy.getElementById("sweep_line"));
    }

    if (visGraphCreated || currentStep > 0) {
        for (var vEdge in visibleEdges) {
            var visEdgeId = vEdge;
            cy.remove(cy.getElementById(visEdgeId));
            delete visibleEdges[vEdge];
        }
    }

    for (var node in nodes) {
        var visibleVertices = [];
        visibleVertices = computeVisibleVertices(node);

        for (var visibleVertex in visibleVertices) {
            var visibleEdgeId = "v" + visibilityEdgeCount;

            var length = Math.sqrt((Math.pow((nodes[node].x - nodes[visibleVertices[visibleVertex]].x),2)) + (Math.pow((nodes[node].y - nodes[visibleVertices[visibleVertex]].y),2)));

            cy.add({
                group: "edges",
                data: {
                    id: visibleEdgeId,
                    source: node,
                    target: visibleVertices[visibleVertex],
                    weight: length
                },
                style: {
                    'line-color': '#8888CC'
                }
            });

            var obj = {
                "source_id": node,
                "source_x": nodes[node].x,
                "source_y": nodes[node].y,
                "target_id": visibleVertices[visibleVertex],
                "target_x": nodes[visibleVertices[visibleVertex]].x,
                "target_y": nodes[visibleVertices[visibleVertex]].y,
                "obstacle_id": "NONE",
                "length": length
            }
            visibleEdges[visibleEdgeId] = obj;

            visibilityEdgeCount++;
        }
    }
    visGraphCreated = true;
}

//References:
//  - updateVisibilityGraph
//  - getVisibleEdgesToStepThrough
function computeVisibleVertices(node) {
    var visibleVertices = [];
    var unsortedNodes = populateUnsortedNodes(node, nodes);
    var nodeAngleMap = getAnglesOfAllNodesFromSourceNode(node, unsortedNodes);
    var radialSortReturn = radialSort(node, unsortedNodes, nodeAngleMap);

    var sortedNodes = radialSortReturn.sortedArray;
    nodeAngleMap = radialSortReturn.sortedMap;

    var intersectedEdges = computeInitialStartingEdgesIntersected(node);

    var firstNode = true;
    var previousNodeAngle;
    var thisNodeAngle;
    for (var aNode in sortedNodes) {
        thisNodeAngle = nodeAngleMap[aNode];
        if (firstNode || (previousNodeAngle != thisNodeAngle)) {
            previousNodeAngle = thisNodeAngle;
            firstNode = false;
            var connectedEdges = nodes[sortedNodes[aNode]].edges;
            var source = nodes[node];
            var target = nodes[sortedNodes[aNode]];
            var potentialSlope = ((source.y - target.y)/(source.x - target.x));

            var potentialVisibleEdge = {
                "slope": potentialSlope,
                "intercept": (source.y - (source.x * potentialSlope)),
                "source_x": source.x,
                "source_y": source.y,
                "target_x": target.x,
                "target_y": target.y
            };

            var isVisible = true;
            for (var intersectingEdge in intersectedEdges) {
                var iSlope = ((intersectedEdges[intersectingEdge].source_y - intersectedEdges[intersectingEdge].target_y)/(intersectedEdges[intersectingEdge].source_x - intersectedEdges[intersectingEdge].target_x));
                var intercept = intersectedEdges[intersectingEdge].source_y - (intersectedEdges[intersectingEdge].source_x * iSlope);

                var xVal;
                var yVal;

                if (intersectedEdges[intersectingEdge].source_x == intersectedEdges[intersectingEdge].target_x) {
                    xVal = intersectedEdges[intersectingEdge].source_x;
                    yVal = -1;
                }
                else {
                    xVal = (intercept - potentialVisibleEdge["intercept"]) / (potentialSlope - iSlope);
                    yVal = (iSlope * xVal) + intercept;
                }

                var line1 = {
                    "slope": iSlope,
                    "intercept": intercept,
                    "source_x": intersectedEdges[intersectingEdge].source_x,
                    "source_y": intersectedEdges[intersectingEdge].source_y,
                    "target_x": intersectedEdges[intersectingEdge].target_x,
                    "target_y": intersectedEdges[intersectingEdge].target_y
                }

                var intersection_x;
                var intersection_y;
                if (yVal == -1) {
                    intersection_x = xVal;
                    intersection_y = (potentialVisibleEdge.slope * intersection_x) + potentialVisibleEdge.intercept;
                }
                else {
                    intersection_x = xVal;
                    intersection_y = yVal;
                }

                var intersectionPoint = {
                    "x": intersection_x,
                    "y": intersection_y
                }

                if ((intersectionPoint.x < potentialVisibleEdge.source_x && intersectionPoint.x > potentialVisibleEdge.target_x) || (intersectionPoint.x > potentialVisibleEdge.source_x && intersectionPoint.x < potentialVisibleEdge.target_x)) {
                    if (intersectedEdges[intersectingEdge].source_id == sortedNodes[aNode] || intersectedEdges[intersectingEdge].target_id == sortedNodes[aNode]) {
                        // is visible
                    }
                    else {
                        isVisible = false;
                    }
                }
                else if (yVal == -1) {
                    if ((intersectionPoint.y < potentialVisibleEdge.source_y && intersectionPoint.y > potentialVisibleEdge.target_y) || (intersectionPoint.y > potentialVisibleEdge.source_y && intersectionPoint.y < potentialVisibleEdge.target_y)) {
                        if (intersectedEdges[intersectingEdge].source_id == sortedNodes[aNode] || intersectedEdges[intersectingEdge].target_id == sortedNodes[aNode]) {
                            // is visible
                        }
                        else {
                            isVisible = false;
                        }
                    }
                }
                else if (potentialVisibleEdge.slope == Infinity || potentialVisibleEdge.slope == -Infinity) {
                    console.log("infinite slope");
                    var yIntercept = (line1.slope * potentialVisibleEdge.source_x) + line1.intercept;
                    if ((yIntercept < potentialVisibleEdge.source_y && yIntercept > potentialVisibleEdge.target_y) || (yIntercept > potentialVisibleEdge.source_y && yIntercept < potentialVisibleEdge.target_y)) {
                        if (intersectedEdges[intersectingEdge].source_id == sortedNodes[aNode] || intersectedEdges[intersectingEdge].target_id == sortedNodes[aNode]) {
                            // is visible
                        }
                        else {
                            isVisible = false;
                        }
                    }
                }
            }

            if ((nodes[node].obstacleId != "NONE" && nodes[sortedNodes[aNode]].obstacleId != nodes[node].obstacleId) || nodes[node].obstacleId == "NONE") {
                if (isVisible) {
                    visibleVertices.push(sortedNodes[aNode]);
                }
            }

            intersectedEdges = sweepForEnteringAndExitingEdges(aNode, sortedNodes, connectedEdges, intersectedEdges, potentialVisibleEdge);
        }
    }

    return visibleVertices;
}

//References:
//  - computeVisibleVertices
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function populateUnsortedNodes(sourceNode, nodeSet) {
    var unsortedNodes = [];

    for (var aNode in nodeSet) {
        if (aNode == "s" && sourceNode != "s") {
            unsortedNodes.push(aNode);
        }
        else if (aNode == "t" && sourceNode != "t") {
            unsortedNodes.push(aNode);
        }
        else if (aNode != "s" && aNode != "t" && aNode != sourceNode) {
            unsortedNodes.push(aNode);
        }
    }

    return unsortedNodes;
}

//References:
//  - computeVisibleVertices
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function getAnglesOfAllNodesFromSourceNode(sourceNode, unsortedNodes) {
    var nodeAngleMap = {};

    for (var targetNode in unsortedNodes) {

        var xVal = nodes[unsortedNodes[targetNode]].x - nodes[sourceNode].x;
        var yVal = nodes[unsortedNodes[targetNode]].y - nodes[sourceNode].y;
        var potentialAngle = (Math.atan(yVal/xVal)) * (180 / Math.PI);

        if (potentialAngle < 0 && potentialAngle > -90) {
            if (nodes[unsortedNodes[targetNode]].x < nodes[sourceNode].x) {
                potentialAngle += 180;
            }
            else {
                potentialAngle += 360;
            }
        }
        else if (potentialAngle > 0 && potentialAngle < 90) {
            if (nodes[unsortedNodes[targetNode]].x < nodes[sourceNode].x) {
                potentialAngle += 180;
            }
        }
        else if (potentialAngle == 0) {
            if (nodes[unsortedNodes[targetNode]].x < nodes[sourceNode].x) {
                potentialAngle += 180;
            }
        }
        else if (potentialAngle == 90) {
            if (nodes[unsortedNodes[targetNode]].y > nodes[sourceNode].y) {
                //do nothing
            }
            else {
                potentialAngle += 180;
            }
        }
        else if (potentialAngle == -90) {
            if (nodes[unsortedNodes[targetNode]].y > nodes[sourceNode].y) {
                potentialAngle += 180;
            }
            else {
                potentialAngle += 360;
            }
        }
        nodeAngleMap[targetNode] = potentialAngle;
    }

    return nodeAngleMap;
}

//References:
//  - computeVisibleVertices
//  - document.getElementById("stepThroughVisibilityGraph-btn") event listener
function radialSort(node, unsortedNodes, nodeAngleMap) {
    var startingNodes = unsortedNodes;
    var startingMap = nodeAngleMap;
    var sortedNodes = [];
    var sortedNodeAngleMap = {};

    var minimum = 360;
    var minIndex = 0;
    for (var i = 0; i < unsortedNodes.length; ++i) {
        for (var aNode in nodeAngleMap) {
            if (startingMap[aNode] < minimum) {
                minimum = startingMap[aNode];
                minIndex = aNode;
            }
            else if (startingMap[aNode] == minimum) {
                var sourceNode = nodes[node];
                var target1Node = nodes[startingNodes[minIndex]];
                var target2Node = nodes[startingNodes[aNode]];
                var sourceX = sourceNode.x;
                var sourceY = sourceNode.y;
                var target1X = target1Node.x;
                var target1Y = target1Node.y;
                var target2X = target2Node.x;
                var target2Y = target2Node.y;

                var target1Distance = Math.sqrt(Math.pow((sourceX - target1X), 2) + Math.pow((sourceY - target1Y), 2));
                var target2Distance = Math.sqrt(Math.pow((sourceX - target2X), 2) + Math.pow((sourceY - target2Y), 2));

                if (target1Distance > target2Distance) {
                    minimum = startingMap[aNode];
                    minIndex = aNode;
                }
            }
        }
        sortedNodes.push(startingNodes[minIndex]);
        sortedNodeAngleMap[i] = startingMap[minIndex];

        delete startingMap[minIndex];

        minimum = 360;
        minIndex = 0;
    }

    return {
        sortedArray: sortedNodes,
        sortedMap: sortedNodeAngleMap
    };
}

//References:
//  - computeVisibleVertices
function computeInitialStartingEdgesIntersected(sourceNode) {
    var intersectedEdges = {};

    var startingEdge = {
        "m": 0,                     //slope
        "b": nodes[sourceNode].y,         //y-intercept
        "x_value": nodes[sourceNode].x    //x-value at which the ray starts
    }
    for (var edge in edges) {
        if (edges[edge].source_y != edges[edge].target_y) {
            var slope = ((edges[edge].source_y - edges[edge].target_y)/(edges[edge].source_x - edges[edge].target_x));
            var intercept = edges[edge].source_y - (edges[edge].source_x * slope);
            var xVal;
            if (edges[edge].source_x == edges[edge].target_x) {
                xVal = edges[edge].source_x;
            }
            else {
                xVal = (startingEdge["b"] - intercept) / slope;
            }

            if (xVal > startingEdge["x_value"]) {
                if ((startingEdge["b"] > edges[edge].source_y && startingEdge["b"] < edges[edge].target_y) || (startingEdge["b"] < edges[edge].source_y && startingEdge["b"] > edges[edge].target_y)) {
                    intersectedEdges[edge] = edges[edge];
                }
            }
        }
    }

    return intersectedEdges;
}

//References:
//  - computeVisibleVertices
function sweepForEnteringAndExitingEdges(targetNode, sortedNodes, connectedEdges, intersectedEdges, potentialVisibleEdge) {
    var newIntersectedEdges = intersectedEdges;

    for (var connectedEdge in connectedEdges) {
        var vector_a = {
            "x": (potentialVisibleEdge.target_x - potentialVisibleEdge.source_x),
            "y": (potentialVisibleEdge.target_y - potentialVisibleEdge.source_y),
            "z": 1
        }
        var vector_b = {
            "x": 0,
            "y": 0,
            "z": 1
        };
        if (sortedNodes[targetNode] == edges[connectedEdges[connectedEdge]].source_id) {
            vector_b.x = (edges[connectedEdges[connectedEdge]].target_x - edges[connectedEdges[connectedEdge]].source_x);
            vector_b.y = (edges[connectedEdges[connectedEdge]].target_y - edges[connectedEdges[connectedEdge]].source_y);
        }
        else {
            vector_b.x = (edges[connectedEdges[connectedEdge]].source_x - edges[connectedEdges[connectedEdge]].target_x);
            vector_b.y = (edges[connectedEdges[connectedEdge]].source_y - edges[connectedEdges[connectedEdge]].target_y);
        }

        var crossProduct = {
            "x": ((vector_a.y * vector_b.z) - (vector_b.y * vector_a.z)),
            "y": (-1 * ((vector_a.x * vector_b.z) - (vector_b.x * vector_a.z))),
            "z": ((vector_a.x * vector_b.y) - (vector_b.x * vector_a.y))
        }

        if (crossProduct.z > 0) {
            newIntersectedEdges[connectedEdges[connectedEdge]] = edges[connectedEdges[connectedEdge]];
        }
        else {
            delete newIntersectedEdges[connectedEdges[connectedEdge]];
        }
    }

    return newIntersectedEdges;
}
