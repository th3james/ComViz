
#Draw the graph
initGraph = () ->
  w = 960
  h = 500
  fill = d3.scale.category20()
 
  vis = d3.select("#chart")
    .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
  
  d3.json("javascripts/miserables.json", (json) ->
    force = d3.layout.force()
      .charge(-120)
      .linkDistance(30)
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
      .start()
 
    link = vis.selectAll("line.link")
      .data(json.links)
      .enter().append("svg:line")
      .attr("class", "link")
      .style("stroke-width", (d) -> return Math.sqrt(d.value) )
      .attr("x1", (d) ->  return d.source.x)
      .attr("y1", (d) ->  return d.source.y)
      .attr("x2", (d) ->  return d.target.x)
      .attr("y2", (d) ->  return d.target.y)
  
    node = vis.selectAll("circle.node")
      .data(json.nodes)
      .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", (d) ->  return d.x)
      .attr("cy", (d) ->  return d.y)
      .attr("r", 5)
      .style("fill", (d) -> return fill(d.group))
      .call(force.drag)
  
    node.append("svg:title")
      .text((d) ->  return d.name)
  
    vis.style("opacity", 1e-6)
      .transition()
      .duration(1000)
      .style("opacity", 1)
  
    force.on("tick", () ->
      link.attr("x1", (d) ->  return d.source.x)
      .attr("y1", (d) ->  return d.source.y)
      .attr("x2", (d) ->  return d.target.x)
      .attr("y2", (d) ->  return d.target.y)
 
      node.attr("cx", (d) ->  return d.x)
      .attr("cy", (d) ->  return d.y)
    )
  )
  

$(document).ready(() ->
  #Programme model
  Programme = Backbone.Model.extend({
    name: null,
    initialize:(options) ->
      #Bind the remove event to the destroy and delete the html element
      @bind("remove", () ->
        $('#'+this.cid).remove()
        @destroy()
      )
  })

  #Programmes collection
  Programmes = Backbone.Collection.extend({
    initialize: (models, options) -> 
      this.bind("add", options.view.addProgrammeLi)
  })

  #Application view
  AppView = Backbone.View.extend({
    el: $("body"),
    initialize: () ->
      #Create a programme collection when the view is initialized, with a reference to this
      @programmes = new Programmes( null, { view: this })
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
    ,
    deleteProgramme: (e) ->
      li = $(e.currentTarget).parent('li')
      f = @programmes.getByCid(li.attr('id'))
      this.programmes.remove(f)
    ,
    addProgrammeLi: (model) ->
      #The parameter passed is a reference to the model that was added
      $("#programme_list").append("<li id='#{model.cid}'>#{model.get('name')} <a href='#' class='delete_programme'>delete</a></li>")
      #Use .get to receive attributes of the model
  })

  appview = new AppView

  initGraph()
)

