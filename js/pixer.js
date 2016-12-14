/*
 * Construct a new pixer object
 * svg is where the shapes will be drawn
 * width and height determine the resolution of the shapes
 */
var Pixer = function (svg, width, height) {
    this.svg = svg;
    this.states = {};
    var svgWidth = svg.attr("width");
    var svgHeight = svg.attr("height");
    this.circleRadius = (svgWidth / width) / 2;
    this.xOffset = (svgWidth - ((svgWidth / width) * width)) / 2;
    this.yOffset = (svgHeight - ((svgHeight / height) * height)) / 2;
    this.circles = this.svg.selectAll("circles");
};

// Add a new state and make any necessary adjustments
Pixer.prototype.addState = function (stateName, statePositions) {
    this.states[stateName] = statePositions;
    if (statePositions.length > this.circles.size()) {
        // Add more circle to generate this new state
        for (var i = 0; i < statePositions.length - this.circles.size(); i++) {
            this.svg.append("circle")
                    .attr("r", this.circleRadius)
        }
        this.circles = this.svg.selectAll("circle");
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
        var originalLength = statePositions.length;
        for (var i = 0; i < this.circles.size() - originalLength; i++) {
            var lastPosition = statePositions[i % originalLength];
            statePositions.push(lastPosition);
        }
    }
    return this;
};

// Updates the locations of the circles to the given state
Pixer.prototype.setState = function (stateName) {
    return this.setPositions(this.states[stateName]);
}

// Transitions to the given progress point and updates the locations of the circles
Pixer.prototype.transition = function (stateName1, stateName2, progress) {
    return this.setPositions(this.transitionPositions(stateName1, stateName2, progress));
};

Pixer.prototype.transitionTimed = function (stateName1, stateName2, time) {
    var statePositions1 = this.states[stateName1];
    var statePositions2 = this.states[stateName2];
    this.setPositions(statePositions1);
    return this.setPositionsTimed(statePositions2, time);
}

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

// Updates the positions of all the circles according to the positions array
Pixer.prototype.setPositions = function (positions) {
    this.circles.data(positions).enter();
    var xOffset = this.xOffset;
    var circleRadius = this.circleRadius;
    this.circles.attr("cx", function (d) {
        return xOffset + (d.x * (2 * circleRadius) + circleRadius);
    });
    var yOffset = this.yOffset;
    this.circles.attr("cy", function (d) {
        return yOffset + (d.y * (2 * circleRadius) + circleRadius);
    });
    return this;
};

// Updates the positions of all the circles according to the positions array
Pixer.prototype.setPositionsTimed = function (positions, time) {
    this.circles.data(positions).enter();
    var xOffset = this.xOffset;
    var yOffset = this.yOffset;
    var circleRadius = this.circleRadius;
    this.circles.transition().duration(time)
                             .attr("cx", function (d) {
                                 return xOffset + (d.x * (2 * circleRadius) + circleRadius);
                             })
                             .attr("cy", function (d) {
                                 return yOffset + (d.y * (2 * circleRadius) + circleRadius);
                             });
    return this;
};
