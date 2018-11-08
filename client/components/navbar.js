import React, {Component} from 'react'
import {connect} from 'react-redux'

class Navbar extends Component {
  componentDidMount() {}

  render() {
    return (
      <div>NAVBAR</div>
    )
  }
}

const mapState = state => {
  return {}
}

const mapDispatch = dispatch => {
  return {}
}

export default connect(mapState, mapDispatch)(Navbar)
