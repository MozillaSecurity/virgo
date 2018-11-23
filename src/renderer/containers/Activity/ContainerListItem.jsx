/** @format */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Typography from '@material-ui/core/Typography'

import * as actionCreators from '../../actions'

import electronStore from 'electron-store'
let store = new electronStore()

const styles = theme => ({
  title: {
    paddingBottom: '5px'
  },
  category: {
    paddingBottom: '20px'
  }
})

const ContainerBox = props => {
  return (
    <Paper>
      <List>
        <ListItem>
          <ListItemText primary={props.name} primaryTypographyProps={{ variant: 'body2' }} />
        </ListItem>
      </List>
    </Paper>
  )
}

class ContainerListItem extends React.Component {
  render() {
    const { classes, containers } = this.props
    return (
      <div>
        <div className={classes.category}>
          <Typography color="primary" variant="body1" className={classes.title}>
            Containers
          </Typography>
        </div>
        {this.props.containers.length === 0 ? 'No containers' : ''}
        {containers.map(c => (
          <ContainerBox key={c.name} {...c} />
        ))}
      </div>
    )
  }
}

/* Prop Types */
ContainerListItem.propTypes = {
  classes: PropTypes.object.isRequired
}

/* States */
const mapStateToProps = state => {
  return {}
}

/* Dispatchers */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
}

/* Connecto to Redux */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ContainerListItem))
