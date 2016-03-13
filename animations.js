var width = 500;
var height = 500;

var svg = d3.select("body").append("svg")
                           .attr("width", width)
                           .attr("height", height);

var pixer = new Pixer(svg, 50, 50);

var state2 = [];
for (var i = 0; i < 50; i++) {
    state2.push({x: i, y: i});
}
pixer.addState("state1", initials);
pixer.addState("state2", box);

pixer.setState("state1");

pixer.timedTransition("state1", "state2", 2000);
//svg.on('mousemove', function() {
    //var coords = [0, 0];
    //coords = d3.mouse(this);
    //var x = coords[0];
    //var y = coords[1];
    //var progress = x / width;
    //pixer.transition("state1", "state2", progress);
//});

