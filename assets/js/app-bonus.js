// function makeResponsive() {
//   var svgArea = d3.select("body").select("svg");

//   if (!svgArea.empty()) {
//     svgArea.remove();
//   }
//-----------------BONUS----------------------------------

// Create svg wrapper and chart structure
var svgWidth = 1000;
var svgHeight = 600;
// var svgWidth = window.innerWidth; --> SUPPOSEDLY FOR RESPONSIVENESS, BUT CAN'T GET IT TO WORK
// var svgHeight = window.innerHeight;

var chartMargin = {
    top: 0,
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

//Initial axes
var chosenXAxis = "income";

function xScale(censusData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.95, d3.max(censusData, d => d[chosenXAxis]) * 1.025])
        // .domain(d3.extent(censusData, d => d[chosenXAxis]))
        .range([0, chartWidth]);

    return xLinearScale;
}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function updateToolTip(chosenXAxis, circlesGroup) {
    var label;

    if (chosenXAxis === "income") {
        label = "Ave Income per State (USD)";
    }

    else {
        label = "Poverty level per State (%)"
    }

    // var tooltip = d3.tip()
    var toolTip = d3.select("#scatter").append("div")
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        tooltip.hide(data);
    })

    return circlesGroup;
}

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);

    // Income vs. Obesity
    censusData.forEach(function(data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
    });

    // scale functions
    var xLinearScale = xScale(censusData, chosenXAxis);
        
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.obesity) * 0.95, d3.max(censusData, d => d.obesity)* 1.025])
        .range([chartHeight, 0]);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(10);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    // append axes to the chart
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create & append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 15)
        .attr("fill", "teal")
        .attr("opacity", ".5");
        // .attr("text", d => d.abbr)
        // .property("value", d => d.abbr)

    // creat axis labels & append axes
    var labelsGroup = chartGroup.append("g")
        //THIS LINE OF CODE SEEMS TO DO NOTHING, BUT SHOULD BE TRANSLATING THE X-AXIS LABELS BELOW THE X-AXIS
        .attr("transform", `translate(${chartWidth/2 - 80}, ${chartHeight + 20})`);
    
    var incomeLabel = labelsGroup.append("text")
    //   .attr("x", chartWidth/2 - 80) --> these center the text by axis.  To use these instead, change "labelsGroup" to "chartGroup" when defining each axis variable.
    //   .attr("y", chartHeight + 40)
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "income")
      .classed("active", true)
      .attr("class", "axisText")
      .text("Average Income per State (USD)");

    var povertyLabel = labelsGroup.append("text")
    //   .attr("x", chartWidth/2 - 50)
    //   .attr("y", chartHeight + 65)
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "poverty")
      .classed("inactive", true)
      .attr("class", "axisText")
      .text("Poverty Rate per State (%)");
    
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", -100 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Obesity in the Population (by state)");

    // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


    labelsGroup.selectAll("text")
        .on("click", function() {
            console.log("ok, that worked");
            var value = d3.select(this).attr("value");
            if(value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(censusData, chosenXAxis);

                xAxis = renderAxes(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
  
}).catch(function(error) {
    console.log(error);
});


//----end Responsive code--------------
// }
// makeResponsive();
// d3.select(window).on("resize", makeResponsive);






