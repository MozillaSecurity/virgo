/** @format */

import React from 'react'
import PropTypes from 'prop-types'

/* Styles */
import { withStyles } from '@material-ui/core/styles'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({})

class TimeCounter extends React.Component {
  getUnits = timeElapsed => {
    const seconds = timeElapsed / 1000
    const hh = Math.floor(seconds / 3600).toString()
    const mm = Math.floor((seconds - hh * 3600) / 60).toString()
    const ss = Math.floor(seconds - hh * 3600 - mm * 60).toString()
    return { hh, mm, ss }
  }

  leftPad = (n, width = 2) => {
    if (n.length > width) {
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
        {this.leftPad(units.hh)}:{this.leftPad(units.mm)}:{this.leftPad(units.ss)}
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
