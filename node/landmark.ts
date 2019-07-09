import * as faceapi from 'face-api.js'

import {
  canvas,
  faceDetectionNet,
  faceDetectionOptions,
  saveFile,
  modelLink
} from './utils'

async function run() {
  // load face recognition model
  await faceDetectionNet.loadFromDisk(modelLink)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelLink)

  // get start time
  const tstart = process.hrtime()

  // open an image file
  const img = await canvas.loadImage('../images/h1.jpg')
  // find all the faces and face encodings in the current image
  const results = await faceapi
    .detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks()

  // create a canvas from image
  const out = faceapi.createCanvasFromMedia(img) as any
  // display the results, draw a box around the face and facial landmarks
  faceapi.draw.drawDetections(out, results.map(res => res.detection))
  faceapi.draw.drawFaceLandmarks(out, results.map(res => res.landmarks))

  // save results
  saveFile('landmark', out.toBuffer('image/jpeg'))

  // calculate processing time
  const tend = process.hrtime(tstart)
  console.info('[INFO] total process time: %dms', tend[1] / 1000000)
}

run()
