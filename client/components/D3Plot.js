import React, {Component} from 'react'
import {connect} from 'react-redux'
import commitData from './data.commits.json'
import pullData from './data.pulls.json'

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
    const {commits} = this.props
    // const commits = commitData
    const pulls = pullData
    const node = this.plotRef.current

    // SVG PROPERTIES
    const margins = {left: 50, right: 50, top: 40, bottom: 0}
    const width = window.innerWidth - margins.right - margins.left
    const height = window.innerHeight - 2 * 64 - margins.top

    // DEFINE SVG ELEMENT
    const plot = d3
      .select(node)
      .append('svg')
      .attr('height', height)
      .attr('width', width)

    // DEFINE TIME X SCALE
    const minDate = new Date(commits[commits.length - 1].date)
    const maxDate = new Date(commits[0].date)
    let xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, function(d){ return new Date(d.date); }))
      // .domain([minDate, maxDate])
      .range([0, width - 2 * margins.right])

    // DEFINE TIME Y SCALE
    const minTime = new Date('January 1, 2000, 01:00:0')
    const maxTime = new Date('January 1, 2000, 23:59:59')
    let yScale = d3
      .scaleTime()
      .domain([minTime, maxTime])
      .range([height - margins.top, 0])

    // DEFINE AXES
    const xAxis = d3
      .axisBottom(xScale)
      .tickPadding(10)
      .tickSize(10)

    const yAxis = d3
      .axisLeft(yScale)
      .tickPadding(10)
      .tickSize(10)
      .ticks(d3.timeHour)

    // CALL ZOOM
    const zoom = d3.zoom()
      .scaleExtent([1, 100])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomed)

    //
    plot.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width - margins.left - margins.right)
      .attr("height", height - margins.top)
      // .attr(
      //   'transform',
      //   'translate(' + margins.left + ', ' + margins.top / 2 + ')'
      // )

    // DEFINE PLOT GROUP
    const plotGroup = plot
      .append('g')
      .attr(
        'transform',
        'translate(' + margins.left + ', ' + margins.top / 2 + ')'
      )
    plotGroup
      .append('g')
      .attr('id', 'axisY')
      .call(yAxis)
    const gX = plotGroup.append('g').attr('id', 'axisX').call(xAxis)

    // CREATE CIRCLES - COMMITS
    // const circles = [
    //   {date: 'November 7, 2018, 13:25:42', time: 'January 1, 2000, 13:25:42'},
    //   {date: 'October 31, 2018, 13:33:51', time: 'January 1, 2000, 13:33:51'},
    //   {date: 'September 15, 2017, 11:54:57', time: 'January 1, 2000, 11:54:57'}
    // ]

    const commitCircles = plotGroup
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
    const pullCircles = plotGroup
      .selectAll('circle.pulls')
      .data(pulls)
      .enter()
      .append('circle')
      .attr('class', 'commits')
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


      plot.call(zoom).transition()

      function zoomed() {
        const t = d3.event.transform, xt = t.rescaleX(xScale)
        gX.call(xAxis.scale(xt))
        commitCircles
          .attr("cx", function(d) {return xt(new Date(d.date))})
      }
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
    commits: state.repos.commits
  }
}

const mapDispatch = dispatch => {
  return {}
}

export default withStyles(styles)(connect(mapState, mapDispatch)(D3Plot))
