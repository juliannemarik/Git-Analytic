// EXTERNAL IMPORTS
import React from 'react'
import {connect} from 'react-redux'
import {fetchCommitsByDate, fetchPullsByDate} from '../store'
const dateFormat = require('dateformat');

// MATERIAL UI IMPORTS
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
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
    startDate: dateFormat(new Date(), "isoUtcDateTime"),
    endDate: dateFormat(new Date(), "isoUtcDateTime"),
  }

  handleDateChange = dateType => async date => {
    await this.setState({[dateType]: dateFormat(date, "isoUtcDateTime")})
    console.log("NEW STATE", this.state)
    const {commits, pulls, owner, repository} = this.props
    let {startDate, endDate} = this.state

    console.log("START", startDate, "END", endDate)
    this.props.fetchCommitsByDate(owner, repository, startDate, endDate, commits)
    this.props.fetchPullsByDate(owner, repository, startDate, endDate, pulls)
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
