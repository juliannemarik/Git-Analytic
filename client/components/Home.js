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
    // width: '100%',
    // height: '100%',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "theme.palette.secondary.main"
  }
})

class Home extends Component {
  componentDidMount() {
    // this.props.fetchCommits('Pigs-n-Blankets', 'Pigs-n-Blankets')
  }

  render() {
    const {classes} = this.props
    // return (
    //   <div className={classes.root}>
    //     {this.props.commits.length ? <D3Plot commits={this.props.commits} /> : <div />}
    //   </div>
    // )
    return (
      <div className={classes.root}>
        <D3Plot />
      </div>
    )
  }
}

const mapState = state => {
  return {
    commits: state.repos.commits
  }
}

const mapDispatch = dispatch => {
  return {
    fetchCommits: (owner, repo) => {
      dispatch(fetchCommits(owner, repo))
    }
  }
}

export default withStyles(styles)(connect(mapState, mapDispatch)(Home))
