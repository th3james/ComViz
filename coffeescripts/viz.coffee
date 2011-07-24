#Contains all the d3 drawing methods

root = exports ? @

#Initialise the graph with some data
@initGraph = () ->
  @graph = {}
  @graph.w = 960
  @graph.h = 500
  @graph.fill = d3.scale.category20()

  @vis = d3.select("#chart")
    .append("svg:svg")
      .attr("width", @graph.w)
      .attr("height", @graph.h)
  
  #initialise the @data object with misrables.json and draw the graph
  d3.json("javascripts/miserables.json", (json) ->
    @data = json

    #Draw the graph with the data in place
    redraw()
  )

#Redraw the graph
redraw = () ->
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

  node = @vis.selectAll("circle.node")
    .data(@data.nodes)
    .enter().append("svg:circle")
    .attr("class", "node")
    .attr("cx", (d) ->  return d.x)
    .attr("cy", (d) ->  return d.y)
    .attr("r", 5)
    .style("fill", (d) -> return graph.fill(d.group))
    .call(force.drag)

  node.append("svg:title")
    .text((d) ->  return d.name)

  @vis.style("opacity", 1e-6)
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
  

@addNode = (name) ->
  data.push(name)
  node = @vis.selectAll("circle.node")
    .data(json.nodes)
    .enter().append("svg:circle")
 
