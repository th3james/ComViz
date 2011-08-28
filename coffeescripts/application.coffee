$(document).ready(() ->
  #Programme model
  window.Programme = Backbone.Model.extend({
    name: null,
    initialize:(options) ->
      #Bind the remove event to the destroy and delete the html element
      @bind("remove", () ->
        $('#'+this.cid).remove()

        @destroy()
      )
  })

  #Programmes collection
  window.Programmes = Backbone.Collection.extend({
    model: Programme,
    url: '/programmes.json'
  })

  #Programme view
  window.ProgrammeView = Backbone.View.extend({
    tagName: 'li',
    className: 'programme',
    initialize: () ->
      _.bindAll(this, 'render')
      @model.bind('change', @render)

      @template = _.template($('#programme-template').html())
    ,
    render: () ->
      renderedContent = @template(this.model.toJSON())
      $(@el).html(renderedContent)
      return this
  })

  #Extended view used by the CentreView
  window.CentreProgrammeView = ProgrammeView.extend({
  })

  window.centreProgrammes = new Programmes()

  #Centre wide view of all the programmes
  window.CentreView  = Backbone.View.extend({
    tagName: 'section',
    className: 'centreview',

    initialize: () ->
      _.bindAll(this, 'render')
      @template = _.template($('#centre-template').html())
      @collection.bind('reset', @render)
    ,
    render: () ->
      collection = @collection

      $(this.el).html(@template({}))
      $programmes = this.$('.programmes')
      collection.each((programme) ->
        view = new CentreProgrammeView({
          model: programme,
          collection: collection
        })
        $programmes.append(view.render().el)
      )
      return this
  })

  #Graph view
  window.GraphView = Backbone.View.extend({
    el: $("body"),
    initialize: () ->
      #Create a programme collection when the view is initialized, with a reference to this
      @programmes = new Programmes( null, { view: this })

      #Create our graph
      @graph = {}
      @graph.w = 960
      @graph.h = 500
      @graph.fill = d3.scale.category20()

      @vis = d3.select("#chart")
        .append("svg:svg")
          .attr("width", @graph.w)
          .attr("height", @graph.h)
      
      @data = {
        nodes: [],
        links: []
      }

      @redrawGraph()
    ,
    events: {
      "click #add_programme":  "programmeNamePrompt",
      "click a.delete_programme":  "deleteProgramme"
    },
    programmeNamePrompt: () ->
      programme_name = prompt("Programme name?")
      programme_model = new Programme({ name: programme_name })
      #Add a new programme model to our programmes collection
      @programmes.add( programme_model )
      @addProgramme(programme_model)
    ,
    deleteProgramme: (e) ->
      li = $(e.currentTarget).parent('li')
      f = @programmes.getByCid(li.attr('id'))
      this.programmes.remove(f)
      @data.nodes = @data.nodes.filter( (node) ->
        node.id != f.cid
      )
      @redrawGraph()
    ,
    addProgramme: (model) ->
      #The parameter passed is a reference to the model that was added
      $("#programme_list").append("<li id='#{model.cid}'>#{model.get('name')} <a href='#' class='delete_programme'>delete</a></li>")

      #Create a programme view
      programmeView = new window.ProgrammeView({model: model})
      $('#container').append(programmeView.render().el)

      #Add the node to the graph
      @data.nodes.push(model)
      @redrawGraph()
    ,
    redrawGraph: () ->
      graph = @graph

      force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .nodes(@data.nodes)
        .links(@data.links)
        .size([@graph.w, @graph.h])
        .start()

      link = @vis.selectAll("line.link")
          .data(@data.links)
        .enter().append("svg:line")
          .attr("class", "link")
          .style("stroke-width", (d) -> return Math.sqrt(d.value) )
          .attr("x1", (d) ->  return d.source.x)
          .attr("y1", (d) ->  return d.source.y)
          .attr("x2", (d) ->  return d.target.x)
          .attr("y2", (d) ->  return d.target.y)

      #NODE DRAWING
      #first we create svg:g elements as the container
      node = @vis.selectAll("g.node")
          .data(@data.nodes, (d) -> d.id)
        .enter().append("svg:g")
          .attr("class", "node")
          .call(force.drag)
      
      #Then we fill the svg:g elements with:
      #The circle
      node.append("svg:circle")
          .attr("r", 5)
          .style("fill", "#234B6F")
          .attr("class", "circle")
          .attr("x", "-8px")
          .attr("y", "-8px")
          .attr("width", "16px")
          .attr("height", "16px")
      #The Name
      node.append("svg:text")
          .attr("class", "node_text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .text((d) -> d.name)
      
      #Remove nodes
      @vis.selectAll("g.node").data(@data.nodes, (d) -> d.id).exit().remove()

      @vis.style("opacity", 1e-6)
        .transition()
        .duration(1000)
        .style("opacity", 1)

      force.on("tick", () ->
        link.attr("x1", (d) ->  return d.source.x)
        .attr("y1", (d) ->  return d.source.y)
        .attr("x2", (d) ->  return d.target.x)
        .attr("y2", (d) ->  return d.target.y)

        node.attr("transform", (d) -> "translate(#{d.x},#{d.y})")
      )
  })

  #Routers
  window.BackboneComviz = Backbone.Router.extend({
    routes: {
      '': 'home'
    },
    initialize: () ->
      @centreView = new CentreView({
        collection: window.centreProgrammes
      })
    ,
    home: () ->
      $container = $('#container')
      $container.empty()
      $container.append(@centreView.render().el)
  })

  $(() ->
    window.App = new window.BackboneComviz()
    Backbone.history.start({pushState: true})
  )

  window.graphView = new window.GraphView
)

