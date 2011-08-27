(function() {
  $(document).ready(function() {
    var AppView, Programme, Programmes;
    Programme = Backbone.Model.extend({
      name: null,
      initialize: function(options) {
        return this.bind("remove", function() {
          $('#' + this.cid).remove();
          return this.destroy();
        });
      }
    });
    Programmes = Backbone.Collection.extend({
      initialize: function(models, options) {}
    });
    AppView = Backbone.View.extend({
      el: $("body"),
      initialize: function() {
        this.programmes = new Programmes(null, {
          view: this
        });
        this.graph = {};
        this.graph.w = 960;
        this.graph.h = 500;
        this.graph.fill = d3.scale.category20();
        this.vis = d3.select("#chart").append("svg:svg").attr("width", this.graph.w).attr("height", this.graph.h);
        this.data = {
          nodes: [],
          links: []
        };
        return this.redrawGraph();
      },
      events: {
        "click #add_programme": "programmeNamePrompt",
        "click a.delete_programme": "deleteProgramme"
      },
      programmeNamePrompt: function() {
        var programme_model, programme_name;
        programme_name = prompt("Programme name?");
        programme_model = new Programme({
          name: programme_name
        });
        this.programmes.add(programme_model);
        return this.addProgramme(programme_model);
      },
      deleteProgramme: function(e) {
        var f, li;
        li = $(e.currentTarget).parent('li');
        f = this.programmes.getByCid(li.attr('id'));
        this.programmes.remove(f);
        this.data.nodes = this.data.nodes.filter(function(node) {
          return node.id !== f.cid;
        });
        return this.redrawGraph();
      },
      addProgramme: function(model) {
        $("#programme_list").append("<li id='" + model.cid + "'>" + (model.get('name')) + " <a href='#' class='delete_programme'>delete</a></li>");
        this.data.nodes.push({
          name: model.get('name'),
          id: model.cid
        });
        return this.redrawGraph();
      },
      redrawGraph: function() {
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
        node = this.vis.selectAll("g.node").data(this.data.nodes, function(d) {
          return d.id;
        }).enter().append("svg:g").attr("class", "node").call(force.drag);
        node.append("svg:circle").attr("r", 5).style("fill", "#234B6F").attr("class", "circle").attr("x", "-8px").attr("y", "-8px").attr("width", "16px").attr("height", "16px");
        node.append("svg:text").attr("class", "node_text").attr("dx", 12).attr("dy", ".35em").text(function(d) {
          return d.name;
        });
        this.vis.selectAll("g.node").data(this.data.nodes, function(d) {
          return d.id;
        }).exit().remove();
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
          return node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
        });
      }
    });
    return window.appview = new AppView;
  });
}).call(this);
