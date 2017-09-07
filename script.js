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
        return b.mass - a.mass;
  });


// BAR CHART

  var w = 1000;
  var h = 920;
  var barSvg = d3.select("body").select("#barChart").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "barSvg");

// nesting original data: grouping identical year values
  var dataByYear = d3.nest()
    .key(function(d) {
          return d.year;
    })
    .sortKeys(d3.ascending) // data will be grouped by year (key: year)
    .entries(dataset) // the original array
    .filter(function (d) {
          var year = +d.key;
          return year > 1949; // filtering years lower than 1950
    });
  console.log(dataByYear);

var barHeight = 8;
var barPadding = 5;

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
            return 10 + i * (barHeight + barPadding);
      })
      .attr("fill", "white")
      .attr("height", barHeight)
      .attr('transform', "skewY(25), translate(0,-231)")
      .attr("x", function(d, i) {
            return w/2;
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
            return 20 + i * 13;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .attr("text-anchor", "start")
      .style("cursor", "pointer");

// drawing container for hoverList
var listXPos = w/2 + 100;

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
      .attr("opacity", "0");

// drawing list title
  hoverList.append("text")
    .attr("class", "listTitle")
    .attr("x", function(d, i) {
          return listXPos;
    })
    .attr("y", 15)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .append("tspan")
      .attr("fill", "white")
      .text(function(d) {
            return "Six heaviest meteorites of ";
      })
    .append("tspan")
      .attr("fill", "#ff2b2a")
      .text(function(d) {
            return d.values.length;
      })
    .append("tspan")
      .attr("fill", "white")
      .text(function(d) {
            return " total";
      });

// drawing lines inside hoverList
  hoverList.append("line")
    .attr("x1", function(d, i) {
          return w/2 + 50;
    })
    .attr("y1", function(d, i) {
          return 20;
    })
    .attr("x2", function(d, i) {
          return w/2 + 350;
        })
    .attr("y2", function(d, i) {
          return 20;
    })
    .attr("stroke-width", 0.5)
    .attr("stroke", "#999999");

// drawing list entries
  hoverList.selectAll("text.listEntry")
      .data(function(d, i){
            return d.values;
      })
      .enter()
      .filter(function (d, i) { return i <= 5;})
      .append("text")
        .attr("class", "listEntry")
        .attr("x", function(d, i) {
              return listXPos;
        })
        .attr("y", function(d, i) {
              return 35 + i * 13;
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
          .attr("x", function(d, i) {
                return listXPos + 165;
          })
          .text(function(d) {
                return d.mass + " gr";
          });

// interactivity
  labels.on("mouseover", function() {
          barSvg.selectAll("." + this.getAttribute('class'))
            .transition()
            .duration(50)
            .attr("fill", "#ff2b2a");
          barSvg.select("#list-" + this.getAttribute("class"))
            .transition()
            .duration(100)
            .attr("opacity","1");
  });
  labels.on("mouseout", function() {
          barSvg.selectAll("." + this.getAttribute('class'))
            .transition()
            .duration(50)
            .attr("fill", "white");
          barSvg.select("#list-" + this.getAttribute("class"))
            .transition()
            .duration(100)
            .attr("opacity","0");
  });

// load bar chart
  barSvg.on("mouseover", function(){
        barSvg.selectAll("rect")
        .transition()
          .duration(500)
          .delay(function(d, i) {
                return i * 10;
          })
          .attr("width", function(d) {
                return d.values.length/8;
          })
          .attr("x", function(d, i) {
                return w/2 - d.values.length/8;
          });
  });


// BUBBLE CHART

  var bubbleSvg = d3.select("body").select("#bubbleChart").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "bubbleSvg");

// nest data by rectype
  var dataByType = d3.nest()
    .key(function(d) {
          return d.rectype;
    })
    .entries(dataset) // the original array
  console.log(dataByType);

// simulate physics
  var simulation = d3.forceSimulation(dataByType)
    .force("charge", d3.forceManyBody().strength([-20]))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", ticked); // updates the position of each circle (from function to DOM)

// call to check the position of each circle
  function ticked(e) {
        node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
  };

// create scale to link radius and mass
  var scaleRadius = d3.scaleLinear()
            .domain([d3.min(dataByType, function(d) { return d.values.mass; }),
                    d3.max(dataByType, function(d) { return d.values.mass; })])
            .range([2,18]);

// create range of colors based on tectype
  var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);

// draw circles
  var node = bubbleSvg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")
     .attr('r', function(d) { return scaleRadius(d.values.mass)})
     .attr("fill", function(d) { return colorCircles(d.key)})
     .attr('transform', 'translate(' + [w/2, h/2] + ')');


    } // closes else
}); // closes .csv()
