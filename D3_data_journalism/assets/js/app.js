// Set the dimensions of the SVG
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
    .domain([d3.min(data, d => d[chosenX] *0.9),
      d3.max(data, d => d[chosenX] * 1.1)
    ])
    .range([0, width]);
  return xLinearScale;
}

//The function used to update the Y-Scale variable if the axis label is clicked
function yScale(data, chosenY) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenY]-2), 
      d3.max(data, d => d[chosenY]+2)])
      .range([height, 0]);
  return yLinearScale;

}

// The function that will update the X axis variable if its label is clicked
function renderXaxes(changedXScale, xAxis) {
  var bottomAxis = d3.axisBottom(changedXScale);
  xAxis.transition().duration(1000).call(bottomAxis);
  return xAxis;
}

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
    .attr("dx", d => changedXScale(d[chosenX]));
  return circlesGroup;
}

/// Update the circles if Y changes
function renderYCircles(circlesGroup, changedYScale, chosenY) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => changedYScale(d[chosenY]))
    .attr("dy", d => changedYScale(d[chosenY])+5)
  return circlesGroup;
}

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
    .attr("dy", d => changedYScale(d[chosenY])+5)
  return circlesGroup;
}
// The function to update the circles groups' tooltips
function changeToolTip(circlesGroup, chosenX, chosenY) {

    var xlabel;
    var ylabel;

    if (chosenX === "poverty") {
      xlabel = "Poverty:"
    }
    else if (chosenX === "age") {
      xlabel = "Age:";
    }
    else if (chosenX === "income") {
      xlabel = "Household Income:";
    }
    
    if (chosenY === "healthcare") {
      ylabel = "Health:";
    }
    else if (chosenY === "smokes") {
      ylabel = "Smokes:";
    }
    else if (chosenY === "obesity") {
      ylabel = "Obesity:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("color", "black")
      .style("background", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[chosenX]}%<br>${ylabel} ${d[chosenY]}%`);
      });

    // circlesGroup.call(toolTip);
    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    .on("mouseout", function(data) {
    toolTip.hide(data, this);
    });

    return circlesGroup;
}

// Import the CSV and then parse it so that the data is cast as numbers
d3.csv("assets/data/data.csv").then(function(data, err) {
    console.log(data)
    if (err) throw err;

    data.forEach(d => {
      d.poverty = +data.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.healthcare = +d.healthcare;
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
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
    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    // Create the scatter plot and append the initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      // .append("g");

    var circles = circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d[chosenX]))
      .attr("cy", d => yLinearScale(d[chosenY]))
      .attr("r", 15)
      .classed('stateCircle', true);
    
    // Append text inside the circles
    var circlesText = circlesGroup.append("text")
      .text(d =>d.abbr)
      .attr("dx", d => xLinearScale(d[chosenX]))
      .attr("dy", d => yLinearScale(d[chosenY])+5)
      .classed('stateText', true);

    // Create a group for the 3 labels on the x axis
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width /2}, ${height +20})`);

    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // this value is grabbed for the event listener
      .text("In Poverty (%)")
      .classed("active", true);

    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // this value is grabbed for the event listener
      .text("Age (Median)")
      .classed("inactive", true);

    var incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // this value is grabbed for the event listener
      .text("Household Income (Median)")
      .classed("inactive", true);

    // Create a group for the 3 labels on the y axis
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")

    var obeseLabel = ylabelsGroup.append("text")
      .attr("x", -(height / 2))
      .attr("y", -80)
      .attr("dy", "1em")
      .attr("value", "obesity") // this value is grabbed for the event listener
      .text("Obese (%)")
      .classed("inactive", true);

    var smokesLabel = ylabelsGroup.append("text")
      .attr("x", -(height / 2))
      .attr("y", -60)
      .attr("dy", "1em")
      .attr("value", "smokes") // this value is grabbed for the event listener
      .text("Smokes (%)")
      .classed("inactive", true);

    var healthcareLabel = ylabelsGroup.append("text")
      .attr("x", -(height / 2))
      .attr("y", -40)
      .attr("dy", "1em")
      .attr("value", "healthcare") // this value is grabbed for the event listener
      .text("Lacks Healthcare (%)")
      .classed("active", true);

    // Set tool tips
    circlesGroup = changeToolTip(circlesGroup, chosenX, chosenY);

    // The event listener for the labels on the x axis
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get the selection value
        var value = d3.select(this).attr("value");
        if (value !== chosenX) {

        // replace chosenX with value
        chosenX = value;

        // update the data on the x scale
        xLinearScale = xScale(data, chosenX);

        // update the transition on the x axis
        xAxis = renderXAxes(xLinearScale, xAxis);
        
        // X circles are updated with the new values
        circles = renderXCircles(circles, xLinearScale, chosenX);

        // X circles' text is updated
        circlesText = renderXtxt (circlesText, xLinearScale, chosenX);

        // X circles' tooltips are updated
        circlesGroup = changeToolTip (chosenX, chosenY, circlesGroup);

        // classes that are changed get bold text
        if (chosenX === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenX === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });

    // The event listener for the labels on the y axis
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get the selection value
      var value = d3.select(this).attr("value");
      if (value !== chosenY) {

        // replace chosenY with value
        chosenY = value;

        // update the data on the y scale
        yLinearScale = xScale(data, chosenY);

        // update the transition on the x axis
        yAxis = renderYAxes(yLinearScale, yAxis);
        
        // X circles are updated with the new values
        circles = renderYCircles(circles, yLinearScale, chosenY);

        // X circles' text is updated
        circlesText = renderYtxt (circlesText, yLinearScale, chosenY);

        // X circles' tooltips are updated
        circlesGroup = changeToolTip (chosenX, chosenY, circlesGroup);

        // classes that are changed get bold text
        if (chosenY === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenY === "obesity"){
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);;
        }
      }
    });
  }).catch(function(error) {
    console.log(error);
  });