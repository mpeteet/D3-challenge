// Set the dimensions of the SVB
var svgWidth = 960;
var svgHeight = 500;

// Set the variables for margin, width and height
var margin = {
  top: 20,
  right: 40,
  bottom: 800,
  left: 100
};

// Calcuate the height and width of the chart
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append an SVG group that will hold the chart, and shift it by the left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Setup the initial chart parameters
var chosenX= "poverty";
var chosenY = "healthcare";

// The function to update the X-Scale variable if the axis label is clicked
function xScale(data, chosenX) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenX]) *0.9,
      d3.max(data, d => d[chosenX]) * 1.1
    ])
    .range([0, width]);
  return xLinearScale;
}

//The function used to update the Y-Scale variable if the axis label is clicked
function yScale(data, chosenY) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenY])-2, 
      d3.max(data, d => d[chosenY])+2])
      .range([height, 0]);
  return yLinearScale;

}

// The function that will update the X axis variable if its label is clicked
function renderXaxes(changedXScale, xAxis) {
  var bottomAxis = d3.axisBottom(changedXScale);
  xAxis.transition().duration(1000).call(bottomAxis);
  return xAxis;

// The function that will update the Y axis variable if its label is clicked
function renderYAxes(changedYScale, yAxis) {
  var leftAxis = d3.axisLeft(changedYScale);
  yAxis.transition().duration(1000).call(leftAxis);
  return yAxis;
}

// The functions to update the circles group (transtions)

/// Update the circles if X changes
function renderXCircles(circlesGroup, changedXScale, chosenX) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => changedXScale(d[chosenX]))
    .attr("dx", d => changedXScale(d[chosenX])+5);
  return circlesGroup;
}
/// Update the circles if Y changes
function renderYCircles(circlesGroup, changedYScale, chosenY) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => changedYScale(d[chosenY]))
    .attr("dy", d => changedYScale(d[chosenY]));
  return circlesGroup;

/// Update the text for X and for Y
function renderXtxt(circlesGroup, changedXScale, chosenX) {
  circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => changedXScale(d[chosenX]));
  return circlesGroup;
}
function renderYtxt(circlesGroup, changedYScale, chosenY) {
  circlesGroup.transition()
    .duration(1000)
    .attr("dy", d => changedYScale(d[chosenY]));
  return circlesGroup;
}
// The function to update the circles groups' tooltips
function changeToolTip(chosenX, chosenY, circlesGroup) {
  var xlabel;
  var ylabel;
  if (chosenX == "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenX == "age") {
    xlabel = "Age:";
  }
  else if (chosenX == "income") {
    xlabel = "Household Income:";
  }
  else if (chosenY == "healthcare") {
    ylabel = "Health:";
  }
  else if (chosenY == "obesity") {
    ylabel = "Obesity:";
  }
  else if (chosenY == "smokes") {
    ylabel = "Smokes:";
  }
  var ToolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .style("color", "black")
    .style("background", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenX]}
      %<br>${ylabel} ${d[chosenY]}%`);
    });
  circlesGroup.call(ToolTip);

  circlesGroup.on("mouseover", function(data) {
    ToolTip.show(data);
  })
  .on("mouseout", function(data, index) {
    ToolTip.hide(data);
    });
  return circlesGroup;
}

// Import the CSV and then parse it so that the data is cast as numbers
d3.csv("assets/data/data.csv").then(function(data, err) {
    //console.log(data)
    if (err) throw err;

    data.forEach(d => {
      d.poverty = +data.poverry;
      d.povertyMoe = +d.povertyMoe;
      d.age = +d.age;
      d.ageMoe = +d.ageMoe;
      d.income = +d.income;
      d.incomeMoe = +d.incomeMoe;
      d.healthcare = +d.healthcare;
      d.healthcareLow = +d.healthcareLow;
      d.healthcareHigh = +d.healthcareHigh;
      d.obesity = +d.obesity;
      d.obesityLow = +d.obesityLow;
      d.obesityHigh = +d.obesityHigh;
      d.smokes = +d.smokes;
      d.smokesLow = +d.smokesLow;
      d.smokesHigh = +d.smokesHigh;
  });

    // Create the scale and axes functions
    var xLinearScale = xScale(data, chosenX);
    var yLinearScale = yScale(data, chosenY);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the Axes
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);









}

});
});