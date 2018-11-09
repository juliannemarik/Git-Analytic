// EXTERNAL IMPORTS
import React from 'react'

// MATERIAL UI IMPORTS
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  DatePicker,
  InlineDatePicker
} from 'material-ui-pickers'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    boxShadow: 'none',
    borderBottom: '1px solid #D8DEE2'
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
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  navLinkText: {
    fontWeight: 300,
    color: 'inherit',
    letterSpacing: theme.spacing.unit * 1 / 4
  },
  resize: {
    padding: '5%',
    fontSize: '12px',
    width: '10vw'
  },
  resizeDate: {
    padding: '5%',
    fontSize: '12px',
    width: '7vw'
  }
})

class Navbar extends React.Component {
  state = {
    repository: '',
    owner: '',
    startDate: new Date(),
    endDate: new Date()
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleDateChange = date => {
    this.setState({startDate: date})
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar>
            <img className={classes.logo} src="/gitAnalyticLogo.png" />
            <Typography
              className={`${classes.title} ${classes.grow}`}
              variant="h6"
              color="inherit"
            >
              GIT ANALYTIC
            </Typography>
            <TextField
              id="outlined-name"
              label="Owner"
              className={classes.textField}
              value={this.state.owner}
              onChange={this.handleChange('owner')}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                classes: {
                  input: classes.resize
                }
              }}
              variant="outlined"
            />
            <TextField
              id="outlined-name"
              label="Repository"
              className={classes.textField}
              value={this.state.repository}
              onChange={this.handleChange('repository')}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                classes: {
                  input: classes.resize
                }
              }}
              variant="outlined"
            />
            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  // variant="outlined"
                  // label="from"
                  className={classes.textField}
                  InputProps={{
                    classes: {
                      input: classes.resizeDate
                    }
                  }}
                  value={this.state.startDate}
                  onChange={this.handleDateChange('startDate')}
                />
              </MuiPickersUtilsProvider> */}

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <InlineDatePicker
                onlyCalendar
                disableFuture
                keyboard
                format="dd/MM/yyyy"
                className={classes.textField}
                InputProps={{
                  classes: {
                    input: classes.resizeDate
                  }
                }}
                value={this.state.startDate}
                onChange={this.handleDateChange}
              />
            </MuiPickersUtilsProvider>

            <Button color="inherit" className={classes.navLinkText}>
              SUBMIT
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Navbar)
