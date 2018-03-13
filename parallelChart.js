var parallelMargin = { top: 30, right: 0, bottom: 10, left: 0 },
    parallelWidth = 800- parallelMargin.left - parallelMargin.right,
    parallelHeight = 400 - parallelMargin.top - parallelMargin.bottom;

var parallelX = d3.scale.ordinal().rangePoints([0, parallelWidth], 1),
    parallelY = {},
    dragging = {};

var parallelLine = d3.svg.line(),
    parallelAxis = d3.svg.axis().ticks(2).orient("left"),
    background,
    foreground;

var parallelSvg = d3.select("body").append("svg")
    .attr("width", parallelWidth + parallelMargin.left + parallelMargin.right)
    .attr("height", parallelHeight + parallelMargin.top + parallelMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + parallelMargin.left + "," + parallelMargin.top + ")");

d3.csv("Meteo.csv", function (error, meteos) {
    
    // Extract the list of dimensions and create a scale for each.
    parallelX.domain(dimensions = d3.keys(meteos[0]).filter(function (d) {
        return (d == "Fa" || d == "Fs" || d == "Wo")
            && (parallelY[d] = d3.scale.linear()
            .domain(d3.extent(meteos, function (p) { var x = +p[d]; return  x; }))
            .range([parallelHeight, 0]));
    }));

    // Add grey background lines for context.
    background = parallelSvg.append("g")
        .attr("class", "background")
      .selectAll("path")
        .data(meteos.slice(0, 200))
      .enter().append("path")
        .attr("d", parallelPath);

    // Add blue foreground lines for focus.
    foreground = parallelSvg.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(meteos.slice(0, 200))
      .enter().append("path")
        .attr("d", parallelPath);

    // Add a group element for each dimension.
    var g = parallelSvg.selectAll(".dimension")
        .data(dimensions)
        .enter()
        .append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + parallelX(d) + ")"; })
        .call(d3.behavior.drag()
        .origin(function (d) { return { parallelX: parallelX(d) }; }))

    // Add an axis and title.
    g.append("g")
        .attr("class", "parallelAxis")
        .each(function (d) { d3.select(this).call(parallelAxis.scale(parallelY[d])); })
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(parallelY[d].brush = d3.svg.brush().y(parallelY[d]).on("brushstart", brushstart).on("brush", brush));
        })
      .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
});

function parallelPosition(d) {
    var v = dragging[d];
    return v == null ? parallelX(d) : v;
}

function parallelTransition(g) {
    console.log("called");
    return g.transition().duration(500);
}

// Returns the path for a given data point.
function parallelPath(d) {
    return parallelLine(dimensions.map(function (p) { return [parallelPosition(p), parallelY[p](d[p])]; }));
}

function brushstart() {
    d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
    var actives = dimensions.filter(function (p) { return !parallelY[p].brush.empty(); }),
        extents = actives.map(function (p) { return parallelY[p].brush.extent(); });
    foreground.style("display", function (d) {
        return actives.every(function (p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
    });
}
