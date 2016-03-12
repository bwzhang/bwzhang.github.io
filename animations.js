var width = 500;
var height = 500;

var svg = d3.select("body").append("svg")
                           .attr("width", width)
                           .attr("height", height);

var pixer = new Pixer(svg, 100, 100);

var state1 = [];
for (var i = 0; i < 50; i++) {
    state1.push({x: i, y: 0});
}

var state2 = [];
for (var i = 0; i < 100; i++) {
    state2.push({x: i, y: i});
}

pixer.addState("state1", state1);
pixer.addState("state2", state2);

pixer.setState("state1");

//svg.on('mousemove', function() {
    //var coords = [0, 0];
    //coords = d3.mouse(this);
    //var x = coords[0];
    //var y = coords[1];
    //var progress = x / width;
    //pixer.transition("state1", "state2", progress);
//});

var i = 0;
var intervalId = window.setInterval(function () {
    pixer.transition("state1", "state2", i / 100);
    i++;
    if (i > 100) {
        stopTransitioning();
    }
}, 10);

function stopTransitioning() {
    window.clearInterval(intervalId);
}
