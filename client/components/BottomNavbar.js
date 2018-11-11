// EXTERNAL IMPORTS
import React from 'react'
import {connect} from 'react-redux'
import {fetchCommitsByDate, fetchPullsByDate} from '../store'
const dateFormat = require('dateformat')

// MATERIAL UI IMPORTS
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import DateFnsUtils from '@date-io/date-fns'
import {MuiPickersUtilsProvider, InlineDatePicker} from 'material-ui-pickers'
import TextField from '@material-ui/core/TextField'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'


const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  bottomNavgation: {
    paddingLeft: '15px',
    paddingRight: '15px',
    boxShadow: 'none',
    width: '100%',
    borderTop: '1px solid #D8DEE2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    width: '8vw',
    fontWeight: 300,
    color: 'inherit',
    letterSpacing: theme.spacing.unit * 1 / 4

  },
  appBar: {
    top: 'auto',
    bottom: 0,
    boxShadow: 'none',
    borderTop: '1px solid #D8DEE2'
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  right: {
    display: 'flex',
    alignItems: 'center'
  },
  left: {
    display: 'flex',
    alignItems: 'center'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  radioText: {
    fontSize: '12px',
    fontWeight: 300,
    color: 'inherit',
    letterSpacing: theme.spacing.unit * 1 / 4
  }
})

class BottomNavbar extends React.Component {
  state = {
    startDate: dateFormat(new Date(), 'isoUtcDateTime'),
    endDate: dateFormat(new Date(), 'isoUtcDateTime')
  }

  handleDateChange = dateType => async date => {
    await this.setState({[dateType]: dateFormat(date, 'isoUtcDateTime')})
    console.log('NEW STATE', this.state)
    const {commits, pulls, owner, repository} = this.props
    let {startDate, endDate} = this.state

    console.log('START', startDate, 'END', endDate)
    this.props.fetchCommitsByDate(
      owner,
      repository,
      startDate,
      endDate,
      commits
    )
    this.props.fetchPullsByDate(owner, repository, startDate, endDate, pulls)
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="default" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.left} >
            <RadioGroup
                aria-label="Gender"
                name="gender1"
                className={classes.radioGroup}
                // value={trainDisplay}
                // onChange={this.handleChange}
              >
                <FormControlLabel
                value="all"
                control={<Radio />}
                label={<Typography className={classes.radioText}>ALL</Typography>}
                />
                <FormControlLabel
                  value="redLine"
                  control={<Radio />}
                  label={<Typography className={classes.radioText}>COMMITS</Typography>}                />
                <FormControlLabel
                  value="blueLine"
                  control={<Radio />}
                  label={<Typography className={classes.radioText}>PULL REQUESTS</Typography>}                />
              </RadioGroup>
            </div>
            <div className={classes.right}>
              <TextField
                select
                className={classes.textField}
                // onChange={this.handleChange}
                // value={this.state.category}
                SelectProps={{
                  native: true,
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                InputProps={{
                  classes: {
                    input: classes.resizeDate
                  }
                }}
                margin="normal"
              >
                <option>contributors</option>
                {[1, 2, 3, 4].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
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
                  onSubmit={() => {
                    console.log('SUBMITED')
                  }}
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
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

BottomNavbar.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapState = state => {
  return {
    owner: state.repos.owner,
    repository: state.repos.repository,
    commits: state.repos.commits,
    pulls: state.repos.pulls
  }
}

const mapDispatch = dispatch => {
  return {
    fetchCommitsByDate: (owner, repo, since, until, commits) => {
      dispatch(fetchCommitsByDate(owner, repo, since, until, commits))
    },
    fetchPullsByDate: (owner, repo, since, until, pulls) => {
      dispatch(fetchPullsByDate(owner, repo, since, until, pulls))
    }
  }
}

export default withStyles(styles)(connect(mapState, mapDispatch)(BottomNavbar))
