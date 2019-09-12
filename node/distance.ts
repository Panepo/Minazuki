import * as faceapi from 'face-api.js'
import { canvas, faceDetectionNet, modelLink } from './utils'

// process argument
const input1 = process.argv[2]

if (!input1) {
  console.error('[ERROR] the path of the first input image is required')
  process.exit(0)
}

const input2 = process.argv[3]

if (!input2) {
  console.error('[ERROR] the path of the second input image is required')
  process.exit(0)
}

async function run(input1, input2) {
  // load face recognition model
  await faceDetectionNet.loadFromDisk(modelLink)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelLink)
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelLink)

  // get start time
  const tstart = process.hrtime()

  // open an image file
  const img1 = await canvas.loadImage(input1)
  // find all the faces and face encodings in the current image
  const descriptors1 = (await faceapi.computeFaceDescriptor(
    img1
  )) as Float32Array

  // open an image file
  const img2 = await canvas.loadImage(input2)
  // find all the faces and face encodings in the current image
  const descriptors2 = (await faceapi.computeFaceDescriptor(
    img2
  )) as Float32Array

  // compute the euclidean distance of two images
  const dist = faceapi.euclideanDistance(descriptors1, descriptors2)
  console.info('[INFO] face distance is ' + dist.toString())

  // calculate processing time
  const tend = process.hrtime(tstart)
  console.info('[INFO] total process time: %dms', tend[1] / 1000000)
}

run(input1, input2)
