var starChartDataset,
    starChartSvg;

/* DIMENSION VARIABLES */
var starContainerWidth = 170,
    starContainerHeight = 160,
    starChartHeight = Math.min(starContainerWidth,starContainerHeight),
    starChartWidth = starChartHeight,
    starMargin = 10,
    starArmLength = starChartWidth/2 - starMargin,
    starArm30DegX = Math.cos(30 * Math.PI / 180) * starArmLength,
    starArm30DegY = Math.sin(30 * Math.PI / 180) * starArmLength,
    starChartCenterX = starContainerWidth/ 2,
    starChartCenterY = starArmLength + (starContainerHeight - starArmLength - starArm30DegY) / 2
    starChartFaScale = d3.scale.linear()
        .domain([0, 100.0])
        .range([0, 1]),
    starChartFsScale = d3.scale.linear()
        .domain([0, 100.0])
        .range([0, 1])
    starChartWoScale = d3.scale.linear()
        .domain([0, 100.0])
        .range([0, 1])
    starTextColor = "white";

function starAdjust(a,b) {
    starContainerWidth = a
    starContainerHeight = b
    starChartHeight = Math.min(starContainerWidth, starContainerHeight)
    starChartWidth = starChartHeight
    starMargin = 10
    starArmLength = starChartWidth / 2 - starMargin
    starArm30DegX = Math.cos(30 * Math.PI / 180) * starArmLength
    starArm30DegY = Math.sin(30 * Math.PI / 180) * starArmLength
    starChartCenterX = starContainerWidth / 2
    starChartCenterY = starArmLength + (starContainerHeight - starArmLength - starArm30DegY) / 2
}

function initStarChart(){
    starChartDataset = meteoFilter.data.sort(function(a,b){ return b.mass-a.mass;});
    if(starChartDataset.length > 512)
        starChartDataset = starChartDataset.slice(0,512);

    gen_vis();
}


function starPath(d) {
    return ("M" + (starChartCenterX - starChartFsScale(d.fs) * starArm30DegX) + " "
                + (starChartCenterY + starChartFsScale(d.fs) * starArm30DegY) +
            "L" + (starChartCenterX + starChartWoScale(d.wo) * starArm30DegX) + " "
                + (starChartCenterY + starChartWoScale(d.wo) * starArm30DegY) +
            "L" + starChartCenterX + " "
                + (starChartCenterY - starChartFaScale(d.fa) * starArmLength) +
            "Z")
}


function starChartRedraw(d) {
    if (runOnce) {

        if (typeof d !== "undefined")
            starChartDataset = d.sort(function (a, b) { return b.mass - a.mass });
        else
            starChartDataset = meteoFilter.data.sort(function (a, b) { return b.mass - a.mass });

        if(starChartDataset.length > 512)
            starChartDataset = starChartDataset.slice(0,512);

        var xpto = starChartSvg.selectAll("path")
                .data(starChartDataset);
        starChartSvg.selectAll("path")
                .each(function(d,i){
                    if (i < starChartDataset.length) {
                        var g = starChartDataset[i]
                        var str = starPath(d)
                        
                        d3.select(this)
                                .style("stroke-width", "3")
                                .style("stroke", "orange")
                                .style("opacity",".75")
                                .transition()
                                .duration(250)
                                .attr("d", str)
                    } else {
                        var g = {fs:0, fa:0, wo:0}
                        d3.select(this)
                                .attr("d", starPath(g))
                                .style("stroke-width", "0")
                                .style("stroke", "#ccc")
                    }
                })
    }
}

