// Construct a new pixer object
// svg is where the shapes will be drawn
// width and height determine the resolution of the shapes
var Pixer = function (svg, width, height) {
    this.svg = svg;
    this.states = {};
    var svgWidth = svg.attr("width");
    var svgHeight = svg.attr("height");
    this.rectWidth = (svgWidth / width) - 1;
    this.rectHeight = (svgHeight / height) - 1;
    this.xOffset = (svgWidth - ((svgWidth / width) * width)) / 2;
    this.yOffset = (svgHeight - ((svgHeight / height) * height)) / 2;
    this.rects = this.svg.selectAll("rects");
};

// Add a new state and make any necessary adjustments
Pixer.prototype.addState = function (stateName, statePositions) {
    this.states[stateName] = statePositions;
    if (statePositions.length > this.rects.size()) {
        // Add more rectangles to generate this new state
        for (var i = 0; i < statePositions.length - this.rects.size(); i++) {
            this.svg.append("rect")
                    .attr("width", this.rectWidth)
                    .attr("height", this.rectHeight);
        }
        this.rects = this.svg.selectAll("rect");
        // Pad existing states to make them the same size
        for (var existingStateName in this.states) {
            var existingStatePositions = this.states[existingStateName];
            var originalLength = existingStatePositions.length
            for (var i = 0; i < statePositions.length - originalLength; i++) {
                var lastPosition = existingStatePositions[i % originalLength];
                existingStatePositions.push(lastPosition);
            }
        }
    } else {
        // Pad the new state with extra positions
        for (var i = 0; i < this.rects.size() - statePositions.length; i++) {
            var lastPosition = statePositions[statePositions.length - 1];
            statePositions.push(lastPosition);
        }
    }
};

// Updates the locations of the rects to the given state
Pixer.prototype.setState = function (stateName) {
    this.setPositions(this.states[stateName]);
}

// Transitions to the given progress point and updates the locations of the rects
Pixer.prototype.transition = function (stateName1, stateName2, progress) {
    this.setPositions(this.transitionPositions(stateName1, stateName2, progress));
};

// Returns the positions at a given progress point during the transition between states
Pixer.prototype.transitionPositions = function (stateName1, stateName2, progress) {
    var state1 = this.states[stateName1];
    var state2 = this.states[stateName2];
    var updatedPositions = [];
    for (var i = 0; i < state1.length; i++) {
        var position1 = state1[i];
        var position2 = state2[i];
        var xScale = d3.scale.linear()
                       .range([position1.x, position2.x]);
        var yScale = d3.scale.linear()
                       .range([position1.y, position2.y]);
        var updatedPosition = {x: xScale(progress), y: yScale(progress)};
        updatedPositions.push(updatedPosition);
    }
    return updatedPositions;
};

// Updates the positions of all the rects according to the positions array
Pixer.prototype.setPositions = function (positions) {
    this.rects.data(positions).enter();
    var xOffset = this.xOffset;
    var rectWidth = this.rectWidth;
    this.rects.attr("x", function (d) {
        return xOffset + (d.x * (rectWidth + 1));
    });
    var yOffset = this.yOffset;
    var rectHeight = this.rectHeight;
    this.rects.attr("y", function (d) {
        return yOffset + (d.y * (rectHeight + 1));
    });
};