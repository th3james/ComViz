(function() {
  var AppView, Programme, Programmes, initGraph;
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
    initialize: function(models, options) {
      return this.bind("add", options.view.addProgrammeLi);
    }
  });
  AppView = Backbone.View.extend({
    el: $("body"),
    initialize: function() {
      return this.programmes = new Programmes(null, {
        view: this
      });
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
      return this.programmes.add(programme_model);
    },
    deleteProgramme: function(e) {
      var f, li;
      li = $(e.currentTarget).parent('li');
      f = this.programmes.getByCid(li.attr('id'));
      return this.programmes.remove(f);
    },
    addProgrammeLi: function(model) {
      return $("#programme_list").append("<li id='" + model.cid + "'>" + (model.get('name')) + " <a href='#' class='delete_programme'>delete</a></li>");
    }
  });
  initGraph = function() {
    var fill, h, vis, w;
    w = 960;
    h = 500;
    fill = d3.scale.category20();
    vis = d3.select("#chart").append("svg:svg").attr("width", w).attr("height", h);
    return d3.json("javascripts/miserables.json", function(json) {
      var force, link, node;
      force = d3.layout.force().charge(-120).linkDistance(30).nodes(json.nodes).links(json.links).size([w, h]).start();
      link = vis.selectAll("line.link").data(json.links).enter().append("svg:line").attr("class", "link").style("stroke-width", function(d) {
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
      node = vis.selectAll("circle.node").data(json.nodes).enter().append("svg:circle").attr("class", "node").attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      }).attr("r", 5).style("fill", function(d) {
        return fill(d.group);
      }).call(force.drag);
      node.append("svg:title").text(function(d) {
        return d.name;
      });
      vis.style("opacity", 1e-6).transition().duration(1000).style("opacity", 1);
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
    });
  };
  $(document).ready(function() {
    var appview;
    appview = new AppView;
    return initGraph();
  });
}).call(this);
