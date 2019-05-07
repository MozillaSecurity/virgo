/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

/* Styles */
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'

import { ipcRenderer } from 'electron'
import EnhancedTableHead from './Table/TableHead'
import EnhancedTableToolbar from './Table/TableToolbar'
import { stableSort, getSorting } from './Table/helpers'

import { mapImages } from '../../lib/docker'

const styles = theme => ({
  root: {
    width: '100%'
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: 'auto'
  }
})

const rows = [
  { id: '_id', numeric: false, disablePadding: true, label: 'ID', help: 'Image ID (truncated)' },
  { id: 'size', numeric: false, disablePadding: false, label: 'Size', help: 'Image size' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date', help: 'Creation date' },
  { id: 'containers', numeric: true, disablePadding: false, label: 'Containers', help: 'Running containers' },
  { id: 'tags', numeric: false, disablePadding: false, label: 'Tags', help: 'Image tags' }
]

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'containers',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 5
  }

  componentDidMount() {
    ipcRenderer.on('image.list', this.listImages)
    ipcRenderer.send('image.list')
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('image.list', this.listImages)
  }

  listImages = (event, images) => {
    this.setState({ data: mapImages(images) })
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
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render() {
    const { classes } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} title="" />

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
                      <TableCell align="right">{n.size}</TableCell>
                      <TableCell align="right">{n.date}</TableCell>
                      <TableCell align="right">{n.containers}</TableCell>
                      <TableCell align="right">{n.tags}</TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
      </Paper>
    )
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EnhancedTable)
