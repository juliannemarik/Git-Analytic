import * as d3 from 'd3'

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

  // DEFINE SVG ELEMENT
  let plot = d3
    .select(node)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('class', 'plot')

  // DEFINE TIME X SCALE
  let commitMax = commits.length
    ? new Date(commits[0].date)
    : new Date('January 1, 2018')
  let commitMin = commits.length
    ? new Date(commits[commits.length - 1].date)
    : new Date('January 1, 2017')
  let pullMax = pulls[0] ? new Date(pulls[0].dateCreated) : commitMax
  let pullMin = pulls[pulls.length - 1]
    ? new Date(pulls[pulls.length - 1].dateCreated)
    : commitMin

  let minDate = new Date(Math.min.apply(null, [commitMin, pullMin]))
  let maxDate = new Date(Math.max.apply(null, [commitMax, pullMax]))
  let xScale = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([0, width - 2.2 * margins.right])

  // DEFINE TIME Y SCALE
  const minTime = new Date('January 1, 2000, 01:00:0')
  const maxTime = new Date('January 1, 2000, 23:59:59')
  let yScale = d3
    .scaleTime()
    .domain([minTime, maxTime])
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

  let commitCircles = plot
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
    .attr('r', '5px')
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
    .attr('r', '5px')
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

    // RE-DEFINE X SCALE
    commitMax = updatedCommits.length
      ? new Date(updatedCommits[0].date)
      : new Date('January 1, 2018')
    commitMin = updatedCommits.length
      ? new Date(updatedCommits[updatedCommits.length - 1].date)
      : new Date('January 1, 2017')
    pullMax = updatedPulls[0]
      ? new Date(updatedPulls[0].dateCreated)
      : commitMax
    pullMin = updatedPulls[updatedPulls.length - 1]
      ? new Date(updatedPulls[updatedPulls.length - 1].dateCreated)
      : commitMin

    minDate = new Date(Math.min.apply(null, [commitMin, pullMin]))
    maxDate = new Date(Math.max.apply(null, [commitMax, pullMax]))

    xScale.domain([minDate, maxDate])

    // MAKE THE CHANGES
    plot.select('#axisX').call(xAxis)
    commitCircles = plotGroup.selectAll('circle').data(updatedCommits)

    console.log("UPDATED PULLS", updatedPulls)
    pullCircles = plotGroup.selectAll('circle.pulls').data(updatedPulls)

    const enter = commitCircles.enter().append('circle')
    const enterPulls = pullCircles.enter().append('circle')

    const exit = commitCircles.exit().remove()

    commitCircles = commitCircles
      .merge(enter)
      .attr('cx', function(d, i) {
        return xScale(new Date(d.date))
      })
      .attr('cy', function(d, i) {
        return yScale(new Date(d.time))
      })
      .attr('r', '5px')
      .style('fill', '#0096FF')
      .style('opacity', 0.5)
      .style('stroke', '#011993')
      .style('stroke-width', '1px')

    pullCircles = pullCircles
      .merge(enterPulls)
      .attr('cx', function(d, i) {
        return xScale(new Date(d.dateCreated))
      })
      .attr('cy', function(d, i) {
        return yScale(new Date(d.timeCreated))
      })
      .attr('r', '5px')
      .style('fill', '#FFB20E')
      .style('opacity', 0.5)
      .style('stroke', '#E8750B')
      .style('stroke-width', '1px')
  }
}
