/** @format */
/* eslint-disable no-underscore-dangle */

import React from 'react'
import PropTypes from 'prop-types'
import { ipcRenderer } from 'electron'

/* Styles */
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
  Checkbox
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import EnhancedTableHead from './Table/TableHead'
import EnhancedTableToolbar from './Table/TableToolbar'
import { stableSort, getSorting } from './Table/helpers'

import Logger from '../../../shared/logger'
import { mapContainers } from '../../lib/docker'

const logger = new Logger('DockerContainers')

// eslint-disable-next-line no-unused-vars
const styles = theme => ({
  root: {
    width: '100%'
  },
  table: {},
  tableWrapper: {
    overflowX: 'auto'
  }
})

const rows = [
  {
    id: '_id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
    help: 'Container ID (truncated)'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    help: 'Container name'
  },
  {
    id: 'state',
    numeric: false,
    disablePadding: false,
    label: 'State',
    help: 'Container state'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
    help: 'Container status'
  },
  {
    id: 'image',
    numeric: false,
    disablePadding: false,
    label: 'Image',
    help: 'Associated Image'
  }
]

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'containers',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 5,
    search: ''
  }

  componentDidMount() {
    ipcRenderer.on('container.list', this.listContainers)
    ipcRenderer.on('container.remove', this.containerRemove)
    ipcRenderer.on('container.stop', this.containerStop)
    ipcRenderer.send('container.list')
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('container.list', this.listContainers)
    ipcRenderer.removeListener('container.remove', this.containerRemove)
    ipcRenderer.removeListener('container.stop', this.containerStop)
  }

  listContainers = (event, containers) => {
    this.setState({ data: mapContainers(containers) })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }))
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => {
    const { selected } = this.state

    return selected.indexOf(id) !== -1
  }

  onRemove = () => {
    const { selected, data } = this.state

    const identifiers = selected.map(entry => data[entry]._id)
    identifiers.map(id => ipcRenderer.send('container.remove', { id }))
  }

  containerRemove = (event, args) => {
    if (args.error) {
      logger.error(JSON.stringify(args.data))
      return
    }
    this.setState({ selected: [] })
    ipcRenderer.send('container.list')
  }

  onRefresh = () => {
    ipcRenderer.send('container.list')
  }

  onStop = () => {
    const { selected, data } = this.state

    const identifiers = selected.map(entry => data[entry]._id)
    identifiers.map(id => ipcRenderer.send('container.stop', { id }))
  }

  containerStop = (event, args) => {
    if (args.error) {
      logger.error(JSON.stringify(args.data))
      return
    }
    this.setState({ selected: [] })
    ipcRenderer.send('container.list')
  }

  onSearchChange = event => {
    this.setState({ search: event.target.value })
  }

  render() {
    const { classes } = this.props
    const { data, search, order, orderBy, selected, rowsPerPage, page } = this.state

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          search={search}
          onRemoveCallback={this.onRemove}
          onRefreshListCallback={this.onRefresh}
          onStopCallback={this.onStop}
          onSearchCallback={this.onSearchChange}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              rows={rows}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter(item => !search || item.image.includes(search))
                .map(n => {
                  const isSelected = this.isSelected(n.id)
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n._id}
                      </TableCell>
                      <TableCell align="right">{n.name}</TableCell>
                      <TableCell align="right">{n.state}</TableCell>
                      <TableCell align="right">{n.status}</TableCell>
                      <TableCell align="right">{n.image}</TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    )
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EnhancedTable)
