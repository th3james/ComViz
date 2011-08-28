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

  #Simple Programme view
  window.ProgrammeView = Backbone.View.extend({
    tagName: 'li',
    className: 'programme',
    initialize: () ->
      _.bindAll(this, 'render')
      @model.bind('change', @render)

      @template = _.template($('#programme-template').html())
    ,
    render: () ->
      renderedContent = @template(this.model)
      $(@el).html(renderedContent)
      return this
  })

  #Extended view used by the PanelView
  window.TextProgrammeView = ProgrammeView.extend({
  })

  window.allProgrammes = new Programmes()

  #Text panel of all programmes
  window.PanelView  = Backbone.View.extend({
    tagName: 'section',
    className: 'programme-panel',

    initialize: () ->
      _.bindAll(this, 'render')
      @template = _.template($('#panel-template').html())
      @collection.bind('reset', @render)
      @collection.bind('add', @render)
      @collection.bind('remove', @render)
    ,
    render: () ->
      collection = @collection

      $(this.el).html(@template({}))
      $programmes = this.$('.programmes')
      collection.each((programme) ->
        view = new TextProgrammeView({
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
      _.bindAll(this, 'render')

      #Create our graph
      window.graph = {}
      window.graph.w = 960
      window.graph.h = 500
      window.graph.fill = d3.scale.category20()

      @vis = d3.select("#chart")
        .append("svg:svg")
          .attr("width", window.graph.w)
          .attr("height", window.graph.h)

      @data = {
        nodes: [],
        links: []
      }

      @collection.bind('reset', @render)
      @collection.bind('add', @render)
      @collection.bind('remove', @render)
    ,
    events: {
      "click #add_programme":  "programmeNamePrompt",
      "click a.delete_programme":  "deleteProgramme"
    },
    programmeNamePrompt: () ->
      programme_name = prompt("Programme name?")
      programme_model = new Programme({ name: programme_name })
      #Add a new programme model to our programmes collection

      #Create the old programme list LI
      $("#programme_list").append("<li id='#{programme_model.cid}'>#{programme_model.get('name')} <a href='#' class='delete_programme'>delete</a></li>")

      #Add to the programme list
      window.allProgrammes.add( programme_model )
    ,
    deleteProgramme: (e) ->
      li = $(e.currentTarget).parent('li')
      f = window.allProgrammes.getByCid(li.attr('id'))
      window.allProgrammes.remove(f)

      @render()
    ,
    render: () ->
      force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .nodes(window.allProgrammes.models)
        .links(@data.links)
        .size([window.graph.w, window.graph.h])
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
          .data(window.allProgrammes.models, (d) -> d.cid)
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
          .text((d) -> d.get('name'))
      
      #Remove nodes
      @vis.selectAll("g.node").data(window.allProgrammes.models, (d) -> d.cid).exit().remove()

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
      '': 'home',
      'blank': 'blank'
    },
    initialize: () ->
      #Create the views used by all pages

      #Text panel view
      @panelView = new PanelView({
        collection: window.allProgrammes
      })

      #d3 viz view
      @graphView = new GraphView({
        collection: window.allProgrammes
      })
    ,
    home: () ->
      $container = $('#container')
      $container.empty()
      $container.append(@panelView.render().el)
    ,
    blank: () ->
      $container = $('#container')
      $container.empty()
      $container.append('blanked')
  })

  $(() ->
    window.App = new window.BackboneComviz()
    Backbone.history.start()
  )

)

