// EXTERNAL IMPORTS
import React from 'react'

// MATERIAL UI IMPORTS
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  bottomNavgation: {
    boxShadow: 'none',
    width: '100%',
    borderTop: '1px solid #D8DEE2',
  },
  text: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {display: 'block'},
    fontWeight: 300,
    letterSpacing: theme.spacing.unit * 1 / 4
  }
})

function BottomNavbar(props) {
  const {classes} = props

  return (
    <div className={classes.root}>
      <BottomNavigation position="static" color="default" className={classes.bottomNavgation}>
        <BottomNavigationAction>

        </BottomNavigationAction>
          {/* <Typography
            // className={classes.text}
            // variant="h6"
            // color="inherit"
          >
            CONTROLS HERE
          </Typography> */}
      </BottomNavigation>
    </div>
  )
}

BottomNavbar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BottomNavbar)
