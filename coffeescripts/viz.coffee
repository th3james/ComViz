#Contains all the d3 drawing methods

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
  
  @data = {
    nodes: [],
    links: []
  }
  redraw()

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

  #NODE DRAWING
  #first we create svg:g elements as the container
  node = @vis.selectAll("g.node")
    .data(@data.nodes)
    .enter().append("svg:g")
    .attr("class", "node")
    .attr("transform", (d) -> "translate(#{d.x}, #{d.y})")
    
  #Then we fill the svg:g elements with:
  #The circle
  node.append("svg:circle")
      .attr("r", 7)
      .style("fill", "#234B6F")
      .call(force.drag)
  #The name
  node.append("svg:text")
      .style("pointer-events", "none")
      .text((d) -> d.name)
    
  #Remove nodes
  @vis.selectAll("circle.node").data(@data.nodes).exit().remove()

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
  

# Add a new node to the graph and redraw
#
# @param [Object] node a node
@addNode = (node) ->
  @data.nodes.push(node)
  redraw()

# Remove a node from the data and redraw
#
# @param [String] id id of the node to delete
@deleteNode = (id) ->
  full_data = @data.nodes
  @data.nodes = []
  for node in full_data
    @data.nodes.push(node) unless node.id == id
  redraw()
