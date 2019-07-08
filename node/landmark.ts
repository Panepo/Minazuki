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
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelLink)
  const tstart = process.hrtime()

  const img = await canvas.loadImage('../images/h1.jpg')
  const results = await faceapi
    .detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks()

  const out = faceapi.createCanvasFromMedia(img) as any
  faceapi.draw.drawDetections(out, results.map(res => res.detection))
  faceapi.draw.drawFaceLandmarks(out, results.map(res => res.landmarks))

  const tend = process.hrtime(tstart)
  console.info('[INFO] total process time: %dms', tend[1] / 1000000)

  saveFile('landmark', out.toBuffer('image/jpeg'))
}

run()
