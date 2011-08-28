(function() {
  $(document).ready(function() {
    window.Programme = Backbone.Model.extend({
      name: null,
      initialize: function(options) {
        return this.bind("remove", function() {
          $('#' + this.cid).remove();
          return this.destroy();
        });
      }
    });
    window.Programmes = Backbone.Collection.extend({
      model: Programme,
      url: '/programmes.json'
    });
    window.ProgrammeView = Backbone.View.extend({
      tagName: 'li',
      className: 'programme',
      initialize: function() {
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
        return this.template = _.template($('#programme-template').html());
      },
      render: function() {
        var renderedContent;
        renderedContent = this.template(this.model.toJSON());
        $(this.el).html(renderedContent);
        return this;
      }
    });
    window.CentreProgrammeView = ProgrammeView.extend({});
    window.centreProgrammes = new Programmes();
    window.CentreView = Backbone.View.extend({
      tagName: 'section',
      className: 'centreview',
      initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template($('#centre-template').html());
        return this.collection.bind('reset', this.render);
      },
      render: function() {
        var $programmes, collection;
        collection = this.collection;
        $(this.el).html(this.template({}));
        $programmes = this.$('.programmes');
        collection.each(function(programme) {
          var view;
          view = new CentreProgrammeView({
            model: programme,
            collection: collection
          });
          return $programmes.append(view.render().el);
        });
        return this;
      }
    });
    window.GraphView = Backbone.View.extend({
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
        var programmeView;
        $("#programme_list").append("<li id='" + model.cid + "'>" + (model.get('name')) + " <a href='#' class='delete_programme'>delete</a></li>");
        programmeView = new window.ProgrammeView({
          model: model
        });
        $('#container').append(programmeView.render().el);
        this.data.nodes.push(model);
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
    window.BackboneComviz = Backbone.Router.extend({
      routes: {
        '': 'home',
        'blank': 'blank'
      },
      initialize: function() {
        return this.centreView = new CentreView({
          collection: window.centreProgrammes
        });
      },
      home: function() {
        var $container;
        $container = $('#container');
        $container.empty();
        return $container.append(this.centreView.render().el);
      },
      blank: function() {
        var $container;
        $container = $('#container');
        $container.empty();
        return $container.append('blanked');
      }
    });
    $(function() {
      window.App = new window.BackboneComviz();
      return Backbone.history.start();
    });
    return window.graphView = new window.GraphView;
  });
}).call(this);
