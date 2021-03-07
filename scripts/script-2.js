const margins = {t: 60, r: 60, b: 60, l: 60};
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
    data.forEach(d => {
        d.population = +d.population;
        // d.year = +d.year;

    });

    console.log(data[0]);


    draw(data);
});



// function parseData(d) {
// }

function draw(data) {

    // data = d3.group(data, d => d.country_name);
    // data = Array.from(data).sort((d,e) => d[0] > e[0]);
    // console.log(data.map(d => d[0]));

    // var nested_data = d3.nest() // nest function allows to group the calculation per level of a factor
    //     .key(function(d) { return d.country_name;})
    //     .entries(data);

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
        .domain([yearExtent.min, yearExtent.max])
        .range([0, size.w]);
    svg.append("g")
        .attr("transform", "translate(80," + size.h + ")")
        .call(d3.axisBottom(scaleX));

    scaleY = d3.scaleLinear()
        .domain([popExtent.min, popExtent.max])
        .range([size.h, 0]);
    svg.append("g")
        .attr("transform", "translate(80,0)")
        .call(d3.axisLeft(scaleY));



    // set up colors
    var res = nested_data.map(function(d){ return d[0] }) // list of group names
    console.log(res);

    var color = d3.scaleOrdinal()
      .domain(res)
      .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
  

    // make line function
    // let pathFn = d3.line()
        // .x(d => scaleX(d.year))
        // .y(d => scaleY(d.population));


    // // draw line
    // path = svg.selectAll('path')
    //     // .data([1])
    //     // .join('path')
    //     .datum(data)
    //     .attr('d', d => pathFn(d));

    // svg.append("path")
    //   .data(nested_data)
    //   .attr("fill", "none")
    //   .attr("stroke", "steelblue")
    //   .attr("stroke-width", 1.5)
    //   .attr("d", d3.line()
    //     .x(d => { return scaleX(+d.year) })
    //     .y(d => { return scaleY(+d.population) }) );


    svg.selectAll(".line")
        .append("g")
        .attr("class", "line")
        .data(nested_data)
        .enter()
        .append("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return scaleX(+d.year); })
                    .y(function(d) { return scaleY(+d.population); })
                    (d.values)
        });


};





// references:
// -- https://www.d3-graph-gallery.com/graph/line_basic.html
// -- https://www.d3-graph-gallery.com/graph/line_several_group.html