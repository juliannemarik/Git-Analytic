// EXTERNAL IMPORTS
import React, {Component} from 'react'
import {connect} from 'react-redux'

// INTERNAL IMPORTS
import D3Plot from './D3Plot'

// MATERIAL UI IMPORTS
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between',
    // backgroundColor: theme.palette.secondary.main
  }
})

class Home extends Component {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <D3Plot />
      </div>
    )
  }
}

const mapState = state => {
  return {}
}

const mapDispatch = dispatch => {
  return {}
}

export default withStyles(styles)(connect(mapState, mapDispatch)(Home))
