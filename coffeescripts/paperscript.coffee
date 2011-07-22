#Generic objects container
class Container
  constructor: (@lastPosition) ->
    @items = {}

  add: (id, p) ->
    @lastPosition = p.position
    @items[id] = p

programmes = new Container(new Point(0, 50))

#Create a new node
@createProgramme = (id) ->
  #If previous elements exist, move this out of the way
  position = new Point(programmes.lastPosition.x + 60, programmes.lastPosition.y )
  newProgramme = new Path.Circle(position, 20)

  programmes.add(id, newProgramme)
  newProgramme.fillColor = '#4784BC'
  view.draw()

#Create a new node
@deleteProgramme = (id) ->
  programme = programmes.items[id]
  programme.remove()
  view.draw()

# Returns overlapping objects
@objectsOverlapping = (p) -> 
  alert("#{programmes.items}")
  overlapping = []
  for id in programmes.items
    alert("id #{id}, programme #{programme}")
    overlapping.push programme if programme.contains(p)
  return overlapping

`
  onMouseDown = function(event) {
    alert("Mouse clicked at " + event.point);
    return objectsOverlapping(event.point);
  }
`

paper.install(window.paperscript)

