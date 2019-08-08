import * as faceapi from 'face-api.js'
import {
  canvas,
  faceDetectionNet,
  faceDetectionOptions,
  saveFile,
  modelLink
} from './utils'

// process argument
const input = process.argv[2]

if (!input) {
  console.error("[ERROR] the path of input image is required")
  process.exit(0)
}

async function run(input: string) {
  // load face recognition model
  await faceDetectionNet.loadFromDisk(modelLink)

  // get start time
  const tstart = process.hrtime()

  // open an image file
  const img = await canvas.loadImage(input)
  // find all the faces and face encodings in the current image
  const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)

  // create a canvas from image
  const out = faceapi.createCanvasFromMedia(img) as any
  // display the results, draw a box around the face
  faceapi.draw.drawDetections(out, detections)

  // save results
  saveFile('detection', out.toBuffer('image/jpeg'))

  // calculate processing time
  const tend = process.hrtime(tstart)
  console.info('[INFO] total process time: %dms', tend[1] / 1000000)
}

run(input)