function gen_vis(){

    var padding = 20;

    var h_tri = 100;
    var w_tri = 100;

    if (!runOnce) {
        starChartSvg = d3.select("#star_chart")
                .append("svg")
                .attr("width", starContainerWidth)
                .attr("height", starContainerHeight)

        //gide line
        starChartSvg.append("line")          // attach a line
                .style("stroke", "#999999")  // colour the line
                .style("stroke-width", "2pt")
                .attr("x1", starChartCenterX - starArm30DegX)     // x1 position of the first end of the line
                .attr("y1", starChartCenterY + starArm30DegY)      // y1 position of the first end of the line
                .attr("x2", starChartCenterX)     // x2 position of the second end of the line
                .attr("y2", starChartCenterY);    // y2 position of the second end of the line

        //gide line
        starChartSvg.append("line")          // attach a line
                .style("stroke", "#999999")  // colour the line
                .style("stroke-width", "2pt")
                .attr("x1", starChartCenterX + starArm30DegX)     // x1 position of the first end of the line
                .attr("y1", starChartCenterY + starArm30DegY)      // y1 position of the first end of the line
                .attr("x2", starChartCenterX)     // x2 position of the second end of the line
                .attr("y2", starChartCenterY);    // y2 position of the second end of the line

        //gide line
        starChartSvg.append("line")                             // attach a line
                .style("stroke", "#999999")                     // colour the line
                .style("stroke-width", "2pt")
                .attr("x1", starChartCenterX)                   // x1 position of the first end of the line
                .attr("y1", starChartCenterY - starArmLength)   // y1 position of the first end of the line
                .attr("x2", starChartCenterX)                   // x2 position of the second end of the line
                .attr("y2", starChartCenterY);                  // y2 position of the second end of the line

        starChartSvg.append("text")         // append text "FS"
                .style("fill", "black")   // fill the text with the colour black
                .attr("x", starChartCenterX - starArm30DegX - starMargin)           // set x position of left side of text
                .attr("y", starChartCenterY + starArm30DegY + starMargin)           // set y position of bottom of text
                .attr("dy", ".35em")           // set offset y position
                .attr("text-anchor", "middle") // set anchor y justification
                .attr("font-size", "8pt")
                .attr("font-weight", "bold")
                .style("fill", starTextColor)
                .text("Fs");          // define the text to display

        starChartSvg.append("text")         // append text "Wo"
                .style("fill", "black")   // fill the text with the colour black
                .attr("x", starChartCenterX + starArm30DegX + starMargin)           // set x position of left side of text
                .attr("y", starChartCenterY + starArm30DegY + starMargin)           // set y position of bottom of text
                .attr("dy", ".35em")           // set offset y position
                .attr("text-anchor", "middle") // set anchor y justification
                .attr("font-size", "8pt")
                .attr("font-weight", "bold")
                .style("fill", starTextColor)
                .text("Wo");          // define the text to display

        starChartSvg.append("text")         // append text "Fe"
                .style("fill", "black")   // fill the text with the colour black
                .attr("x", starChartCenterX)           // set x position of left side of text
                .attr("y", starChartCenterY - starArmLength - starMargin)           // set y position of bottom of text
                .attr("dy", ".35em")           // set offset y position
                .attr("text-anchor", "middle") // set anchor y justification
                .attr("font-size", "8pt")
                .attr("font-weight", "bold")
                .style("fill",starTextColor)
                .text("Fe");          // define the text to display

        //
        //
        //cuidado, verificar se dados tem todos Fa, Fe, Wo preencidos e se % nao e maior que 100
        //
        //


    //    var tip = d3.select("body")
    //            .append("div")
    //            .attr("id", "tip1")
    //            .attr("class", "tooltipp")
    //            .style("display", "none")
    //            .style("position", "absolute")
    //            .style("opacity", 0.98)
    //            .text("Mouse over a line to view information about the meteorite")
    //            .style("display", "none")
    //            .style("left", "" + 25 + "px")
    //            .style("top", "" + 320 + "px")
    //            .style("z-index", "20");

    }


    starChartSvg.selectAll("path")
            .data(starChartDataset)
            .enter()
            .append("path")          // attach a path
            .style("stroke", "#ccc")  // colour the line
            .style("stroke-width","2pt")
            .style("fill", "none")     // remove any fill colour
            //.style("opacity", 0.3)
            .attr("d", function (d) { return starPath(d) })

            .on("mouseover", function(d, i) {
                /*d3.select(this).style("stroke", "red")
                 .style("opacity", 1)
                 .style("fill", "orange");*/ // remove any fill colour
                var x = d3.select(this);
                d3.selectAll(".starChartMouseOver").remove();
                starChartSvg.append("path")          // attach a path
                        .style("stroke", "steelblue")  // colour the line
                        .style("stroke-width","4pt")
                        .style("fill", "none")
                        .attr("class","starChartMouseOver")
                        //.style("opacity", 0.3)
                        .attr("d", this.getAttribute("d"))
                        .on("mouseout", function (d) { d3.select("#tip1").style("display", "none"); d3.select(this).remove() })
                info(i);
            })
    starChartSvg.on("mouseover", function () {
        if (d3.event.srcElement.tagName == "svg") {
            d3.select("#tip1").style("display", "none");
            d3.selectAll(".starChartMouseOver").remove();
        }
    });

    function info(i){
        d3.select("#tip1").style("display","block");
        d3.select("#tip1").text("Meteorite name: " + starChartDataset[i].name + "; " + "Location: " + starChartDataset[i].country + "; " +
                "Year: " + starChartDataset[i].year + "; " + "mass(g): " + starChartDataset[i].mass + "; " +  "Class: " +
                starChartDataset[i].type + ", " + "value: " + starChartDataset[i].cost + "$; " +
                "% de Fe: " + starChartDataset[i].fa + "; " + "% de Fs: " + starChartDataset[i].fs + "; " + "% de Wo: " + starChartDataset[i].wo);
    }
}
