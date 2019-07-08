// @flow

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

const styles = theme => ({
  root: {}
})

type Props = {
  classes: Object,
  className: string,
  tileData: {
    img: string,
    title: string,
    cols: number
  }[],
  cellHeight: number,
  cellCols: number
}

const ImageGridList = (props: Props) => {
  const { classes } = props

  return (
    <GridList
      className={classNames(classes.root, props.className)}
      cellHeight={props.cellHeight}
      cols={props.cellCols}>
      {props.tileData.map(tile => (
        <GridListTile key={tile.img} cols={tile.cols || 1}>
          <img src={tile.img} alt={tile.title} />
        </GridListTile>
      ))}
    </GridList>
  )
}

ImageGridList.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  tileData: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.string,
      title: PropTypes.string,
      cols: PropTypes.number
    })
  ),
  cellHeight: PropTypes.number,
  cellCols: PropTypes.number
}

export default withStyles(styles)(ImageGridList)
