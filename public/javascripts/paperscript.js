//Programmes
var programmes = [];

//Create a new node
this.createProgramme = function() {
  var newProgramme, position, previous;

  position = new Point(50, 50);
  // If previous elements exist, move this out of the way
  if (programmes.length > 0) {
    previous = programmes[programmes.length - 1];
    position = new Point(previous.position.x + 60, previous.position.y );
  }
  newProgramme = new Path.Circle(position, 20);

  programmes.push(newProgramme);
  newProgramme.fillColor = '#4784BC';
  view.draw();
};

paper.install(window.paperscript);
