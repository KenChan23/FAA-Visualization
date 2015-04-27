(function(){

  //  Initialize scale 
  var MAX_FATALITIES = 37;
  var MAX_ACCIDENTS = 44;

  var data_lookup = {}; 
  var accident_data;
  var fatality_data;
  var barchartA_data;

  var width = 750,
      height = 100,
      // cellSize = 17; // cell size
      cellSize = 13;

  var chartWidth = 300,
      chartHeight = 250;

  var day = d3.time.format("%w"),
      week = d3.time.format("%U"),
      format = d3.time.format("%Y-%m-%d");

  var fatality_color = d3.scale.quantile()
      .domain([1, MAX_FATALITIES])
      .range(d3.range(1, 9).map(function(d){
        return "q-color" + d + "-10";
      }));

  console.log(fatality_color(30));
      //  Map input domain to discrete range.

  var accident_color = d3.scale.quantile()
      .domain([1, MAX_ACCIDENTS])
      .range(d3.range(1, 9).map(function(d){
        return "q-color" + d + "-10";
      }));

  //  append heatmap
  var svg = d3.select("#heatmap-panel").selectAll("svg")
      .data(d3.range(1980, 1985))
    .enter().append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "RdYlGn")
    .append("g")
      .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

  svg.append("text")
      .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
      .style("text-anchor", "middle")
      .text(function(d) { return d; });

  var rect = svg.selectAll(".day")
      .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", function(d) { return week(d) * cellSize; })
      .attr("y", function(d) { return day(d) * cellSize; })
      .datum(format);

  rect.append("title")
      .text(function(d) { return d; });

  svg.selectAll(".month")
      .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("path")
      .attr("class", "month")
      .attr("d", monthPath);

  //  append bar charts
  // var svgA = d3.select("body").select("#bar-charts").select("#bar-chart-a").append("svg")
  //   .attr("width", chartWidth)
  //   .attr("height", chartHeight)
  //   .style('background-color','black')
  //   .append("g")
  //   .attr("transform", "translate(" + 0 + "," + 0 + ")")
  //   .append("text").attr("class", "title").attr("x", ).attr("y", -26)
  //     .text("Total Hours Flown - Past 90 Days");

  // var svgB = d3.select("body").select("#bar-charts").select("#bar-chart-b").append("svg")
  //   .attr("width", chartWidth)
  //   .attr("height", chartHeight)
  //   .style('background-color','red')
  // .append("g")
  //   .attr("transform", "translate(" + 0 + "," + 0 + ")");

  // var svgC = d3.select("body").select("#bar-charts").select("#bar-chart-c").append("svg")
  //   .attr("width", chartWidth)
  //   .attr("height", chartHeight)
  //   .style('background-color','blue')
  // .append("g")
  //   .attr("transform", "translate(" + 0 + "," + 0 + ")");

  // var svgD = d3.select("body").select("#bar-charts").select("#bar-chart-d").append("svg")
  //   .attr("width", chartWidth)
  //   .attr("height", chartHeight)
  //   .style('background-color','green')
  // .append("g")
  //   .attr("transform", "translate(" + 0 + "," + 0 + ")");

  d3.csv("../data/part_91_csv/data_1980_84.csv", function(error, csv) {

    csv.forEach(function(d){
      if(d.date in data_lookup)
        data_lookup[d.date].push(d);
      else
        data_lookup[d.date] = [];
    });

    fatality_data = d3.nest()
      .key(function(d) { return d.date; })
      .rollup(function(d) { 
        //  Count of fatalities...
         fatality_sum = d3.sum(d, function(g){
           if (g.fatalities !== null)
          {
              fatalities = parseInt(g.fatalities);
            
            return fatalities;
          }
          else 
              return 0; 
          });

         // if(MAX_FATALITIES < fatality_sum)
         //      MAX_FATALITIES = fatality_sum;
         //    console.log("Fatalities: " + MAX_FATALITIES);
         // console.log("Sum: " + fatality_sum);
         return fatality_sum;
      }).map(csv);

    accident_data = d3.nest()
      .key(function(d){ return d.date; })
      .rollup(function(d){
        //  Count of accidents...
        // if(d.length > MAX_ACCIDENTS)
        //   MAX_ACCIDENTS = d.length;
        // console.log("Accidents: " + MAX_ACCIDENTS);
        return d.length; 
      }).map(csv);

    // barchartA_data = d3.nest()
    //   .key(function(d){ return d.date; })
    //   .rollup(function(d){
    //     //  Count of accidents...
    //     return d.length; 
    //   }).map(csv);

    //  Initialize the view.
    rect.filter(function(d) { return d in fatality_data; })
      .attr("class", function(d) { return (fatality_data[d] === 0) ? "day q-color" + d + "-10" : "day " + fatality_color(fatality_data[d]); })
      .select("title")
        .text(function(d) {
          if(fatality_data[d] == 0)
            return d + ": No fatalities!";
          else if(fatality_data[d] == 1)
            return d + ": " + fatality_data[d] + " fatality" 
          else
            return d + ": " + fatality_data[d] + " fatalities"; 
        });
  });

  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = +day(t0), w0 = +week(t0),
        d1 = +day(t1), w1 = +week(t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
  }

  d3.select(self.frameElement).style("height", "2910px");

  var heatmapRadioActions = function() {
    function rectVisibility(id, callback){
      var data;
      switch(id)
      {
        case "#fatalities":
          console.log("inside case fatalities");
          data = fatality_data;
          color = fatality_color;
          break;
        case "#accidents":
          console.log("inside case accidents");
          data = accident_data;
          color = accident_color;
          break;
        default:
          break;
      }

      callback(data, color);
    }

    function renderRectangle(data, color, id){
      console.log("inside default");
        rect.filter(function(d) { return d in data; })
          .attr("class", function(d) { return (data[d] === 0) ? "day q-color" + d + "-10" : "day " + color(data[d]); })
          .select("title")
            .text(function(d) {
              switch(id)
              {
                case "#fatalities":
                  if(data[d] == 0)
                    return d + ": No fatalities!";
                  else if(data[d] == 1)
                    return d + ": " + data[d] + " fatality" 
                  else
                    return d + ": " + data[d] + " fatalities"; 
                  break;
                case "#accidents":
                  if(data[d] == 0)
                    return d + ": No accidents!";
                  else if(data[d] == 1)
                    return d + ": " + data[d] + " accident" 
                  else
                    return d + ": " + data[d] + " accidents"; 
                  break;
                default:
                  break;
              }
            });
    }

    d3.selectAll('#accidents, #fatalities').on('click', function() {
      if($('#accidents').is(':checked')) 
        rectVisibility('#accidents', function(data, color){
          renderRectangle(data, color, "#accidents");
        });
      if($('#fatalities').is(':checked')) 
        rectVisibility('#fatalities', function(data, color){
          renderRectangle(data, color, "#fatalities");
        });
    }); 

  };

  // console.log(data_lookup);

  heatmapRadioActions();

  d3.selectAll('.day').on('click', function(d){
    // console.log(d);
    // console.log(data_lookup[d]);
    s = JSON.stringify(data_lookup[d])
    d3.select('.cd-panel-content').html(s);
  });

  $("#slider").bind("valuesChanging", function(e, data){
    var minimumDate = data.values.min;
    var maximumDate = data.values.max;

    d3.selectAll('.day').filter(function(d){

      var currentDate = Date.parse(d);

      if(minimumDate <= currentDate && currentDate <= maximumDate){
        return d3.select(this).classed('q-invisible', false);
      }
      else
        return d3.select(this).classed('q-invisible', true);
    });
  });

  // function generateBarChartA(data) {
  //   var x = d3.scale.ordinal()
  //   .rangeRoundBands([0, width], .1, .3);

  //   var y = d3.scale.linear()
  //       .range([height, 0]);

  //   var xAxis = d3.svg.axis()
  //       .scale(x)
  //       .orient("bottom");

  //   var yAxis = d3.svg.axis()
  //       .scale(y)
  //       .orient("left")
  //       .ticks(8, "%");

  // var svg = d3.select("body").select("#bar-chart-a").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //   d3.tsv("data.tsv", type, function(error, data) {
  // x.domain(data.map(function(d) { return d.name; }));
  // y.domain([0, d3.max(data, function(d) { return d.value; })]);

  // svg.append("text")
  //     .attr("class", "title")
  //     .attr("x", x(data[0].name))
  //     .attr("y", -26)
  //     .text("Total Hours Flown - Past 90 Days");

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis)
  //   .selectAll(".tick text")
  //     .call(wrap, x.rangeBand());

  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis);

  // svg.selectAll(".bar")
  //     .data(data)
  //   .enter().append("rect")
  //     .attr("class", "bar")
  //     .attr("x", function(d) { return x(d.name); })
  //     .attr("width", x.rangeBand())
  //     .attr("y", function(d) { return y(d.value); })
  //     .attr("height", function(d) { return height - y(d.value); });
  // });

  // }

  

    function type(d) {
    d.value = +d.value;
    return d;
  }

  function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
})();