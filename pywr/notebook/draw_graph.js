var graph = {{ graph }};

var div = d3.selectAll(element).append("div");

var width = 500,
    height = 400;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(25)
    .size([width, height]);

var svg = div.append("svg")
    .attr("width", width)
    .attr("height", height);

force
  .nodes(graph.nodes)
  .links(graph.links)
  .start();

// define end-arrow svg marker
svg.append("svg:defs").append("svg:marker")
  .attr("id", "end-arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 6)
  .attr("markerWidth", 3.5)
  .attr("markerHeight", 3.5)
  .attr("orient", "auto")
.append("svg:path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "#333");

var link = svg.selectAll(".link")
  .data(graph.links)
.enter().append("svg:path")
  .attr("class", "link")
  .style("fill", "none")
  .style("stroke", "#333")
  .style("stroke-width", 2)
  .style("marker-end", function(d) { return "url(#end-arrow)"; });

var node_size = 5;

var node = svg.selectAll(".node")
  .data(graph.nodes)
.enter().append("circle")
  .attr("class", "node")
  .attr("r", node_size)
  .style("fill", function(d) { return d.color; })
  .style("stroke", "#333")
  .style("stoke-width", 0.5)
  .call(force.drag);

node.append("title")
  .text(function(d) { return d.name; });

function tick() {
    link.attr("d", function(d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = node_size,
            targetPadding = node_size + 3,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);
        return "M" + sourceX + "," + sourceY + "L" + targetX + "," + targetY;
    });

    node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
}
force.on("tick", tick);