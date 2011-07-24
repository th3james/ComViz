(function() {
  $(document).ready(function() {
    var AppView, Programme, Programmes, appview;
    Programme = Backbone.Model.extend({
      name: null,
      initialize: function(options) {
        return this.bind("remove", function() {
          $('#' + this.cid).remove();
          window.deleteNode(this.cid);
          return this.destroy();
        });
      }
    });
    Programmes = Backbone.Collection.extend({
      initialize: function(models, options) {
        return this.bind("add", options.view.addProgramme);
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
      addProgramme: function(model) {
        $("#programme_list").append("<li id='" + model.cid + "'>" + (model.get('name')) + " <a href='#' class='delete_programme'>delete</a></li>");
        return window.addNode({
          name: model.get('name'),
          id: model.cid
        });
      }
    });
    appview = new AppView;
    return initGraph();
  });
}).call(this);
