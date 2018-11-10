// EXTERNAL IMPORTS
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchCommits} from '../store'

// INTERNAL IMPORTS
import D3Plot from './D3Plot'

// MATERIAL UI IMPORTS
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "theme.palette.secondary.main"
  },
  blankPlot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: window.innerWidth,
    height: window.innerHeight - 2 * 64
  }
})

class Home extends Component {
  render() {
    const {classes} = this.props
    return (
      <D3Plot />
      // <div className={classes.root}>
      //   {this.props.owner.length && !this.props.commits.isFetching && !this.props.pulls.isFetching ? <D3Plot /> : <div className={classes.blankPlot}/> }
      // </div>
    )
  }
}

const mapState = state => {
  return {
    owner: state.repos.owner,
    commits: state.repos.commits,
    pulls: state.repos.pulls
  }
}

export default withStyles(styles)(connect(mapState)(Home))
