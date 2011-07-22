var p = new Path();
p.add(new Point(0, 0));
p.add(new Point(50, 50));
p.strokeColor = "#999";

//Create a new node
this.createNode = function() {
  console.log("Making red...");
  p.strokeColor = "#c10";
  view.draw();
};

paper.install(window.paperscript);

