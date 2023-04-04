import './App.css';
import * as d3 from 'd3';
import React, {useState, useEffect, useRef} from "react"
import { axisBottom, axisLeft } from 'd3';

function App() {
 const [dataset, setDataset] = useState([]);

 useEffect(() => {

  getData();

 }, [])

 async function getData() {
  try {
    await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then((response) => response.json())
    .then((data) => setDataset(data));
  }
  catch(error) {
    console.log(error);
  }
 }

 console.log(dataset)


  return (
    <div className="App">
      <header className="App-header">
        <ScatterPlot title="Doping in Professional Bicycle Racing" data={dataset}></ScatterPlot>
      </header>
    </div>
  );
}

const ScatterPlot = ({title, data}) => {


const svgRef = useRef();

//map the data into new array
const dataTime = data.map((item) => item.Time);
const dataYear = data.map((item) => new Date(item.Year, 1, 1));

// console.log(dataTime);
console.log(dataYear);
// console.log(new Date())

//declaring constant variables
const h = 550;
const w = 1180;
const topPadding = 20;
const bottomPadding = 30;
const leftPadding = 70;
const rightPadding = 80;
const usableHeight = h - topPadding - bottomPadding;

const timeArr = dataTime.map((item) => {
 const timeSplit = item.split(":");
 return (
  new Date(Date.UTC(1998, 2, 10, 0, parseInt(timeSplit[0]), parseInt(timeSplit[1]))
 ))
})
console.log(timeArr);
// console.log(timeArr[0][1]);
// const dateArr = timeArr.map((item) => {
//   return (new Date(Date.UTC(1998, 2, 10, 0, parseInt(timeArr[item][0]), parseInt(timeArr[item][1]))))
// });
// console.log(dateArr);

// const d = new Date(1998, 2, 0, Number(timeArr[0][0]), Number(timeArr[0][1]));
// console.log(d);

//formattimg time for the axes
const timeFormat = d3.timeFormat("%M:%S");

//declaring the y and x scale
const yScale = d3.scaleTime().domain([d3.min(timeArr), d3.max(timeArr)]).range([usableHeight, 0]);
const xScale = d3.scaleTime().domain([d3.min(dataYear), d3.max(dataYear)]).range([leftPadding - 50, w - rightPadding]);
// const xScale = d3.scaleLinear().domain([d3.min(dataYear), d3.max(dataYear)]).range([leftPadding, w - rightPadding]);
const yAxis = axisLeft(yScale).tickFormat(timeFormat);
const xAxis = axisBottom(xScale);

const tooltip = d3.select(".App-header")
                     .append("div")
                     .attr("id", "tooltip")
                     .style("opacity", 0);

const svg = d3.select(svgRef.current)
              .attr("height", h)
              .attr("width", w)
              .style("background", "white")
              .style("margin", "auto");


      svg.append("g")
         .attr("id", "y-axis")
         .attr("transform", `translate(${leftPadding}, ${topPadding })`)
         .call(yAxis);

      svg.append("g")
         .attr("id", "x-axis")
         .attr("transform", `translate(${leftPadding}, ${h - bottomPadding})`)
         .call(xAxis);

      svg.selectAll('circle')
         .data(data)
         .enter()
         .append("circle")
         .attr("class", "dot")
         .attr("cx", (d, i) => leftPadding + xScale(dataYear[i]))
         .attr("cy", (d, i) => topPadding + yScale(timeArr[i]))
         .attr("r", (d) => 5)
         .attr("data-xvalue", (d, i) => d.Year)
         .attr("data-yvalue", (d, i) => timeArr[i])
         .attr("data-time", (d, i) => timeFormat(timeArr[i]))
         .attr("data-name", (d) => d.Name)
         .attr("data-nationality", (d) => d.Nationality)
         .attr("data-doping", (d) => d.Doping)
         .style("fill", (d) => Boolean(d.Doping) === false ? "#25A18E" : "#C20114" )
         .style("stroke", "black")
         .on("mouseover", function(event) {
            tooltip.html(this.getAttribute("data-name") + ": " + this.getAttribute("data-nationality") + "<br> Year:" + this.getAttribute("data-xvalue") + " Time: " + this.getAttribute("data-time") + " mins"
            + "<br>" + this.getAttribute("data-doping"))
                  .attr('data-year', this.getAttribute("data-xvalue"))
                  .style('left', `${event.pageX - 60}px`)
                  .style('top', `${event.pageY}px`);
            tooltip.transition()
                  .duration(100)
                  .style("opacity", 0.9);
          })
        .on('mouseout', function() {
            tooltip.html('');
            tooltip.transition()
                .duration(100)
                .style('opacity', 0);
        })

      // Handmade legend
      svg.append("rect").attr("x",w - rightPadding-165).attr("y",130).style("fill", "#25A18E").attr("height", 10).attr("width", 10);
      svg.append("rect").attr("x",w - rightPadding-165).attr("y",160).style("fill", "#C20114").attr("height", 10).attr("width", 10);
      svg.append("text").attr("x", w - rightPadding-152).attr("y", 135).text("No doping allegations").style("font-size", "12px").attr("alignment-baseline","middle").attr("id", "legend");
      svg.append("text").attr("x", w - rightPadding-152).attr("y", 165).text("Rider with doping allegation").style("font-size", "12px").attr("alignment-baseline","middle").attr("id", "legend");

      //y-axis title
      svg.append("text")
         .attr("transform", `translate(${leftPadding - 45}, ${h/2}), rotate(-90)`)
        //  .attr("x", w - rightPadding-152).attr("y", 135)
         .text("Time in minutes")
         .style("font-size", "15px")
        //  .style("color", "black")

  return (
    <React.Fragment>
      <title id="title">{title}</title>
      <h1>{title}</h1>
      <svg ref={svgRef}></svg>
      {/* <h5>Created by Ammarul Mubsyir</h5> */}
      <h6><a href="https://github.com/mrlzchry/Scatter-Plot/tree/main/src">Source Code</a></h6>
    </React.Fragment>
  )
}

export default App;
