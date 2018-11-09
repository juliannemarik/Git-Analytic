import React, {Component} from 'react'
import {connect} from 'react-redux'
import data from './data.json'
import * as d3 from 'd3'

// MATERIAL UI IMPORTS
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: window.innerWidth,
    height: window.innerHeight - 2*64,
  },
})

class D3Plot extends Component {
  constructor(props) {
    super(props);
    this.plotRef = React.createRef();
  }

  componentDidMount() {
    // const {commits} = this.props
    const commits = data
    const node = this.plotRef.current

    // SVG PROPERTIES
    const margins = {left: 50, right: 50, top: 40, bottom: 0}
    const width = window.innerWidth - margins.right - margins.left
    const height = window.innerHeight - 2*64 - margins.top

    // DEFINE SVG ELEMENT
    const plot = d3.select(node).append("svg")
      .attr("height", height)
      .attr("width", width)

    // DEFINE TIME X SCALE
    const minDate = new Date(commits[commits.length-1].date)
    const maxDate = new Date(commits[0].date)
    console.log(minDate, maxDate)
    let xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, width-2*margins.right])

    // DEFINE TIME Y SCALE
    const minTime = new Date("January 1, 2000, 00:00:00")
    const maxTime = new Date("January 2, 2000, 00:00:00")
    let yScale = d3.scaleTime()
      .domain([minTime, maxTime])
      .range([height-margins.top, 0])

    // DEFINE AXES
    let xAxis = d3.axisBottom(xScale).tickPadding(10).tickSize(10)
    let yAxis = d3.axisLeft(yScale).tickPadding(10).tickSize(10)

    // DEFINE PLOT GROUP
    let plotGroup = plot.append("g")
      .attr("transform", "translate("+margins.left+", "+margins.top/2+")")
      plotGroup.append("g")
      .call(yAxis)
      plotGroup.append("g")
      .call(xAxis)

    // CREATE CIRCLES - COMMITS
    const circles = [0, 1, 2]
    console.log(circles)
    // plot.selectAll("circle.first")
    //   .data(circles)
    //   .enter().append("circle")
    //     .attr('class', 'first')
    //     .attr('cx', function(d, i){return 10 * (i+1)})
    //     .attr('cy', '100px')
    //     .attr('r', '4px')
    //     .attr('fill', 'blue')
  }

  componentShouldMount() {
    // return false...?
  }

  componentDidUpdate() {
    const node = this.plotRef.current
    console.log('UPDATED', node)
    d3.select(node)
  }

  render () {
    const { classes } = this.props
    return (
      <div className = {classes.root} ref={this.plotRef} id="plot"/>
    )
  }
}

const mapState = state => {
  return {}
}

const mapDispatch = dispatch => {
  return {}
}

export default withStyles(styles)(connect(mapState, mapDispatch)(D3Plot))
