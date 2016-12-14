var pageContent = d3.select("#pageContent");

var minWindowDimension = Math.min(window.innerWidth, window.innerHeight);
var padding = 50;
var headerHeight = document.getElementById("name").offsetHeight;
var footerHeight = document.getElementById("pageFooter").offsetHeight;
var width = minWindowDimension - padding - footerHeight - headerHeight;
var height = minWindowDimension - padding - footerHeight - headerHeight;

var svg = pageContent.append("svg")
                     .attr("width", width)
                     .attr("height", height);

var pixer = new Pixer(svg, 50, 50);

// Add states for animations
pixer.addState("default", def);
pixer.addState("email", email);
pixer.addState("github", github);
pixer.addState("linkedin", linkedin);
pixer.addState("resume", resume);

var color = "#F3E4B2";
d3.select("body").style("color", color);
pixer.circles.style("fill", color);

// Set default state
pixer.setState("default");
var currentState = "default";

var transitionTime = 1300;

function onHover(sectionName) {
    pixer.transitionTimed(currentState, sectionName, transitionTime);
    currentState = sectionName;
}

// Change image on hover
var sectionNames = ["email", "github", "linkedin", "resume"];
sectionNames.forEach(function (sectionName) {
    d3.select("#" + sectionName).on("mouseover", function () { onHover(sectionName); });
});

d3.select("#name").on("mouseover", function () { onHover("default"); });
