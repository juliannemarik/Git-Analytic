import React, {Component} from 'react'
import {connect} from 'react-redux'
import data from './data.json'
import * as d3 from 'd3'


class D3Plot extends Component {
  constructor(props) {
    super(props);
    this.plotRef = React.createRef();
  }

  componentDidMount() {
    // const {commits} = this.props
    const commits = data
    const node = this.plotRef.current

    // SVG properties
    const width = window.innerWidth*0.85
    const height = window.innerHeight*0.85

    // define SVG element
    const plot = d3.select(node).append("svg")
      .attr("height", height)
      .attr("width", width)


    // define time x scale
    const minDate = new Date(commits[commits.length-1].date)
    const maxDate = new Date(commits[0].date)
    console.log(minDate, maxDate)
    let xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, width])

    // define time y scale
    const minTime = new Date("January 1, 2000, 00:00:00")
    const maxTime = new Date("January 2, 2000, 00:00:00")
    let yScale = d3.scaleTime()
      .domain([minTime, maxTime])
      .range([height, 0])

    // define axes
    let xAxis = d3.axisBottom(xScale).tickPadding(10).tickSize(10)
    let yAxis = d3.axisLeft(yScale).tickPadding(10).tickSize(10)

    // define plot group
    const margin={left: 50, right: 50}
    let plotGroup = plot.append("g")
      .attr('height', height)
      .attr('width', width)
      .attr("transform", "translate("+margin.left+", "+margin.right+")")


      plotGroup.append("g")
      .call(yAxis)
      plotGroup.append("g")
      // .attr("transform", "translate("+0+", "+height-10+")")
      .call(xAxis)

    // create circles for commits
    const circles = [0, 1, 2]
    console.log(circles)
    // plot.append("rect")
    //   .attr('width', width)
    //   .attr('height', height)
    //   .attr('fill', 'yellow')
    plot.selectAll("circle.first")
      .data(circles)
      .enter().append("circle")
        .attr('class', 'first')
        .attr('cx', function(d, i){return 10 * (i+1)})
        .attr('cy', '100px')
        .attr('r', '4px')
        .attr('fill', 'blue')
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
      <div ref={this.plotRef} id="plot"/>
    )
  }
}

const mapState = state => {
  return {}
}

const mapDispatch = dispatch => {
  return {}
}

export default connect(mapState, mapDispatch)(D3Plot)
