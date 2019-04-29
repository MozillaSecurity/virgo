/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({})

class TimeCounter extends React.Component {
  getUnits(timeElapsed) {
    const seconds = timeElapsed / 1000
    return {
      hh: Math.floor(seconds / 60 / 60).toString(),
      min: Math.floor(seconds / 60).toString(),
      sec: Math.floor(seconds % 60).toString()
    }
  }

  leftPad = (width, n) => {
    if (`${n}`.length > width) {
      return n
    }
    const padding = new Array(width).join('0')
    return (padding + n).slice(-width)
  }

  render() {
    const { timeElapsed } = this.props
    const units = this.getUnits(timeElapsed)

    return (
      <div>
        {this.leftPad(2, units.hh)}:{this.leftPad(2, units.min)}:{this.leftPad(2, units.sec)}
      </div>
    )
  }
}

/* PropTypes */
TimeCounter.propTypes = {
  classes: PropTypes.object.isRequired,
  timeElapsed: PropTypes.number.isRequired
}

export default withStyles(styles)(TimeCounter)
