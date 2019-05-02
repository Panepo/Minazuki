// @flow

import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'

const styles = (theme: Object) => ({})

export type MuiTableHead = {
  id: string,
  numeric: boolean,
  disablePadding: boolean,
  label: string
}

type ProvidedProps = {
  classes: Object
}

type Props = {
  className: string,
  numSelected: number,
  order: 'asc' | 'desc',
  orderBy: string,
  rowCount: number,
  onRequestSort: (event: any, property: any) => void,
  onSelectAllClick: (event: any) => void,
  rows: MuiTableHead[]
}

class MucTableHead extends React.Component<ProvidedProps & Props> {
  createSortHandler = (property: any) => (event: any) => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      classes,
      className
    } = this.props

    return (
      <TableHead className={classNames(classes.root, className)}>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {this.props.rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}>
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}>
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    )
  }
}

MucTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  numSelected: PropTypes.number.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func
}

export default withStyles(styles)(MucTableHead)
