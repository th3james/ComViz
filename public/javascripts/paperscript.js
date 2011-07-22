(function() {
  var Container, global, programmes;
  global = this;
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
  this.objectsOverlapping = function(p) {
    var id, overlapping, programme, _len, _ref;
    alert("" + programmes.length);
    overlapping = [];
    _ref = programmes.items;
    for (programme = 0, _len = _ref.length; programme < _len; programme++) {
      id = _ref[programme];
      alert("id " + id + ", programme " + programme);
      if (programme.contains(p)) {
        overlapping.push(programme);
      }
    }
    return overlapping;
  };
  
  onMouseDown = function(event) {
    alert("Mouse clicked at " + event.point);
    return objectsOverlapping(event.point);
  }
;
  paper.install(window.paperscript);
}).call(this);
