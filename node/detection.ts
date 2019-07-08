import * as faceapi from 'face-api.js'

import {
  canvas,
  faceDetectionNet,
  faceDetectionOptions,
  saveFile,
  modelLink
} from './commons'

async function run() {
  await faceDetectionNet.loadFromDisk(modelLink)
  const tstart = process.hrtime()

  const img = await canvas.loadImage('../images/h1.jpg')
  const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)

  const out = faceapi.createCanvasFromMedia(img) as any
  faceapi.draw.drawDetections(out, detections)

  const tend = process.hrtime(tstart)
  console.info('[INFO] total process time: %dms', tend[1] / 1000000)

  saveFile('detection', out.toBuffer('image/jpeg'))
}

run()
