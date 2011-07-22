//Programmes
var programmes = {
  lastPosition: new Point(0, 50),
  add: function (id, p){
    this.lastPosition = p.position;
    this[id] = p;
  }
};

//Create a new node
this.createProgramme = function(id) {
  var newProgramme, position;

  // If previous elements exist, move this out of the way
  position = new Point(programmes.lastPosition.x + 60, programmes.lastPosition.y );
  newProgramme = new Path.Circle(position, 20);

  programmes.add(id, newProgramme);
  newProgramme.fillColor = '#4784BC';
  view.draw();
};

//Create a new node
this.deleteProgramme = function(id) {
  var programme = programmes[id];
  programme.remove();

  view.draw();
};

paper.install(window.paperscript);
