import React, {Component} from 'react'
import {connect} from 'react-redux'
import commitData from './data.commits.json'
import pullData from './data.pulls.json'
import {plotFunction} from './plotFunction'

import * as d3 from 'd3'

// MATERIAL UI IMPORTS
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: window.innerWidth,
    height: window.innerHeight - 2 * 64
  }
})

class D3Plot extends Component {
  constructor(props) {
    super(props)
    this.plotRef = React.createRef()
  }

  componentDidMount() {
    console.log('PLOT FUNCTION', plotFunction)
    let {commits, pulls} = this.props
    commits = commits[0] ? commits : []
    pulls = pulls[0] ? pulls : []
    const node = this.plotRef.current
    plotFunction(node, commits, pulls)
    // // const commits = commitData
    // // const pulls = pullData

    // // SVG PROPERTIES
    // const margins = {left: 50, right: 50, top: 40, bottom: 0}
    // const width = window.innerWidth - margins.right - margins.left
    // const height = window.innerHeight - 2 * 64 - margins.top

    // // DEFINE SVG ELEMENT
    // const plot = d3
    //   .select(node)
    //   .append('svg')
    //   .attr('height', height)
    //   .attr('width', width)

    // // DEFINE TIME X SCALE
    // const commitMax = new Date(commits[0].date)
    // const commitMin = new Date(commits[commits.length - 1].date)
    // const pullMax = new Date(pulls[0].dateCreated)
    // const pullMin = new Date(pulls[pulls.length - 1].dateCreated)

    // const minDate = new Date(Math.min.apply(null, [commitMin, pullMin]))
    // const maxDate = new Date(Math.max.apply(null,[commitMax, pullMax]))
    // console.log(minDate, maxDate)
    // let xScale = d3
    //   .scaleTime()
    //   .domain([minDate, maxDate])
    //   .range([0, width - 2 * margins.right])

    // // DEFINE TIME Y SCALE
    // const minTime = new Date('January 1, 2000, 01:00:0')
    // const maxTime = new Date('January 1, 2000, 23:59:59')
    // let yScale = d3
    //   .scaleTime()
    //   .domain([minTime, maxTime])
    //   .range([height - margins.top, 0])

    // // DEFINE AXES
    // const xAxis = d3
    //   .axisBottom(xScale)
    //   .tickPadding(10)
    //   .tickSize(10)

    // const yAxis = d3
    //   .axisLeft(yScale)
    //   .tickPadding(10)
    //   .tickSize(10)
    //   .ticks(d3.timeHour)

    // // CALL ZOOM
    // const zoom = d3
    //   .zoom()
    //   .scaleExtent([1, 100])
    //   .translateExtent([[0, 0], [width, height]])
    //   .extent([[0, 0], [width, height]])
    //   .on('zoom', zoomed)

    // // DEFINE AREA TO CLIP
    // plot
    //   .append('defs')
    //   .append('clipPath')
    //   .attr('id', 'clip')
    //   .append('rect')
    //   .attr('width', width - margins.left - margins.right)
    //   .attr('height', height - margins.top)

    // // DEFINE PLOT GROUP
    // const plotGroup = plot
    //   .append('g')
    //   .attr(
    //     'transform',
    //     'translate(' + margins.left + ', ' + margins.top / 2 + ')'
    //   )
    // plotGroup
    //   .append('g')
    //   .attr('id', 'axisY')
    //   .call(yAxis)
    // const gX = plotGroup
    //   .append('g')
    //   .attr('id', 'axisX')
    //   .call(xAxis)

    // const commitCircles = plotGroup
    //   .selectAll('circle.commits')
    //   .data(commits)
    //   .enter()
    //   .append('circle')
    //   .attr('class', 'commits')
    //   .attr('cx', function(d, i) {
    //     return xScale(new Date(d.date))
    //   })
    //   .attr('cy', function(d, i) {
    //     return yScale(new Date(d.time))
    //   })
    //   .attr('r', '5px')
    //   .style('fill', '#0096FF')
    //   .style('opacity', 0.5)
    //   .style('stroke', '#011993')
    //   .style('stroke-width', '1px')

    // // CREATE CIRCLES - PULLS
    // const pullCircles = plotGroup
    //   .selectAll('circle.pulls')
    //   .data(pulls)
    //   .enter()
    //   .append('circle')
    //   .attr('class', 'commits')
    //   .attr('cx', function(d, i) {
    //     return xScale(new Date(d.dateCreated))
    //   })
    //   .attr('cy', function(d, i) {
    //     return yScale(new Date(d.timeCreated))
    //   })
    //   .attr('r', '5px')
    //   .style('fill', '#FFB20E')
    //   .style('opacity', 0.5)
    //   .style('stroke', '#E8750B')
    //   .style('stroke-width', '1px')

    // // CALL ZOOM ON PLOT
    // plot.call(zoom).transition()

    // // ZOOM FUNCTION
    // function zoomed() {
    //   const t = d3.event.transform,
    //     xt = t.rescaleX(xScale)
    //   gX.call(xAxis.scale(xt))
    //   commitCircles.attr('cx', function(d) {
    //     return xt(new Date(d.date))
    //   })
    //   pullCircles.attr('cx', function(d) {
    //     return xt(new Date(d.dateCreated))
    //   })
    // }
  }

  componentShouldMount() {
    // return false...?
  }

  componentDidUpdate() {
    const node = this.plotRef.current
    console.log('UPDATED', node)
    d3.select(node)
  }

  render() {
    const {classes} = this.props
    return <div className={classes.root} ref={this.plotRef} id="plot" />
  }
}

const mapState = state => {
  return {
    commits: state.repos.commits,
    pulls: state.repos.pulls
  }
}

const mapDispatch = dispatch => {
  return {}
}

export default withStyles(styles)(connect(mapState, mapDispatch)(D3Plot))
