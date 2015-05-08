var collapsibleTreeModule = (function(){
  "use strict";

  var collapsibleTree = {};

  collapsibleTree.create = function(data){
    console.log(data);
    var date_range;

    if(data[data.length - 1].date != data[0].date)
      date_range = data[0].date + " to " + data[data.length - 1].date; 
    else
      date_range = data[0].date

    var flare_obj = {name: "List of events that occurred on: " + date_range, children:[], class: "parent"};   

      var overall_primary = d3.nest().key(function(d){return d.primary_cause;}).rollup(function(d){return d}).entries(data).filter(function(d, index)
        { if(d.key == "null"){d.key = "Unknown Cause"} flare_obj.children.push({name: d.key + ": " + d.values.length, children:[], class:"parent"});  for(var i = 0; i < d.values.length; i++)
        { d.values[i].name = "Event: " + i;  flare_obj.children[index].children.push({name: d.values[i].name, children:[], class: "parent"});

        for(var property in d.values[i])
         {
          if(property !== "name")
            flare_obj.children[index].children[i].children.push({name: property + ": " + d.values[i][property], class: "child"})
         } 
         } });

      //my crud
      var marginFlare = {top: 30, right: 20, bottom: 30, left: 20},
          widthFlare = 500 - marginFlare.left - marginFlare.right,
          barHeightFlare = 20,
          barWidthFlare = widthFlare * .8;

      var i = 0,
          duration = 400,
          root;

      var treeFlare = d3.layout.tree()
          .nodeSize([0, 20]);

      var diagonalFlare = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });

      var svgFlare = d3.select('.cd-panel-content').append("svg")
          .attr("id", "flare-tree")
          .attr("width", widthFlare + marginFlare.left + marginFlare.right)
        .append("g")
          .attr("transform", "translate(" + marginFlare.left + "," + marginFlare.top + ")");

      function moveChildren(node) {
      if(node.children) {
          node.children.forEach(function(c) { moveChildren(c); });
          node._children = node.children;
          node.children = null;
      }
      }

      var initialFlare = function(flare){
        flare.x0 = 0;
        flare.y0 = 0;
        moveChildren(flare);
        update(root = flare);
      }

      initialFlare(flare_obj);

      // d3.json(data_lookup[d], function(error, flare) {
      //   flare.x0 = 0;
      //   flare.y0 = 0;
      //   update(root = flare);
      // });

      function update(source) {

        // Compute the flattened node list. TODO use d3.layout.hierarchy.
        var nodes = treeFlare.nodes(root);

        // console.log(nodes);

        var heightFlare = Math.max(500, nodes.length * barHeightFlare + marginFlare.top + marginFlare.bottom);

        d3.select("#flare-tree").transition()
            .duration(duration)
            .attr("height", heightFlare);

        d3.select(self.frameElement).transition()
            .duration(duration)
            .style("height", heightFlare + "px");

        // Compute the "layout".
        nodes.forEach(function(n, i) {
          n.x = i * barHeightFlare;
        });

        // Update the nodes…
        var node = svgFlare.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        var nodeEnter = node.enter().append("g")
            .attr("class", function(d){return d.class + " node";})
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .style("opacity", 1e-6);

        // Enter any new nodes at the parent's previous position.
        nodeEnter.append("rect")
            .attr("y", -barHeightFlare / 2)
            .attr("height", barHeightFlare)
            .attr("width", barWidthFlare)
            .style("fill", color)
            .on("click", click);

        nodeEnter.append("text")
            .attr("dy", 3.5)
            .attr("dx", 5.5)
            .text(function(d) { return d.name; });

        // Transition nodes to their new position.
        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1);

        node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1)
          .select("rect")
            .style("fill", color);

        // Transition exiting nodes to the parent's new position.
        node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .style("opacity", 1e-6)
            .remove();

        // Update the links…
        var link = svgFlare.selectAll("path.link")
            .data(treeFlare.links(nodes), function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonalFlare({source: o, target: o});
            })
          .transition()
            .duration(duration)
            .attr("d", diagonalFlare);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonalFlare);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonalFlare({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }


      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }

      function color(d) {
        return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
      }
    };

    collapsibleTree.update = function(){

    };

    return collapsibleTree;
})();    
    