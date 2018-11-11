// EXTERNAL IMPORTS
import React, {Component} from 'react'
import {connect} from 'react-redux'

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
      <div className={classes.root}>
        <D3Plot />
      </div>
    )
  }
}

const mapState = state => {
  return {}
}

export default withStyles(styles)(connect(mapState)(Home))
