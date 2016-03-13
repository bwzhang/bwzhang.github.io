var svgWidth = window.innerHeight - 30;
var svgHeight = window.innerHeight - 30;

var svg = d3.select("#grid").append("svg")
                           .attr("width", svgWidth)
                           .attr("height", svgHeight);

var mode = "draw";
var width = 50;
var height = 50;

var pixer = new Pixer(svg, width, height);

// Initialize the grid
var positions = [];
for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
        positions.push({x: i, y: j});
    }
}
pixer.addState("grid", positions).setState("grid");
pixer.rects.style("fill", "white");

var imagePositions = [];
// Add mouse events for drawing
svg.on("mousedown", function () {
    pixer.rects.on("mouseover", function () {
        var rect = d3.select(this);
        if (mode == "draw") {
            draw(rect);
        } else {
            erase(rect);
        }
    });
});
svg.on("mouseup", function () {
    pixer.rects.on("mouseover", null);
});

function draw(rect) {
    rect.style("fill", "black");
    imagePositions.push(rect.datum());
}

function erase(rect) {
    rect.style("fill", "white");
    var index = imagePositions.indexOf(rect.datum());
    if (index >= 0) {
        imagePositions.splice(index, 1);
    }
}

function setDrawMode() {
    mode = "draw";
}

function setEraseMode() {
    mode = "erase";
}

// Returns a pretty printed string of the imagePositions
function stringifyPositions() {
    return JSON.stringify(imagePositions, null, 4);
}

function outputPositions() {
    var textArea = d3.select("#output");
    console.log(textArea);
    document.getElementById("output").value = stringifyPositions();
}
