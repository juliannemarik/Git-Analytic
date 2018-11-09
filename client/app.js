import React from 'react'
import {Home, Navbar, BottomNavbar} from './components'

// MATERIAL UI IMPORTS
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'blue'
  }
})

const App = (props) => {
  const {classes} = props
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar />
      <Home />
      <BottomNavbar />
    </div>
  )
}

export default withStyles(styles)(App)
