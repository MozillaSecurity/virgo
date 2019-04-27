/** @format */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
/* Styles */
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

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

const ImageListItem = props => {
  const { tags, date, containers, id, size } = props
  return (
    <Card>
      <CardHeader title={tags} subheader={date} avatar={<Avatar aria-label="Recipe">I</Avatar>} />
      <CardContent>
        <Typography component="p">
          Id: {id} Size: {size} Associated containers: {containers}
        </Typography>
      </CardContent>
      <CardActions disableActionSpacing />
    </Card>
  )
}

class ImageList extends React.Component {
  render() {
    const { classes, images } = this.props
    return (
      <div>
        <div className={classes.category}>
          <Typography color="primary" variant="body1" className={classes.title}>
            Downloaded Images
          </Typography>
        </div>
        {this.props.images.length === 0 ? 'No images' : ''}
        {images.map(image => (
          <ImageListItem key={image.id} {...image} />
        ))}
      </div>
    )
  }
}

/* Prop Types */
ImageList.propTypes = {
  classes: PropTypes.object.isRequired,
  images: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired
}

ImageListItem.propTypes = {
  containers: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired
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
)(withStyles(styles)(ImageList))
