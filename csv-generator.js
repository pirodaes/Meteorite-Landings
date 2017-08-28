var dataset; // global variable

d3.csv("data/Meteorite_Landings.csv", function(error, data) {
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

// sorts in chronological order
  dataset.sort(function (a, b) {
    return a.year - b.year;
  });

  // function to print csv lines
  function meteorType(d) {
    if (d.recclass.includes('Iron')) {
      d3.select(this).text(function (d) {
          return d.name + ',' + d.id + ',' + d.nametype + ',\"' + d.recclass + '\",Iron,' + d.mass + ',' + d.fall + ',' + d.year + ',' + d.reclat + ',' + d.reclong + ',\"' + d.GeoLocation + '\"';
        });
    } else if (d.recclass.includes('Mesosiderite') || d.recclass.includes('Pallasite')) {
      d3.select(this).text(function (d) {
          return d.name + ',' + d.id + ',' + d.nametype + ',\"' + d.recclass + '\",Stony-Iron,' + d.mass + ',' + d.fall + ',' + d.year + ',' + d.reclat + ',' + d.reclong + ',\"' + d.GeoLocation + '\"';
        });
    } else if (
        (d.recclass.includes('Martian') || d.recclass.includes('ite') || d.recclass.startsWith('L') || d.recclass.startsWith('C') || d.recclass.startsWith('H') || d.recclass.startsWith('O') || d.recclass.startsWith('E') || d.recclass.startsWith('R') || d.recclass.startsWith('K') || d.recclass.includes('Stone') || d.recclass.includes('breccia'))
      ){
        d3.select(this).text(function (d) {
            return d.name + ',' + d.id + ',' + d.nametype + ',\"' + d.recclass + '\",Stony,' + d.mass + ',' + d.fall + ',' + d.year + ',' + d.reclat + ',' + d.reclong + ',\"' + d.GeoLocation + '\"';
          });
    } else if (
        (d.recclass.includes('Relict') || d.recclass.includes('Unknown') || d.recclass.includes('Fusion'))
      ){
     d3.select(this).text(function (d) {
         return d.name + ',' + d.id + ',' + d.nametype + ',\"' + d.recclass + '\",Relict,' + d.mass + ',' + d.fall + ',' + d.year + ',' + d.reclat + ',' + d.reclong + ',\"' + d.GeoLocation + '\"';
       });
   } else {
    d3.select(this).text(function (d) {
        return d.name + ',' + d.id + ',' + d.nametype + ',\"' + d.recclass + '\",error,' + d.mass + ',' + d.fall + ',' + d.year + ',' + d.reclat + ',' + d.reclong + ',\"' + d.GeoLocation + '\"';
      });
    };
  };

  //  location to wich the csv content will be printed
  d3.select('body').selectAll('div').data(dataset).enter().append("div")
  .each(meteorType);

  /*  d3.select('body').select('#chart').selectAll('p')
    .data(dataset).enter().append("p")
      .text(function (d,i) {
        return d.year + ' - ' + d.name + ' id: ' + d.id;
      });

    var min = d3.min(dataset, function(d, i) { return d.year });
    console.log(min);
    var max = d3.max(dataset, function(d, i) { return d.year });
    console.log(max);
    */

    } // closes else
}); // closes .csv()
