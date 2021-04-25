// Set the dimensions of the SVB
var svgWidth = 960;
var svgHeight = 500;

// Set the variables for margin, width and height
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

// Calcuate the height and width of the chart
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Append a class div chart to the scatter element
var chart = d3.select("#scatter").append("div").attr("class", "tooltip").style("opacity, 0");
// var chart = d3.select("#scatter").append("div").classed("chart", true);


// Create SVG wrapper, append an SVG group that will hold the chart, and shift it by the left and top margins.
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Setup the initial chart parameters
var chosenX= "poverty";
var chosenY = "healthcare";

// Import the Data
// d3.csv("../data/data.csv").then(function(data) {

  // Parse the CSV data so that it is cast as numbers
  //=======================================

  censusData.forEach(function(data) {
    data.poverty = +data.poverry;
    data.healthcare = +data.healthcare;
  });

  // Create the scale functions
  // var xLinearScale = d3.scaleLinear().domain([d3.min(censusData, d => d.poverty)]).range([0, width]);
  // var yLinearScale = d3.scaleLinear().domain([d3.min(censusData, d => d.healthcare)].range([height, 0]));


// Create the scale functions
//===========================================
  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height, 0]);
  
}

// Create the axis functions
//===========================================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var xMin;
var xMax;
var yMin;
var yMax;

// Append the axes to the chart

