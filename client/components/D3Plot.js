import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as d3 from 'd3'

// MATERIAL UI IMPORTS
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    padding: '2%',
    // backgroundColor: theme.palette.primary.main
  }
})

class D3Plot extends Component {
  constructor(props) {
    super(props);
    this.plotRef = React.createRef();
  }

  componentDidMount() {
    const node = this.plotRef.current
    console.log('MOUNTED', node)
    const plot = d3.select(node).append("svg")
      .attr("height", "100%")
      .attr("width","100%")

    const circles=[30, 45, 100]
    plot.selectAll("circle.first")
      .data(circles)
      .enter().append("circle")
        .attr('class', 'first')
        .attr('cx', function(d, i){return 200 * (i+1)})
        .attr('cy', '200px')
        .attr('r', function (d, i){return d})
        .attr('fill', 'blue')

    // plot.append("circle")
    //   .attr("cx", "100px")
    //   .attr("cy", "100px")
    //   .attr("r", "30px")
    //   .attr("fill", "yellow")

    // GIT ANALYTIC
    // plot.append()
    // anaGITics
    //tarGIT
    //analyGIT
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
      <div className={classes.root} ref={this.plotRef} id="plot"/>
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
