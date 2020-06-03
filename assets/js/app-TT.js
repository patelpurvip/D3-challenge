// Create svg wrapper and chart structure
var svgWidth = 1000;
var svgHeight = 600;

var chartMargin = {
    top: 50,
    right: 0,
    left: 100,
    bottom: 100};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);

    // Income vs. Obesity
    censusData.forEach(function(data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
    });

    // create scale functions
    
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.income) - 5000, d3.max(censusData, d => d.income) + 5000])
        // .domain(d3.extent(censusData, d => d.income))
        .range([0, chartWidth]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.obesity) - 2, d3.max(censusData, d => d.obesity) + 2])
        .range([chartHeight, 0]);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(10);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    // append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create bubbles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    // .attr("text", d => d.abbr)
    // .property("value", d => d.abbr)
    .attr("r", "15")
    .attr("fill", "teal")
    .attr("opacity", ".5");

    // creat axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 50)
      .attr("x", -100 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Obesity in the Population (by state)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth/2 - 100}, ${chartHeight + chartMargin.top + 10})`)
      .attr("class", "axisText")
      .text("Average Income per State (USD)");

}).catch(function(error) {
    console.log(error);
});




//KEEP NOTE OF THESE THINGS:
//-------------------------------------
//to set axis limits, keep track of dataset min and max values
// console.log("min value: ", d3min(arrayX));
// console.log("max value: ", d3max(arrayX));
// console.log("min and max values: ", d3.extent(arrayX));

//responsiveness
//d3.select(window).on("resize", makeResponsive);

