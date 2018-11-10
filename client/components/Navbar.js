// EXTERNAL IMPORTS
import React from 'react'
import {connect} from 'react-redux'
import {fetchCommits} from '../store'

// MATERIAL UI IMPORTS
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
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
  submit: {
    marginLeft: theme.spacing.unit * 2
  },
  resize: {
    padding: '5%',
    fontSize: '12px',
    width: '10vw',
    fontWeight: 300,
    letterSpacing: theme.spacing.unit * 1 / 5
  }
})

class Navbar extends React.Component {
  state = {
    repository: '',
    owner: ''
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleSubmit = () => {
    const {repository, owner} = this.state
    this.props.fetchCommits(owner, repository)
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
            <Button
              size="small"
              color="inherit"
              className={`${classes.submit} ${classes.navLinkText}`}
              onClick={this.handleSubmit}
            >
              SUBMIT
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

const mapState = state => {
  return {}
}

const mapDispatch = dispatch => {
  return {
    fetchCommits: (owner, repo) => {
      dispatch(fetchCommits(owner, repo))
    }
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(connect(mapState, mapDispatch)(Navbar))
