# Poverty & Health Indicators - US Census


[Check out the indicators graph.](https://patelpurvip.github.io/Poverty-Health-Indicators-USCensus/)


 health risks facing particular demographics. She's counting on you to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml), but you are free to investigate a different data set. The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."







create a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

Using the D3 techniques we taught you in class, create a scatter plot that represents each state with circle elements. You'll code this graphic in the `app.js` file of your homework directory—make sure you pull in the data from `data.csv` by using the `d3.csv` function. Your scatter plot should ultimately appear like the image at the top of this section.


While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Add tooltips to your circles and display each tooltip with the data that the user has selected. Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)—we've already included this plugin in your assignment directory.


# Evaluation

## Income vs. Obesity

Income levels seem pretty well correlated with obesity levels in each state. Overall, states with a lower average income level among its population presented higher obesity levels. One could speculate that this could indicated that lower-cost food items are contribute to nutritional deficiency, resulting in higher probability of obesity rates in populations with lower incomes. It could also support the idea of “food desserts”, where lower-income areas may have lower availability of high-quality foods or more food options, thus contributing to nutritional deficiencies like obesity.

### Credits
[David Gotz's example](https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) to see how you should implement tooltips with d3-tip.

the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)