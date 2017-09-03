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
  var h = 1600;
  var barSvg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "barChart");

// nesting original data: grouping identical year values
  var dataByYear = d3.nest()
    .key(function(d) {
          return d.year;
    }) // data will be grouped by year (key: year)
    .entries(dataset) // the original array
    .filter(function (d) {
          var year = +d.key;
          return year > 1949; // filtering years lower than 1950
    });
  console.log(dataByYear);

var barHeight = 9;
var barPadding = 4;

// drawing bars with transition and skew
  var bars = barSvg.selectAll("rect")
    .data(dataByYear)
    .enter()
    .append("rect")
      .attr("class", function(d, i) {
            return "y" + d.key;
      })
      .attr("x", w/2)
      .attr("y", function(d, i) {
            return i * (barHeight + barPadding);
      })
      .attr("fill", "white")
      .attr("height", barHeight)
      .attr('transform', "skewY(25), translate(0,-231)")
      .transition()
      .duration(2000)
      .attr("width", function(d) {
            return d.values.length/8;
      })
      .attr("x", function(d, i) {
            return w/2 - d.values.length/8;
      });

// drawing labels
  var labels = barSvg.selectAll("text")
    .data(dataByYear)
    .enter()
    .append("text")
      .text(function(d) {
            return d.key;
      })
      .attr("class", function(d, i) {
            return "y" + d.key;
      })
      .attr("x", function(d, i) {
            return w/2 + 15;
      })
      .attr("y", function(d, i) {
            return 10 + i * 13;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .attr("text-anchor", "start");

// drawing hoverList
  var hoverList = barSvg.selectAll("svg.list")
    .data(dataByYear)
    .enter()
    .append('svg')
      .attr("class", "list")
      .attr("id", function(d) {
            return "list-y" + d.key;
      })
      .attr("y", function(d, i) {
            return i * 13;
          })
      .attr("opacity", "0")
        .selectAll("text.listEntry")
        .data(function(d, i){
              return d.values;
        })
        .enter()
        .filter(function (d, i) { return i <= 5;})
        .append("text")
          .attr("class", "listEntry")
          .attr("x", function(d, i) {
                return w/2 + 80;
          })
          .attr("y", function(d, i) {
                return 10 + i * 13;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "white")
          .attr("text-anchor", "start")
          .append("tspan")
            .attr("class","entryName")
            .text(function(d) {
                  return d.name;
            })
          .append("tspan")
            .attr("class","entryData")
            .text(function(d) {
                  return " - " + d.mass + " gr - Coord: " + d.reclat + ", " + d.reclong;
            });

// interactivity
  labels.on("mouseover", function() {
          barSvg.selectAll("." + this.getAttribute('class'))
            .attr("fill", "orange");
          function getList (d){
                  return "#list" + d.key;
          };
          barSvg.select("#list-" + this.getAttribute("class"))
            .transition()
            .duration(200)
            .attr("opacity","1");
      });
  labels.on("mouseout", function() {
          barSvg.selectAll("." + this.getAttribute('class'))
            .transition()
            .duration(100)
            .attr("fill", "white");
          barSvg.select("#list-" + this.getAttribute("class"))
            .transition()
            .duration(200)
            .attr("opacity","0");
      });



    } // closes else
}); // closes .csv()
