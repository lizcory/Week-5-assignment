const margins = {t: 60, r: 60, b: 60, l: 80};
const SVGsize = {w: window.innerWidth*0.8, h: window.innerHeight*0.8};
const size = {
    w: SVGsize.w - margins.l - margins.r,
    h: SVGsize.h - margins.t - margins.b
};
const svg = d3.select('svg')
    .attr('width', SVGsize.w)
    .attr('height', SVGsize.h);
const containerG = svg.append('g')
    .attr('transform', `translate(${margins.l}, ${margins.t})`);


let data, scaleY, scaleX, scaleDuration; 

d3.csv('data/population_clean.csv')
.then(function(d) {
    data = d;
    console.log(data);

    //filter for NAs

    data.forEach(d => {
        d.population = +d.population;
        // d.year = +d.year;

    });

    console.log(data[0]);


    draw(data);
});


function draw(data) {

    var nested_data = d3.group(data, d => d.country_name);
    nested_data = Array.from(nested_data);
    console.log(nested_data);

    // define extents
    var popExtent = {
        max: d3.max(data, function(d){ return +d.population; }),
        min: d3.min(data, function(d){ return +d.population; })
    };
    console.log(popExtent);

    var yearExtent = {
        max: d3.max(data, function(d){ return +d.year; }),
        min: d3.min(data, function(d){ return +d.year; })
    };



    // define scales & append axes
    scaleX = d3.scaleLinear()
        .domain([yearExtent.min, yearExtent.max+1])
        .range([0, size.w]);
    svg.append("g").classed("x_axis",true)
        // .attr("transform", "translate("+margins.l +"," + (size.h + margins.t) + ")")
        .attr("transform", `translate(${margins.l}, ${size.h + margins.t})`)
        .call(d3.axisBottom(scaleX).tickFormat(d3.format("d")));


    scaleY = d3.scaleLinear()
        .domain([popExtent.min, popExtent.max])
        .range([size.h, 0]);
    svg.append("g")
        // .attr("transform", "translate("+ margins.l + "," + margins.t +")")
        .attr("transform", `translate(${margins.l}, ${margins.t})`)
        .call(d3.axisLeft(scaleY));



    // set up colors
    var res = nested_data.map(function(d){ return d[0] }) // list of group names
    console.log(res);

    var color = d3.scaleOrdinal()
      .domain(res)
    //   .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
    .range(d3.schemeSet3);



    containerG.selectAll(".line")
        .append("g")
        .attr("class", "line")
        .data(nested_data)
        .enter()
        .append("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "0 10000")
            .attr("d", function(d){

                // console.log([d, d.values]);

                return d3.line()
                    .x(function(d) { return scaleX(+d.year); })
                    .y(function(d) { return scaleY(+d.population); })
                    (d[1])

                })
            .transition()
            .delay((d,i) => i*100)
            .duration(1000)
            .attr("stroke-dasharray", "10000 0");

};





// references:
// -- https://www.d3-graph-gallery.com/graph/line_basic.html
// -- https://www.d3-graph-gallery.com/graph/line_several_group.html