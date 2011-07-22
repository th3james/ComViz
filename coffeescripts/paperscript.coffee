class ProgrammesContainer
  @programmes = {}
  constructor: (@lastPosition) ->

  add: (id, p) ->
    @lastPosition = p.position
    @programmes[id] = p

