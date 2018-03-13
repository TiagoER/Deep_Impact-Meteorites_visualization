// Generate a Bates distribution of 10 random variables.

var histogramX = {}
var histogramIntervals = {}
var histogramDetails = {}
var histogramY = {}

var histogramContainerWidth = 150,
    histogramContainerHeight = 150;

var histogramMargin = { top: 50, right: 0, bottom: 0, left: 0 },
    histogramWidth = histogramContainerWidth - histogramMargin.left - histogramMargin.right,
    histogramHeight = histogramContainerHeight - histogramMargin.top - histogramMargin.bottom;


function genHistogram(field,intervals,container) {

    if (typeof container === "undefined") container = "#the_chart";

    var histogramSVG = d3.select(container)
            .append("svg")
            .attr("id", "histogram"+field)
            .attr("width", histogramContainerWidth)
            .attr("height", histogramContainerHeight)
            .append("g")
            .attr("transform", "translate(" + histogramMargin.left + "," + histogramMargin.top + ")");

    // Generate a histogram using twenty uniformly-spaced bins.
    
    histogramIntervals[field] = intervals;

    histogramX[field] = d3.scale.ordinal()
        .domain(histogramIntervals[field])
        .rangePoints([0, histogramIntervals[field].length * 14]);



    var dt = meteoFilter.data.map(function (d) { return d[field]; });

    var histogramData = d3.layout.histogram()
                        .bins(histogramIntervals[field])
                        (dt);

    histogramY[field] = d3.scale.log()
        .domain([0.5, d3.max(histogramData, function (d) { return d.y; })])
        .range([histogramHeight, 0]);

    var histogramXAxis = d3.svg.axis()
        .scale(histogramX[field])
        .tickSize(histogramHeight + 50)
        .orient("top");

    var ax = histogramSVG.append("g")
    .attr("class", "x axis histogram")
    .attr("transform", "translate(0," + (histogramHeight) + ")")

    ax.call(histogramXAxis)
    .selectAll("text")
    .attr("y", -6)
    .attr("x", -histogramHeight - 50)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start")
    .style("fill", "white");

    var bar = histogramSVG.selectAll(".bar")
        .data(histogramData)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d, i) {
            if (isNaN(histogramY[field](d.y)))
                return "translate(" + (histogramX[field](d.x) + 1) + ",0)";
            else
                return "translate(" + (histogramX[field](d.x) + 1) + "," + histogramY[field](d.y) + ")";
        })

    bar.append("rect")
        .attr("x", 1)
        .attr("y",0)
        .style("fill", "#666")
        .style("rx", "2")
        .style("ry", "2")
        .attr("width", 12)
        .attr("height", function (d) { if (isNaN(histogramY[field](d.y))) return 0; else return histogramHeight - histogramY[field](d.y); });

    bar.append("rect")
        .attr("x", 1)
        .attr("y", 0)
        .attr("class","histogramBars")
        .style("fill", "white")
        .style("rx", "2")
        .style("ry", "2")
        .attr("width", 12)
        .attr("height", function (d) { if (isNaN(histogramY[field](d.y))) return 0; else return histogramHeight - histogramY[field](d.y); })
        .attr("baseHeight", function (d) { if (isNaN(histogramY[field](d.y))) return 0; else return histogramHeight - histogramY[field](d.y); })
        .on("mouseover", function (d, i) {
            this.style.fill = "orange"

            var data = histogramData[i].slice(0, histogramData[i].length)
            var max = Math.max.apply(null,data),
                min = Math.min.apply(null, data),
                item = field.substring(0);

            clearTimeout(tipTimeout)
            d3.select("#tip")
                .transition()
                .duration(725)
                .style("opacity", "1")
            d3.select("#tip")
                .style("display", "block")

            var dataset = meteoFilter.data.filter(function (h) { return h[item] >= min && h[item] <= max; }).slice(0);
            tip(dataset.slice())

        })
        .on("mouseout", function (d) {
            this.style.fill = "white"
        	tipTimeout = setTimeout(function () {
        	    d3.select("#tip")
        	        .transition()
                    .duration(725)
                    .style("opacity", "0")
        	}, 300);
        	restoreParallel();
        })
}

function updateHistogram(field) {
    var dt = meteoFilter.data.map(function (d) { return d[field]; });

    var histogramData = d3.layout.histogram()
                        .bins(histogramIntervals[field])
                        (dt);

    d3.select("#histogram" + field)
    .selectAll(".histogramBars")
        .each(function (d, i) {
            d3.select(this)
                .transition()
                .duration(250)
                .attr("y", function (h) {
                    if (isNaN(histogramY[field](histogramData[i].y))) return parseFloat(this.getAttribute("baseHeight"))
                    else return parseFloat(this.getAttribute("baseHeight") - histogramHeight + histogramY[field](histogramData[i].y));
                })
                .attr("height", function (h) {
                    if (isNaN(histogramY[field](histogramData[i].y))) return 0;
                    else return histogramHeight - histogramY[field](histogramData[i].y);
                })
        })
}