(function() {
  var ProgrammesContainer;
  ProgrammesContainer = (function() {
    ProgrammesContainer.programmes = {};
    function ProgrammesContainer(lastPosition) {
      this.lastPosition = lastPosition;
    }
    ProgrammesContainer.prototype.add = function(id, p) {
      this.lastPosition = p.position;
      return this.programmes[id] = p;
    };
    return ProgrammesContainer;
  })();
}).call(this);
