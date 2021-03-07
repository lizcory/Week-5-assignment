d3.csv('data/population_clean.csv').then(function(d) {
    
    // let data, scaleY, scaleX, scaleDuration;
    
    data = d;
    console.log(data);

    // data.forEach(d => {
    //     d.population = +d.population
    //     d.year = +d.year

    // })

    const margins = {t: 50, r: 50, b: 50, l: 50};
    const SVGsize = {w: window.innerWidth*0.8, h: window.innerHeight*0.8};
    const size = {
        w: SVGsize.w - margins.l - margins.r,
        h: SVGsize.h - margins.t - margins.b
    };

    var svg = d3.select('svg')
        .attr('width', SVGsize.w)
        .attr('height', SVGsize.h);


    var us_data = data.filter(function(d) {
        return d.country_name === "United States";
    });
    
    var popExtent = {
        max: d3.max(us_data, function(d){ return +d.population; }),
        min: d3.min(us_data, function(d){ return +d.population; })
    }
    console.log(popExtent);

    var yearExtent = {
        max: d3.max(us_data, function(d){ return +d.year; }),
        min: d3.min(us_data, function(d){ return +d.year; })
    }


    // const containerG = svg.append('g')
    //     .attr('transform', `translate(${margins.l}, ${margins.t})`);



    // function parseData(d) {
    // }
    

    // nested = nest()
    //     .key(d => d.country_name)
    //     .entries(data);

    // console.log(nested);





    // function draw(data) {

    // Labeling
    const title = "Population by Country";
    const xAxisLabel = "Year";
    const yAxisLabel = "Population";


    //Scales
    scaleX = d3.scaleLinear()
        .domain([yearExtent.min, yearExtent.max])
        .range([0, size.w]);

    scaleY = d3.scaleLinear()
        .domain([0, popExtent.max])
        .range([size.h, 0]);

    var line = d3.line()
        .x(function(d) { return scaleX(d.year); })
        .y(function(d) { return scaleY(d.population); })
        .curve(d3.curveLinear);

    // Axes
    var xAxis = d3.axisBottom(scaleX)
        .tickSize(-size.h)
        .tickPadding(10)

    var yAxis = d3.axisLeft(scaleY)
        .tickSize(-size.w)
        .tickPadding(10);

    // yAxisG = g.append('g').call(yAxis);
    // yAxisG.selectAll(".domain").remove();

    // Axis labels....
    /////

    // xAxisG = g.append('g').call(xAxis)
    //     .attr('transform', `translate(0,${size.h})`);


    // Make line
    var path = svg.append("path")
        .datum(us_data)
            .attr("d", function(d) { return line(+d.population); })
            .attr("stroke","sandybrown")
            .attr("fill","none")
            .attr("stroke-width",2);

    
    // nested = nest()
        // .key(d => d.country_name)
        // .entries(data);

    // console.log(nested);

        
});