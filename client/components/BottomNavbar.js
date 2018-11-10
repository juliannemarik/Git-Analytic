// EXTERNAL IMPORTS
import React from 'react'

// MATERIAL UI IMPORTS
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import DateFnsUtils from '@date-io/date-fns'
import {MuiPickersUtilsProvider, InlineDatePicker} from 'material-ui-pickers'

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  bottomNavgation: {
    boxShadow: 'none',
    width: '100%',
    borderTop: '1px solid #D8DEE2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  text: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {display: 'block'},
    fontWeight: 300,
    letterSpacing: theme.spacing.unit * 1 / 4
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  resizeDate: {
    padding: '5%',
    fontSize: '12px',
    width: '7vw'
  }
})

class BottomNavbar extends React.Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
  }

  handleDateChange = dateType => date => {
    console.log("CHANGED")
    this.setState({[dateType]: date})
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <BottomNavigation
          position="static"
          color="default"
          className={classes.bottomNavgation}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <InlineDatePicker
              onlyCalendar
              disableFuture
              keyboard
              format="MM/dd/yyyy"
              className={classes.textField}
              InputProps={{
                classes: {
                  input: classes.resizeDate
                }
              }}
              value={this.state.startDate}
              onChange={this.handleDateChange('startDate')}
              onSubmit={() => {console.log('SUBMITED')}}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <InlineDatePicker
              onlyCalendar
              disableFuture
              keyboard
              format="MM/dd/yyyy"
              className={classes.textField}
              InputProps={{
                classes: {
                  input: classes.resizeDate
                }
              }}
              value={this.state.endDate}
              onChange={this.handleDateChange('endDate')}
            />
          </MuiPickersUtilsProvider>
        </BottomNavigation>
      </div>
    )
  }
}



BottomNavbar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BottomNavbar)
