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

$(document).ready(() ->
  appview = new AppView;
)

