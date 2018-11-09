// EXTERNAL IMPORTS
import React from 'react'

// MATERIAL UI IMPORTS
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  appBar: {
    boxShadow: 'none',
    borderBottom: '1px solid #D8DEE2',
  },
  logo: {
    width: '40px',
    marginRight: '20px',
    marginLeft: '20px'
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {display: 'block'},
    fontWeight: 300,
    letterSpacing: theme.spacing.unit * 1 / 4
  }
})

function Navbar(props) {
  const {classes} = props

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Toolbar>
          <img className={classes.logo} src="/gitAnalyticLogo.png" />
          <Typography
            className={classes.title}
            variant="h6"
            color="inherit"
          >
            GIT ANALYTIC
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Navbar)
