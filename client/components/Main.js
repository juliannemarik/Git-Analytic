import React, {Component} from 'react'
import {connect} from 'react-redux'

class Main extends Component {
  componentDidMount() {}

  render() {
    return (
      <div>MAIN</div>
    )
  }

}

const mapState = state => {
  return {}
}

const mapDispatch = dispatch => {
  return {}
}

export default connect(mapState, mapDispatch)(Main)
