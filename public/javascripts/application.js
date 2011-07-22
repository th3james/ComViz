(function() {
  var AppView, Programme, Programmes;
  Programme = Backbone.Model.extend({
    name: null,
    initialize: function(options) {
      return this.bind("remove", function() {
        $('#' + this.cid).remove();
        return this.destroy();
      });
    }
  });
  Programmes = Backbone.Collection.extend({
    initialize: function(models, options) {
      return this.bind("add", options.view.addProgrammeLi);
    }
  });
  AppView = Backbone.View.extend({
    el: $("body"),
    initialize: function() {
      return this.programmes = new Programmes(null, {
        view: this
      });
    },
    events: {
      "click #add_programme": "programmeNamePrompt",
      "click a.delete_programme": "deleteProgramme"
    },
    programmeNamePrompt: function() {
      var programme_model, programme_name;
      programme_name = prompt("Programme name?");
      programme_model = new Programme({
        name: programme_name
      });
      return this.programmes.add(programme_model);
    },
    deleteProgramme: function(e) {
      var f, li;
      li = $(e.currentTarget).parent('li');
      f = this.programmes.getByCid(li.attr('id'));
      return this.programmes.remove(f);
    },
    addProgrammeLi: function(model) {
      return $("#programme_list").append("<li id='" + model.cid + "'>" + (model.get('name')) + " <a href='#' class='delete_programme'>delete</a></li>");
    }
  });
  $(document).ready(function() {
    var appview;
    return appview = new AppView;
  });
}).call(this);
