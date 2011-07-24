(function() {
  var redraw;
  this.initGraph = function() {
    this.graph = {};
    this.graph.w = 960;
    this.graph.h = 500;
    this.graph.fill = d3.scale.category20();
    this.vis = d3.select("#chart").append("svg:svg").attr("width", this.graph.w).attr("height", this.graph.h);
    this.data = {
      nodes: [],
      links: []
    };
    return redraw();
  };
  redraw = function() {
    var force, graph, link, node;
    graph = this.graph;
    force = d3.layout.force().charge(-120).linkDistance(30).nodes(this.data.nodes).links(this.data.links).size([this.graph.w, this.graph.h]).start();
    link = this.vis.selectAll("line.link").data(this.data.links).enter().append("svg:line").attr("class", "link").style("stroke-width", function(d) {
      return Math.sqrt(d.value);
    }).attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
    node = this.vis.selectAll("circle.node").data(this.data.nodes).enter().append("svg:circle").attr("class", "node").attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("r", 5).style("fill", function(d) {
      return graph.fill(d.group);
    }).call(force.drag);
    this.vis.selectAll("circle.node").data(this.data.nodes).exit().remove();
    node.append("svg:title").text(function(d) {
      return d.name;
    });
    this.vis.style("opacity", 1e-6).transition().duration(1000).style("opacity", 1);
    return force.on("tick", function() {
      link.attr("x1", function(d) {
        return d.source.x;
      }).attr("y1", function(d) {
        return d.source.y;
      }).attr("x2", function(d) {
        return d.target.x;
      }).attr("y2", function(d) {
        return d.target.y;
      });
      return node.attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
    });
  };
  this.addNode = function(node) {
    this.data.nodes.push(node);
    return redraw();
  };
  this.deleteNode = function(id) {
    var full_data, node, _i, _len;
    full_data = this.data.nodes;
    this.data.nodes = [];
    for (_i = 0, _len = full_data.length; _i < _len; _i++) {
      node = full_data[_i];
      if (node.id !== id) {
        this.data.nodes.push(node);
      }
    }
    return redraw();
  };
}).call(this);
