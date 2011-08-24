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
  node_index = ''
  #for i in [0..@data.nodes.length-1]
    #node_index = i if @data.nodes[i].id == id
  #@data.nodes.splice(node_index, 1)
  @data.nodes = @data.nodes.filter( (node) ->
    node.id != id
  )
  redraw()
