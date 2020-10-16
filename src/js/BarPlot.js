(function (d3) {
  'use strict';

  const dropdownMenu = (selection, props) => {
    const {
      options,
      onOptionClicked,
      selectedOption
    } = props;
    
    let select = selection.selectAll('select').data([null]);
    select = select.enter().append('select')
      .merge(select)
        .on('change', function() {
          onOptionClicked(this.value);
    });
    
    const option = select.selectAll('option').data(options);
    option.enter().append('option')
      .merge(option)
        .attr('value', d => d)
        .property('selected', d => d === selectedOption)
        .text(d => d);
  };

  const barChart = (selection, props) => {
    const {
      xValue,
      xAxisLabel='Graduate Program Category',
      yValue,
      yAxisLabel,
      margin,
      width,
      height,
      data
    } = props;
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yValue)])
      .range([innerHeight, 0]);
    
    const xScale = d3.scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .padding(0.1);
    
    const g = selection.selectAll('.container').data([null]);
    const gEnter = g
      .enter().append('g')
        .attr('class', 'container');
    gEnter
      .merge(g)
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // y axis
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
      .append('g')
        .attr('class', 'y-axis');
    
    yAxisG
      .merge(yAxisGEnter)
      .call(yAxis)
      .selectAll('.domain').remove()
      .selectAll('text');
    
    const yAxisLabelText = yAxisGEnter
      .append('text')
        .attr('class', 'axis-label')
        .attr('y', -100)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
      .merge(yAxisG.select('.axis-label'))
        .attr('x', -innerHeight/2);
        //.text(yAxisLabel);
    
    // x axis
    const xAxis = d3.axisBottom(xScale)
      .tickSize(0);
    
    const xAxisG = g.select('.x-axis');
    const xAxisGEnter = gEnter
      .append('g')
        .attr('class', 'x-axis');
    xAxisG
      .merge(xAxisGEnter)
        .attr('transform', `translate(-10, ${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
          .attr('text-anchor', 'start')
          .attr('transform', `rotate(-90)`)
          .attr('font-weight', 'bold');
    
    const xAxisLabelText = xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 30)
      .attr('fill', 'black')
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xAxisLabel);
    
    const rects = g.merge(gEnter)
      .selectAll('rect').data(data);  rects
      .enter().append('rect')
        .attr('x', function(d, i) {
          return xScale.bandwidth() * i;
        })
        .attr('y', innerHeight)
      .merge(rects)
      .transition().duration(1000)
        .attr('x', d => xScale(xValue(d)))
        .attr('y', d => yScale(yValue(d)))
        .attr('height', d => innerHeight - yScale(yValue(d)))
        .attr('width', xScale.bandwidth());
  };

  const svg = d3.select('svg#barplot');



  let data;
  let yColumn;

  const render = (width,hedth) => {

    

    const onYColumnClicked = column => {
      yColumn = column;
      render(width,hedth);
    };
    
    d3.select('#y-menus-bar')
      .call(dropdownMenu, {
        options: data.columns.slice(1),
        onOptionClicked: onYColumnClicked,
        selectedOption: yColumn
      });

    
    
    
    svg.call(barChart, {
      yValue: d => d[yColumn],
      yAxisLabel: yColumn,
      xValue: d => d.Major_category,
      margin: { top: 20, right: 40, bottom: 100, left: 100 },
      width:width,
      height:hedth,
      data
      
    });
  };

  d3.csv('https://vizhub.com/ilovemanu/datasets/grad_by_cate.csv').then(loadedData => {
    
    data = loadedData;
    data.forEach(d => {
      
      d.Grad_total = +d.Grad_total;
      d.Grad_employed = +d.Grad_employed;
      d.Grad_unemployed = +d.Grad_unemployed;
      d.Grad_unemployment_rate = +d.Grad_unemployment_rate;
      d.Grad_median = +d.Grad_median;
      d.Grad_full_time_year_round = +d.Grad_full_time_year_round;
      d.Grad_P25 = +d.Grad_P25;
      d.Grad_P75 = +d.Grad_P75;
      
    });
    yColumn = data.columns[1];
   
    $("#update").on("click", () => {
      var width = parseInt($("#width").val()),
          height = parseInt($("#height").val());

          console.log(width);
  
         render(width,height);
      
  });
       
  });

}(d3));
