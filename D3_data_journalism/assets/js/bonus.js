// Set the dimensions of the SVG
var svgWidth = 960;
var svgHeight = 500;

// Set the variables for margin, width and height
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
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
function xScale(censusData, chosenX) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenX]) *0.8,
      d3.max(censusData, d => d[chosenX]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

//The function used to update the Y-Scale variable if the axis label is clicked
function yScale(censusData, chosenY) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenY]) * 0.8,
      d3.max(censusData, d => d[chosenY]) * 1.2 
      ])
      .range([height, 0]);

  return yLinearScale;

}

// The function that will update the X axis variable if its label is clicked
function renderXAxes(changedXScale, xAxis) {
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
    .attr("cx", d => changedXScale(d[chosenX]));

  return circlesGroup;
}

/// Update the circles if Y changes
function renderYCircles(circlesGroup, changedYScale, chosenY) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => changedYScale(d[chosenY]));
  
  return circlesGroup;
}

/// Update the text for X and for Y
function renderXtxt(circlesText, changedXScale, chosenX) {
  circlesText.transition()
     .duration(1000)
     .attr("x", d => changedXScale(d[chosenX]));
  return circlesText;
    
}

function renderYtxt(circlesText, changedYScale, chosenY) {
  circlesText.transition()
    .duration(1000)
    .attr("y", d => changedYScale(d[chosenY])+4);
  return circlesText;
}

// The function to update the circles groups' tooltips
function changeToolTip(chosenX, chosenY, circlesGroup, ) {

  var xlabel;
  var ylabel;

  if (chosenX === "poverty") {
    xlabel = "Poverty:"
  }
  else if (chosenX === "age") {
    xlabel = "Age:"
  }
  else {
    xlabel = "Household Income:";
    }
    

  if (chosenY === "healthcare") {
    ylabel = "Health:"
  }
  else if (chosenY === "smokes") {
    ylabel = "Smokes:"
  }
  else  {
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
      return (`<strong>${d.state}</strong>
          <br>${xlabel} ${d[chosenX]}
          <br>${ylabel} ${d[chosenY]}`);
      });

    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
    .on("mouseout", function(data, index) {
    toolTip.hide(data);
    });

  return circlesGroup;
}

// Import the CSV and then parse it so that the data is cast as numbers
  (async function(){
    var censusData = await d3.csv("assets/data/data.csv").catch(err => console.log(err))
      console.log(censusData)

    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
  });

    // Create the scale and axes functions
    var xLinearScale = xScale(censusData, chosenX);
    var yLinearScale = yScale(censusData, chosenY);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the Axes
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    // Create the scatter plot and append the initial circles
    var circlesGroup = chartGroup.append("g")
      .selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenX]))
      .attr("cy", d => yLinearScale(d[chosenY]))
      .attr("r", 12)
      .attr("fill", "steelblue")
      .attr("opacity", ".5");
    
    // Append text inside the circles
    var circlesText = chartGroup.append("g")
      .selectAll("text")
      .data(censusData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d[chosenX]))
      .attr("y", d => yLinearScale(d[chosenY])+4)
      .attr("font-family", "verdana")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .style("fill", "black")
      .attr("font-weight", "bold");
      
    // Create a group for the 3 labels on the x axis
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 30})`);

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
      .attr("transform", "rotate(-90)");

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
    var circlesGroup = changeToolTip(chosenX, chosenY, circlesGroup);

    // The event listener for the labels on the x axis
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get the selection value
        var xValue = d3.select(this).attr("value");
        if (xValue !== chosenX) {

        // replace chosenX with value
        chosenX = xValue;

        // update the data on the x scale
        xLinearScale = xScale(censusData, chosenX);

        // update the transition on the x axis
        xAxis = renderXAxes(xLinearScale, xAxis);
        
        // X circles are updated with the new values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenX);

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
        var yValue = d3.select(this).attr("value");
         if (yValue !== chosenY) {

          // replace chosenY with value
          chosenY = yValue;

          // update the data on the y scale
          yLinearScale = yScale(censusData, chosenY);

          // update the transition on the x axis
          yAxis = renderYAxes(yLinearScale, yAxis);
        
          // X circles are updated with the new values
          circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenY);

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
  })()
