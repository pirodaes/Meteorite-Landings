var dataset; // global variable

d3.csv("data/csv-generated.csv", function(error, data) {
    if (error) {  //If error is not null, something went wrong.
      console.log(error);  //Log the error.
    } else {      //If no error, the file loaded correctly.
      data.forEach(function(d) {
            d.mass = +d.mass;
            d.year = +d.year;
            d.reclat = +d.reclat;
            d.reclong = +d.reclong;
          });
      //Log the data.
      console.log(data);

// copy the data to the dataset global variable
  dataset = data;

// order the array chronologically
  dataset.sort(function (a, b) {
    return a.year - b.year;
  });


// BAR CHART

  var w = 1000;
  var h = 4000;
  var barSvg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

// nesting original data: grouping identical year values
  var dataByYear = d3.nest()
    .key(function(d) {
      return d.year;
    }) // data will be grouped by year (key: year)
    .entries(dataset) // the original array
    .filter(function (d) {
      var year = +d.key;
      return year > 1899; // filtering years lower than 1900
    });
  console.log(dataByYear);

  var bars = barSvg.selectAll("rect")
    .data(dataByYear)
    .enter()
    .append("rect")
      .attr("x", function(d, i) {
        return w/2 - d.values.length/8;
      })
      .attr("y", function(d, i) {
        return i * 13;
      })
      .attr("fill", "white")
      .attr("height", 9)
      .attr("width", function(d) {
        return d.values.length/8;
      })
      .attr('transform', "skewY(25), translate(0,-231)");

    var labels = barSvg.selectAll("text")
      .data(dataByYear)
      .enter()
      .append("text")
        .text(function(d) {
          return d.key;
        })
        .attr("x", function(d, i) {
          return w/2 + 15;
        })
        .attr("y", function(d, i) {
          return 10 + i * 13;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");



    } // closes else
}); // closes .csv()
