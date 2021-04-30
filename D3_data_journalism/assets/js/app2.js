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
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import the CSV and then parse it so that the data is cast as numbers
d3.csv("assets/data/data.csv").then(function(CensusData, err) {
    console.log(CensusData)
    if (err) throw err;

    CensusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
     });

       // Create the scale and axes functions
       var xLinearScale = d3.scaleLinear().domain([5, d3.max(CensusData, d => d.poverty)]).range([0, width]);

        var yLinearScale = d3.scaleLinear().domain([28, d3.max(CensusData, d => d.healthcare)]).range([height, 0]);

        var bottomAxis = d3.axisBottom(xLinearScale);

        var leftAxis = d3.axisLeft(yLinearScale);
    
         // Append the Axes
        chartGroup.append("g").attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        chartGroup.append("g").call(leftAxis);

         // Create the scatter plot and append the circles
         var circlesGroup = chartGroup.selectAll("circle")
         .data(CensusData)
         .enter()
         .append("circle")
         .attr("cx", d => xLinearScale(d.poverty))
         .attr("cy", d => yLinearScale(d.healthcare))
         .attr("r", "15")
         .attr("fill", "pink")
         .attr("opacity", ".5");

         // Set tool tips
         var toolTip = d3.tip()
         .attr("class", "toolTip")
         .offset([-8, 10])
         .style("color", "black")
         .style("background", "white")
         .style("border", "solid")
         .style("border-width", "1px")
         .style("border-radius", "5px")
         .style("padding", "5px")
         .html(function(d) {
             return d.abbr; });
        
        //  chartGroup.call(toolTip);
         svg.call(toolTip);
        // circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
        })
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });
    
        // Create labels for the axes
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height /2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

    }).catch(function(error) {
        console.log(error);
});       