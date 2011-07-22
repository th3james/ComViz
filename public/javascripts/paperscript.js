var projects = [];

//Create a new node
this.createProgramme = function() {
  var path = new Path.Circle(new Point(80, 50), 35);
  path.fillColor = 'red';
  view.draw();
};

paper.install(window.paperscript);
