// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import type { StateRecord } from '../../models/modelRecord'

import Layout from '../Layout'
import { withStyles } from '@material-ui/core'
// import Card from '@material-ui/core/Card'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'

import MucTableHead from '../../componments/MucTableHead'
import { tableHead } from './TableHead'
import { stableSort, getSorting } from '../../helpers/table.helper'
import { dateTransform } from '../../helpers/date.helper'

const styles = (theme: Object) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 600
  },
  tableWrapper: {
    overflowX: 'auto'
  }
})

type ProvidedProps = {
  classes: Object
}

type Props = {
  record: StateRecord
}

type State = {
  order: 'asc' | 'desc',
  orderBy: string,
  selected: number[],
  data: any[],
  page: number,
  rowsPerPage: number
}

class PrivateRecord extends React.Component<ProvidedProps & Props, State> {
  state = {
    order: 'asc',
    orderBy: 'date',
    selected: [],
    data: this.props.record.data,
    page: 0,
    rowsPerPage: 5
  }

  static getDerivedStateFromProps(nextProps: ProvidedProps & Props) {
    return { data: nextProps.record.data }
  }

  handleRequestSort = (event: any, property: string) => {
    const orderBy = property
    let order: 'asc' | 'desc' = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order: order, orderBy: orderBy })
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.$loki) }))
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event: any, $loki: number) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf($loki)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, $loki)
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

  handleChangePage = (event: any, page: number) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = $loki => this.state.selected.indexOf($loki) !== -1

  render() {
    const { classes } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    return (
      <Layout
        helmet={true}
        title={'Record | Minazuki'}
        gridNormal={6}
        gridPhone={10}
        content={
          <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <MucTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                  rows={tableHead}
                />
                <TableBody>
                  {stableSort(data, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                      const isSelected = this.isSelected(n.$loki)
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.$loki}
                          selected={isSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onClick={event =>
                                this.handleClick(event, n.$loki)
                              }
                            />
                          </TableCell>
                          <TableCell align="left" padding="dense">
                            {n.name}
                          </TableCell>
                          <TableCell align="left" padding="dense">
                            {dateTransform(n.date)}
                          </TableCell>
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
        }
      />
    )
  }
}

PrivateRecord.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object
}

const mapStateToProps = state => {
  return {
    record: state.reducerRecord
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PrivateRecord))
