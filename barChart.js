var barChartDataset;

function initBarChart() {
    console.log("1 barchart");



    console.log("2 barchart");


    barChartDataset = meteoFilter.data.sort(function (a, b) { return b.cost - a.cost });
    if (barChartDataset.length > 213)
        barChartDataset = barChartDataset.slice(0, 213);
    console.log(barChartDataset);

    console.log("3 barchart");


    barChartGen_vis();
}

var barChartSvg;
var runOnce = false;

function barChartRedraw() {
    if (runOnce) {
        var myNode = window.document.getElementById("the_chart");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        barChartDataset = meteoFilter.data.sort(function (a, b) { return b.cost - a.cost });
        if (barChartDataset.length > 213)
            barChartDataset = barChartDataset.slice(0, 213);
        barChartGen_vis();
    }
}

function barChartGen_vis() {

    var w = 246;
    var h = 100;
    var max_bars = 214;
    var padding = 30; // 50
    var orientention = 0; // 0: vertical(normal) ou 1: horizontal

    if (orientention == 0) {
        var hscale = d3.scale.pow().exponent(.4)
                .domain([d3.max(barChartDataset.map(function (d) { return d.cost; })), 0.5])
                .range([10, h - padding]);

        var xscale = d3.scale.linear()
                .domain([0, barChartDataset.length])
                .range([10, w - 10]); // .range([padding, w-padding]);
    } else {
        var hscale = d3.scale.linear()
                .domain([0, barChartDataset.length])
                .range([30, h - 30]);

        var xscale = d3.scale.linear()
                .domain([0, 100000])
                .range([10, w - padding - 10]);
    }

    console.log("BAR CHART GEN VIS");

    barChartSvg = d3.select("#the_chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

    barChartSvg.selectAll("rect")
            .data(barChartDataset)
            .enter()
            .append("rect")

            .attr("width", function (d) {
                if (orientention == 0) {
                    return Math.floor((w) / barChartDataset.length) + 1;
                } else {
                    return xscale(d.MonetaryValue) - padding + 5;
                }
            })
            .attr("height", function (d) {
                if (orientention == 0) {
                    return h - padding - hscale(d.cost + 10);
                } else {
                    return Math.floor((h) / barChartDataset.length) + 1;
                }
            })
            .attr("fill", "white")
            .attr("x", function (d, i) {
                if (orientention == 0) {
                    return xscale(i);
                } else {
                    return padding;
                }
            })
            .attr("y", function (d, i) {
                if (orientention == 0) {
                    return hscale(d.cost + 10);
                } else {
                    return hscale(i);
                }
            })


            .on('mouseover', function (d, i) {
                d3.select(this).attr("fill", "orange"); //old
                d3.select(this).attr("width", 237 - xscale(i));

                var top = d3.event.pageY;
                var left = d3.event.pageX;
                top = top + 0;
                top = top < 20 ? top = 0 : top - 20;
                left = left > window.innerWidth - 280 ? left - 280 : left + 20;

            })
            .on('mouseleave', function (d) {
                d3.select(this).attr("fill", "white"); //old
                d3.select(this).attr("width", Math.floor((w) / barChartDataset.length) + 1)
            });

    ///////////////////////////////////////////////
    var yaxis = d3.svg.axis()
            .scale(hscale)
            .orient("left");

    if (orientention == 0) {
        var xaxis = d3.svg.axis()
                .scale(xscale)
                .orient("bottom")
                .ticks(barChartDataset.length / 20)
                .tickFormat(function (d) { return d + 1; });
    } else {
        var xaxis = d3.svg.axis()
                .scale(xscale)
                .orient("bottom")
                .ticks(barChartDataset.length / 20)
                .tickFormat(function (d) { return d; });
    }

    if (orientention == 0) {
        barChartSvg.append("g")
                .attr("transform", "translate(0, " + (h - padding) + ")")
                .attr("class", "x axis")
                .call(xaxis);
    } else {
        barChartSvg.append("g")
                .attr("transform", "translate(" + (padding - 10) + "," + (h - padding) + ")")
                .attr("class", "x axis")
                .call(xaxis);
    }
}
