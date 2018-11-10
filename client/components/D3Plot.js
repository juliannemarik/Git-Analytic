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
    this.props.owner.length && !this.props.commits.isFetching && !this.props.pulls.isFetching ?
    console.log("COMPONENT MOUNTED") : console.log("NOT MOUNTED")
    const node = this.plotRef.current
    updateFunc = createPlot(node, {isFetching: false, array:[]}, {isFetching: false, array:[]})
  }

  componentShouldMount() {
    // return false...?
  }

  componentDidUpdate(prevProps) {
    this.props.owner.length && !this.props.commits.isFetching && !this.props.pulls.isFetching ?
    updateFunc(this.props.commits, this.props.pulls) : console.log("PARTIALLY UPDATE")  }

  render() {
    const {classes} = this.props
    return <div className={classes.root} ref={this.plotRef} id="plot" />
  }
}

const mapState = state => {
  return {
    owner: state.repos.owner,
    commits: state.repos.commits,
    pulls: state.repos.pulls
  }
}

const mapDispatch = dispatch => {
  return {}
}

export default withStyles(styles)(connect(mapState, mapDispatch)(D3Plot))
