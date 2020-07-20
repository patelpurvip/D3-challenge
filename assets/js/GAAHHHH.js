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
var chosenYAxis = "obesity";

function xScale(censusData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.95, d3.max(censusData, d => d[chosenXAxis]) * 1.025])
        // .domain(d3.extent(censusData, d => d[chosenXAxis]))
        .range([0, chartWidth]);

    return xLinearScale;
}

function yScale(censusData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.95, d3.max(censusData, d => d[chosenYAxis])* 1.025])
        .range([chartHeight, 0]);
    
    return yLinearScale;
}


function renderAxes(newXScale, xAxis, newYScale, yAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    var leftAxis = d3.axisLeft(newYScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return xAxis, yAxis;
    
}



function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// console.log("yay updated circlesGroup -- I think.....");

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel;

    if (chosenXAxis === "income") {
        xLabel = "Ave Income per State (USD)";
    }

    else if (chosenXAxis === "poverty") {
        xLabel = "Poverty level per State (%)";
    }

    else  {
        xLabel = "Healthcare coverage per State (%)";
    }

    var yLabel;

    if (chosenYAxis === "obesity") {
        yLabel = "% Obesity in the Population (by state)";
    }
    
    else if (chosenYAxis === "age") {
        yLabel = "Average Age per State (years)";
    }
    
    else {
        yLabel = "Smokers per State (%)";
    }
 

    // var tooltip = d3.tip()
    var toolTip = d3.select("#scatter").append("div")
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
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
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    // scale functions
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(10);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    // append axes to the chart
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //create & append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "teal")
        .attr("opacity", ".5");
        // .attr("text", d => d.abbr)
        // .property("value", d => d.abbr)


    // creat axis labels & append axes
    var xLabelsGroup = chartGroup.append("g")
        //THIS LINE OF CODE SEEMS TO DO NOTHING, BUT SHOULD BE TRANSLATING THE X-AXIS LABELS BELOW THE X-AXIS
        .attr("transform", `translate(${chartWidth/2 - 80}, ${chartHeight + 20})`);
    
    var incomeLabel = xLabelsGroup.append("text")
    //   .attr("x", chartWidth/2 - 80) --> these center the text by axis.  To use these instead, change "labelsGroup" to "chartGroup" when defining each axis variable.
    //   .attr("y", chartHeight + 40)
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "income")
      .classed("active", true)
      .attr("class", "axisText")
      .text("Average Income per State (USD)");

    var povertyLabel = xLabelsGroup.append("text")
    //   .attr("x", chartWidth/2 - 50)
    //   .attr("y", chartHeight + 65)
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "poverty")
      .classed("inactive", true)
      .attr("class", "axisText")
      .text("Poverty Rate per State (%)");
    
    var healthcareLabel = xLabelsGroup.append("text")
      //   .attr("x", chartWidth/2 - 50)
      //   .attr("y", chartHeight + 65)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .attr("class", "axisText")
        .text("Lack of Healthcare Coverage per State (%)");
    
    var yLablesGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");
    
    var obesityLabel = yLablesGroup.append("text")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", -100 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Obesity in the Population (by state)");
      
    var ageLabel = yLablesGroup.append("text")
      .attr("y", 0 - chartMargin.left + 20)
      .attr("x", -100 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Average State Population Age");

    var smokeLabel = yLablesGroup.append("text")
      .attr("y", 0 - chartMargin.left + 60)
      .attr("x", -100 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Smokers in State Population");
    // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // SOMETHING GOING ON HERE CHECK THIS!!!!
    // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    // , updateYToolTip(chosenYAxis, circlesGroup)


    xLabelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if(value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(censusData, chosenXAxis);

                xAxis = renderAxes(xLinearScale, xAxis);

                // circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "healthcare") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }

            if(value !== chosenYAxis){
                chosenYAxis = value;
                yLinearScale = yScale(censusData, chosenYAxis);

                yAxis = renderAxes(yLinearScale, yAxis);

                // circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
                // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
        
                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

                else if (chosenYAxis === "age") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    // yLabelsGroup.selectAll("text")
    //     .on("click", function() {
    //         console.log("ok, that worked");
    //         var value = d3.select(this).attr("value"); 
    //     });

}).catch(function(error) {
    console.log(error);
});


//----end Responsive code--------------
// }
// makeResponsive();
// d3.select(window).on("resize", makeResponsive);






