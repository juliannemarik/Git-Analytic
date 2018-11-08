import React from 'react'
import {Home} from './components'
import Navbar from './components/Navbar'

// MATERIAL UI IMPORTS
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  }
})

const App = (props) => {
  const {classes} = props
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar />
      <Home />
    </div>
  )
}

export default withStyles(styles)(App)
