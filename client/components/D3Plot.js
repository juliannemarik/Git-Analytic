import React, {Component} from 'react'
import {connect} from 'react-redux'
// import commitData from './data.commits.json'
// import pullData from './data.pulls.json'
import {createPlot} from './plotFunction'

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
let updateFunc = ''

class D3Plot extends Component {
  constructor(props) {
    super(props)
    this.plotRef = React.createRef()
  }

  componentDidMount() {
    let {commits, pulls} = this.props
    const node = this.plotRef.current
    updateFunc = createPlot(node, commits, pulls)
  }

  componentShouldMount() {
    // return false...?
  }

  componentDidUpdate() {
   console.log("UPDATE FROM D3PLOT")
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
