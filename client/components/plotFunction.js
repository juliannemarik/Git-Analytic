import * as d3 from 'd3'
import {xDomainFunc, yDomainFunc} from './helperFunctions'
import d3Tip from 'd3-tip'


// CREATE ORIGINAL PLOT
// ----------------------
export const createPlot = (node, commits, pulls) => {
  // RE-DEFINE COMMIS & PULLS
  commits = commits.array
  pulls = pulls.array

  // SVG PROPERTIES
  const margins = {left: 50, right: 50, top: 40, bottom: 0}
  const width = window.innerWidth - margins.right - margins.left
  const height = window.innerHeight - 2 * 64 - margins.top
  let circleRadius = '5px'

  // DEFINE SVG ELEMENT
  let plot = d3
    .select(node)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('class', 'plot')

  // DEFINE TIME X SCALE
  let xDomain = xDomainFunc(commits, pulls)
  let xScale = d3
    .scaleTime()
    .domain(xDomain)
    .range([0, width - 2.2 * margins.right])

  // DEFINE TIME Y SCALE
  let yDomain = yDomainFunc()
  let yScale = d3
    .scaleTime()
    .domain(yDomain)
    .range([height - 1.1 * margins.top, 0])

  // DEFINE AXES
  let xAxis = d3
    .axisBottom(xScale)
    .tickPadding(10)
    .tickSize(10)

  let yAxis = d3
    .axisRight(yScale)
    .tickPadding(10)
    .tickSize(10)
    .ticks(d3.timeHour)

  // CALL ZOOM
  const zoom = d3
    .zoom()
    .scaleExtent([1, 100])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed)

  // DEFINE AREA TO CLIP
  plot
    .append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width - margins.left - margins.right)
    .attr('height', height - margins.top)
    .attr(
      'transform',
      'translate(' + margins.left + ', ' + margins.top / 2 + ')'
    )

  // DEFINE PLOT GROUP
  let plotGroup = plot
    .append('g')
    .attr('class', 'g')
    .attr(
      'transform',
      'translate(' + margins.left + ', ' + margins.top / 2 + ')'
    )
  plotGroup
    .append('g')
    .attr('id', 'axisY')
    .call(yAxis)
  let gX = plotGroup
    .append('g')
    .attr('id', 'axisX')
    .call(xAxis)

  // CREATE CIRCLES - PULLS
  let commitCircles = plotGroup
    .selectAll('circle.commits')
    .data(commits)
    .enter()
    .append('circle')
    .attr('class', 'commits')
    .attr('cx', function(d, i) {
      return xScale(new Date(d.date))
    })
    .attr('cy', function(d, i) {
      return yScale(new Date(d.time))
    })
    .attr('r', circleRadius)
    .style('fill', '#0096FF')
    .style('opacity', 0.5)
    .style('stroke', '#011993')
    .style('stroke-width', '1px')


  // CREATE CIRCLES - PULLS
  let pullCircles = plotGroup
    .selectAll('circle.pulls')
    .data(pulls)
    .enter()
    .append('circle')
    .attr('class', 'pulls')
    .attr('cx', function(d, i) {
      return xScale(new Date(d.dateCreated))
    })
    .attr('cy', function(d, i) {
      return yScale(new Date(d.timeCreated))
    })
    .attr('r', circleRadius)
    .style('fill', '#FFB20E')
    .style('opacity', 0.5)
    .style('stroke', '#E8750B')
    .style('stroke-width', '1px')

  // CALL ZOOM ON PLOT
  plot.call(zoom).transition()

  // ZOOM FUNCTION
  function zoomed() {
    let t = d3.event.transform,
      xt = t.rescaleX(xScale)
    gX.call(xAxis.scale(xt))
    commitCircles.attr('cx', function(d) {
      return xt(new Date(d.date))
    })
    pullCircles.attr('cx', function(d) {
      return xt(new Date(d.dateCreated))
    })
  }

  // UPDATE EXISTING PLOT
  // ----------------------
  return function update(updatedCommits, updatedPulls) {
    // RE-DEFINE COMMITS & PULLS
    updatedCommits = updatedCommits.array
    updatedPulls = updatedPulls.array

    // RE-DEFINE X-DOMAIN
    xDomain = xDomainFunc(updatedCommits, updatedPulls)
    xScale.domain(xDomain)

    // MAKE CHANGES TO CIRCLES
    plot.select('#axisX').call(xAxis)

    commitCircles = plotGroup.selectAll('circle').data(updatedCommits)
    pullCircles = plotGroup.selectAll('circle.pulls').data(updatedPulls)

    const enter = commitCircles
      .enter()
      .append('circle')
      .style('fill', 'white')
      .style('opacity', 0)
    const enterPulls = pullCircles
      .enter()
      .append('circle')
      .style('fill', 'white')
      .style('opacity', 0)
    commitCircles.exit().remove()

    commitCircles = commitCircles
      .merge(enter)
      // .transition()
      // .duration(1000)
      .attr('cx', function(d, i) {
        return xScale(new Date(d.date))
      })
      .attr('cy', function(d, i) {
        return yScale(new Date(d.time))
      })
      .attr('r', circleRadius)
      .style('fill', '#0096FF')
      .style('opacity', 0.5)
      .style('stroke', '#011993')
      .style('stroke-width', '1px')
      .on('mouseover', () => {console.log('MOUSE OVER')})




    pullCircles = pullCircles
      .merge(enterPulls)
      // .transition()
      // .duration(1000)
      .attr('cx', function(d, i) {
        return xScale(new Date(d.dateCreated))
      })
      .attr('cy', function(d, i) {
        return yScale(new Date(d.timeCreated))
      })
      .attr('r', circleRadius)
      .style('fill', '#FFB20E')
      .style('opacity', 0.5)
      .style('stroke', '#E8750B')
      .style('stroke-width', '1px')

  }
}
