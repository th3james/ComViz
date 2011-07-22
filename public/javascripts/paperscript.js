(function() {
  var Container, programmes;
  Container = (function() {
    function Container(lastPosition) {
      this.lastPosition = lastPosition;
      this.items = {};
    }
    Container.prototype.add = function(id, p) {
      this.lastPosition = p.position;
      return this.items[id] = p;
    };
    return Container;
  })();
  programmes = new Container(new Point(0, 50));
  this.createProgramme = function(id) {
    var newProgramme, position;
    position = new Point(programmes.lastPosition.x + 60, programmes.lastPosition.y);
    newProgramme = new Path.Circle(position, 20);
    programmes.add(id, newProgramme);
    newProgramme.fillColor = '#4784BC';
    return view.draw();
  };
  this.deleteProgramme = function(id) {
    var programme;
    programme = programmes.items[id];
    programme.remove();
    return view.draw();
  };
  this.objectOverlapping = function(p) {};
  paper.install(window.paperscript);
}).call(this);
