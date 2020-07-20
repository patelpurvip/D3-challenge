# Poverty & Health Indicators - US Census


[Check out the indicators graph.](https://patelpurvip.github.io/Poverty-Health-Indicators-USCensus/)

This exercise visualizes census data, specifically 2014 data from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System, based on 2014 American Community Survey (ACS) [1-year estimates](https://data.census.gov/cedsci/table?q=United%20States&g=0100000US&tid=ACSDP1Y2018.DP05). The dataset includes information on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error.

Each circle in the scatter plot that represents each state with circle elements. The ticks on the axes allow us to infer approximate values for each circle, while tooltips display the data for the axis that the user selects. 


# Evaluation

## Income vs. Obesity
Income levels seem pretty well correlated with obesity levels in each state. Overall, states with a lower average income level among its population presented higher obesity levels. One could speculate that this could indicated that lower-cost food items are contribute to nutritional deficiency, resulting in higher probability of obesity rates in populations with lower incomes. It could also support the idea of “food desserts”, where lower-income areas may have lower availability of high-quality foods or more food options, thus contributing to nutritional deficiencies like obesity.

## Poverty Rate vs. Obesity


## Obesity vs. Healthcare Coverage


### Credits
1. [David Gotz's example](https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) to see how to implement tooltips with d3-tip.
2. the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)