// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import IconDelete from '@material-ui/icons/Delete'
import IconCamera from '@material-ui/icons/Camera'
import IconUpload from '@material-ui/icons/CloudUpload'
import Tooltip from '@material-ui/core/Tooltip'
import { basename } from 'path'

const imageFace = require('../../images/face.jpg')

const styles = (theme: Object) => ({
  gridList: {
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  icon: {
    color: 'white'
  }
})

type Props = {
  classes: Object,
  faces: string[],
  username: string,
  toggleDialog: (target: string, onoff: boolean, name: string) => () => null
}

const RenderList = (props: Props) => {
  return (
    <GridList
      cellHeight={256}
      cols={6}
      spacing={1}
      className={props.classes.gridList}>
      {props.faces.map(file => (
        <GridListTile key={file} cols={1} rows={1}>
          <img src={file} alt={props.username} height={256} />
          <GridListTileBar
            title={basename(file)}
            titlePosition="bottom"
            actionIcon={
              <Tooltip title="Delete file">
                <IconButton
                  className={props.classes.icon}
                  onClick={props.toggleDialog('delete', true, file)}>
                  <IconDelete />
                </IconButton>
              </Tooltip>
            }
            actionPosition="right"
            className={props.classes.titleBar}
          />
        </GridListTile>
      ))}
      <GridListTile cols={1} rows={1}>
        <img src={imageFace} alt={'new face'} height={256} />
        <GridListTileBar
          title={'Add face'}
          titlePosition="bottom"
          actionIcon={
            <div>
              <Tooltip title="Start camera">
                <IconButton
                  className={props.classes.icon}
                  onClick={props.toggleDialog('camera', true, '')}>
                  <IconCamera />
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload from file">
                <IconButton
                  className={props.classes.icon}
                  onClick={props.toggleDialog('upload', true, '')}>
                  <IconUpload />
                </IconButton>
              </Tooltip>
            </div>
          }
          actionPosition="right"
          className={props.classes.titleBar}
        />
      </GridListTile>
    </GridList>
  )
}

RenderList.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default withStyles(styles)(RenderList)
