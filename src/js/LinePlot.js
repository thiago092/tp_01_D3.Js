(function (d3) {
  'use strict';

  const dropdownMenu = (selection,props)=>{

      const{
        options,
      onOptionClicked
    } = props;

    let select = selection.selectAll('select').data([null]);
      select = select.enter().append('select')
          .merge(select)
                .on('change',function(){
                    onOptionClicked(this.value);	
                });

    const option =  select.selectAll('option').data(options);
    option.enter().append('option')
              .merge(option)
                .attr('value', d => d)
                .text(d => d);
    
  };

  const scatterPlot = (selection, props) => {
      const{
      xValue,
        xAxisLabel,
        yValue,
         yAxisLabel,
      width,
      height,
      margin,
      data 
    }=props;
    

    const innerwidth = width - margin.right -margin.left;
    const innerheight = height - margin.top - margin.bottom;
    
    //data transformation
    const xScale = d3.scaleTime()
    .domain(d3.extent(data,xValue))
    .range([0,innerwidth])
    .nice();

    const yScale = d3.scaleLinear()
    .domain(d3.extent(data,yValue))
    .range([innerheight,0])
    .nice();
    
    
    //Margin
    const g = selection.selectAll('.container').data([null]);
    const gEnter = g.enter().append('g')
                    .attr('class','container');
    gEnter.merge(g)	
          .attr('transform',`translate(${margin.left},${margin.top})`);
    
    
    //draw Xaxis
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerheight)
        .tickPadding(10);
    
    const xAxisG = g.select('.x-axis');
    const xAxisGEnter = gEnter
         .append('g')
            .attr('class','x-axis');

    xAxisG.merge(xAxisGEnter)
                .attr('transform',`translate(0,${innerheight})`)
          .call(xAxis)	
          .selectAll('.domain').remove();
   
    
    //draw Yaxis
    const yAxis = d3.axisLeft(yScale)
            .tickSize(-innerwidth)
            .tickPadding(10);  
   
     const yAxisG = g.select('.y-axis');
     const yAxisGEnter = gEnter
     .append('g')
             .attr('class','y-axis');
    
     yAxisG.merge(yAxisGEnter)  
                     .call(yAxis) 
                     .selectAll('.domain').remove()
             ;
    
    
    //Axis lable
    const xAxisLabelText = xAxisGEnter
                .append('text')
                .attr('class','axis-label')
              .attr('y',40)
                .attr('fill','black')
                .merge(xAxisG.select('axis-label'))				
                        .attr('x',innerwidth/2)
                        .text(xAxisLabel);
    
    
    const yAxisLabelText = yAxisGEnter
                .append('text')
                .attr('class','axis-label')
              .attr('y',-43)
                .attr('fill','black')
                .attr('transform',`rotate(-90)`)
                .attr('text-anchor','middle')
                .merge(yAxisG.select('axis-label'))
                        .attr('x',-innerheight/2)
                        .text(yAxisLabel);
   
    
    //draw path  
      const lineGen = d3.line()
        .x(d=>xScale(xValue(d)))
        .y(d=>yScale(yValue(d)))
        .curve(d3.curveBasis);
        
    const lineG = g.select('.line-path');
    const lineGEnter = gEnter.append('path')
        .attr('class','line-path');
     
    lineG.merge(lineGEnter)
    .transition().duration(1000)
         .attr('d',lineGen(data))
       ;
    
    
  };

  const svg = d3.select('svg#line');


  let data;
  let yColumn;


  //data handelling
  const render = (width, height) =>{  

  
    //get column from dropdown menu and render plot
    const OnYColumnClicked = column => {
        yColumn = column;
        render(width, height);
    };

    //Invoke menu component
    d3.select('#menus_line')
    .call(dropdownMenu,  {
          options: data.columns,
      onOptionClicked: OnYColumnClicked
      });
    
    //Invoke scatter plot component
    svg.call(scatterPlot,{
        xValue: d => d.month,
        xAxisLabel : 'Month',
         yValue : d=>d[yColumn],
      yAxisLabel : 'Price',
         margin : {top:15, right:35, bottom:50, left:120},
      width:width,
      height: height,
      data
    });
    
  };

  //get data and pass to data handelling


  d3.csv('https://vizhub.com/norangai/datasets/price.csv').then(loadedData=>{
         data = loadedData;
    
   data.forEach(d => {
      d.month = new Date(d.month);
      d.price1 =  Number(d.price1.trim().slice(1));
      d.price2 = Number(d.price2.trim().slice(1));
     
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
