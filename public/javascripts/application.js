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
        renderedContent = this.template(this.model);
        $(this.el).html(renderedContent);
        return this;
      }
    });
    window.TextProgrammeView = ProgrammeView.extend({});
    window.allProgrammes = new Programmes();
    window.PanelView = Backbone.View.extend({
      tagName: 'section',
      className: 'programme-panel',
      initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template($('#panel-template').html());
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        return this.collection.bind('remove', this.render);
      },
      render: function() {
        var $programmes, collection;
        collection = this.collection;
        $(this.el).html(this.template({}));
        $programmes = this.$('.programmes');
        collection.each(function(programme) {
          var view;
          view = new TextProgrammeView({
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
        _.bindAll(this, 'render');
        window.graph = {};
        window.graph.w = 960;
        window.graph.h = 500;
        window.graph.fill = d3.scale.category20();
        this.vis = d3.select("#chart").append("svg:svg").attr("width", window.graph.w).attr("height", window.graph.h);
        this.data = {
          nodes: [],
          links: []
        };
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        return this.collection.bind('remove', this.render);
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
        $("#programme_list").append("<li id='" + programme_model.cid + "'>" + (programme_model.get('name')) + " <a href='#' class='delete_programme'>delete</a></li>");
        return window.allProgrammes.add(programme_model);
      },
      deleteProgramme: function(e) {
        var f, li;
        li = $(e.currentTarget).parent('li');
        f = window.allProgrammes.getByCid(li.attr('id'));
        window.allProgrammes.remove(f);
        return this.render();
      },
      render: function() {
        var force, link, node;
        force = d3.layout.force().charge(-120).linkDistance(30).nodes(window.allProgrammes.models).links(this.data.links).size([window.graph.w, window.graph.h]).start();
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
        node = this.vis.selectAll("g.node").data(window.allProgrammes.models, function(d) {
          return d.cid;
        }).enter().append("svg:g").attr("class", "node").call(force.drag);
        node.append("svg:circle").attr("r", 5).style("fill", "#234B6F").attr("class", "circle").attr("x", "-8px").attr("y", "-8px").attr("width", "16px").attr("height", "16px");
        node.append("svg:text").attr("class", "node_text").attr("dx", 12).attr("dy", ".35em").text(function(d) {
          return d.get('name');
        });
        this.vis.selectAll("g.node").data(window.allProgrammes.models, function(d) {
          return d.cid;
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
        this.panelView = new PanelView({
          collection: window.allProgrammes
        });
        return this.graphView = new GraphView({
          collection: window.allProgrammes
        });
      },
      home: function() {
        var $container;
        $container = $('#container');
        $container.empty();
        return $container.append(this.panelView.render().el);
      },
      blank: function() {
        var $container;
        $container = $('#container');
        $container.empty();
        return $container.append('blanked');
      }
    });
    return $(function() {
      window.App = new window.BackboneComviz();
      return Backbone.history.start();
    });
  });
}).call(this);
