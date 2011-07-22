var paperscript = {};

function createProgramme(id) {
  // do something
  paperscript.createProgramme(id);
}

function deleteProgramme(id) {
  // do something
  paperscript.deleteProgramme(id);
}

$(document).ready(function() {

  //Programme model
  Programme = Backbone.Model.extend({
    name: null,
    initialize: function(options) {
      //Bind the remove event to the destroy and delete the html element
      this.bind("remove", function() {
        $('#'+this.cid).remove();
        deleteNode(this.cid);
        this.destroy();
      });
    }
  });


  //Programmes collection
  Programmes = Backbone.Collection.extend({
    initialize: function (models, options) {
      this.bind("add", options.view.addProgrammeLi);
    }
  });

  //Application view
  AppView = Backbone.View.extend({
    el: $("body"),
    initialize: function () {
      //Create a programme collection when the view is initialized, with a reference to this
      this.programmes = new Programmes( null, { view: this });
    },
    events: {
      "click #add_programme":  "programmeNamePrompt",
      "click a.delete_programme":  "deleteProgramme"
    },
    programmeNamePrompt: function () {
      var programme_name = prompt("Programme name?");
      var programme_model = new Programme({ name: programme_name });
      //Add a new programme model to our programmes collection
      this.programmes.add( programme_model );
    },
    deleteProgramme: function (e) {
      var li = $(e.currentTarget).parent('li');
      var f = this.programmes.getByCid(li.attr('id'));
      this.programmes.remove(f);
    },
    addProgrammeLi: function (model) {
      //The parameter passed is a reference to the model that was added
      $("#programme_list").append("<li id='"+model.cid+"'>" + model.get('name') + " <a href='#' class='delete_programme'>delete</a></li>");
      //Use .get to receive attributes of the model
      createProgramme(model.cid);
    }
  });

  var appview = new AppView;
  
});
