var mapViewModule = (function(){
  "use strict";

  var mapView = {};

  mapView.create = function(data){
    var width = 475,
        height = 510,
        active = d3.select(null);

    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#side-view").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g")
        .style("stroke-width", "1.5px")
        .attr("transform", "translate(100,100)scale(0.6, 0.6)");

    d3.json("/javascripts/us-named.json", function(error, us) {
      // aggregate_color = d3.nest

      console.log("states");

        var features = topojson.feature(us, us.objects.states).features;
        top.location.hash.split("").slice(1, features.length).forEach(function(c, i) {
          if ((c = +c) >= 0 && c < 10) assign(features[i], c ? c - 1 : null);
        });

        console.log(us);

      g.selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
          .attr("d", path)
          .attr("class", function(d){console.log(d); return "feature"})
          .on("click", clicked);

      g.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "mesh")
          .attr("d", path);
    });

    function clicked(d) {
      if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select(this).classed("active", true);

      var bounds = path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = .9 / Math.max(dx / width, dy / height),
          translate = [width / 2 - scale * x, height / 2 - scale * y];

      g.transition()
          .duration(750)
          .style("stroke-width", 1.5 / scale + "px")
          .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    function reset() {
      active.classed("active", false);
      active = d3.select(null);

      g.transition()
          .duration(750)
          .style("stroke-width", "1.5px")
          .attr("transform", "translate(100,100)scale(0.6, 0.6)");
    }

  };

    mapView.update = function(){
    
   };

  return mapView;

})();
