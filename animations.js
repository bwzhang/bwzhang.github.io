var pageContent = d3.select("#pageContent");

var minWindowDimension = Math.min(window.innerWidth, window.innerHeight);
var padding = 30;
var headerHeight = document.getElementById("pageFooter").offsetHeight;
var width = minWindowDimension - padding - headerHeight;
var height = minWindowDimension - padding - headerHeight;

var svg = pageContent.append("svg")
                     .attr("width", width)
                     .attr("height", height);

var pixer = new Pixer(svg, 50, 50);

// Add states for animations
pixer.addState("about", about);
pixer.addState("links", links);
pixer.addState("projects", projects);
pixer.addState("box", box);

// Set colors
var color1 = "#e9ece5";
var color2 = "#3b3a36";
d3.select("body").style("background-color", color1);
d3.selectAll("a").style("color", color1);
d3.select("ul").style("background-color", color2);
pixer.rects.style("fill", color2);

// Set default state
pixer.setState("about");
var currentState = "about";

var sectionNames = ["about", "links", "projects"];

var sectionButtons = {};
sectionNames.forEach(function (sectionName) {
    sectionButtons[sectionName] = d3.select("#" + sectionName);
});

var transitionTime = 750;

//
// Add listeners for buttons
//

function clearAllTimeouts() {
    var id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id);
    }
}

// Change image on hover
sectionNames.forEach(function (sectionName) {
    var button = sectionButtons[sectionName];
    button.on("mouseover", function () {
        // Clear all timeouts, so nothing randomly pops up
        clearAllTimeouts();
        var name = sectionName;
        pixer.transitionTimed(currentState, name, transitionTime);
        currentState = sectionName;
        hideContent();
        d3.selectAll("li").attr("class", null);
    });
});

// Show page content on click
sectionNames.forEach(function (sectionName) {
    var button = sectionButtons[sectionName];
    button.on("click", function () {
        // Clear all timeouts, so nothing randomly pops up
        clearAllTimeouts();
        pixer.transitionTimed(currentState, "box", transitionTime);
        currentState = "box";
        setTimeout(function () {
            showContent(sectionName);
        }, transitionTime);
        button.attr("class", "active");
    });
});

var sectionContent = {};

sectionNames.forEach(function (sectionName) {
    var request = new XMLHttpRequest();
    request.open('GET', sectionName + ".html");
    request.onreadystatechange = function () {
        sectionContent[sectionName] = request.responseText;
    }
    request.send();
});

// Adds content to svg
function showContent(sectionName) {
    var marginSize = pixer.rectWidth + 1;
    var contentWidth = width - (marginSize * 2)
    var contentHeight = height - (marginSize * 2)
    var content = svg.append("foreignObject")
                     .attr("x", marginSize)
                     .attr("y", marginSize)
                     .attr("width", contentWidth)
                     .attr("height", contentHeight);
    content.html(sectionContent[sectionName]);
}

// Deletes content from svg
function hideContent() {
    svg.select("foreignObject").remove();;
}
