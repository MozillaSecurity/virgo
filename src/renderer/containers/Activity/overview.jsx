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

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'

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
  },
  card: {
    maxWidth: 400
  },
  actions: {
    display: 'flex'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

const ContainerBox = props => {
  return (
    <Card>
      <CardHeader title={props.name} />
      <CardContent />
      <CardActions disableActionSpacing />
      <Collapse in={props.expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography primary="Id">{props.id}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

class Overview extends React.Component {
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
Overview.propTypes = {
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
)(withStyles(styles)(Overview))
