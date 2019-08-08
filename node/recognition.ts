import * as faceapi from 'face-api.js'
import * as fs from 'fs'
import {
  canvas,
  faceDetectionNet,
  faceDetectionOptions,
  saveFile,
  modelLink
} from './utils'
import { createFaceMatcher } from './utils/faceMatch'

// process argument
const input = process.argv[2]

if (!input) {
  console.error("[ERROR] the path of input image is required")
  process.exit(0)
}

let json = process.argv[3]

if (!input) {
  json = './json/faces_all.json'
}


async function run(input: string, json: string) {
  // load face recognition model
  await faceDetectionNet.loadFromDisk(modelLink)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelLink)
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelLink)

  // get start time
  const tstart = process.hrtime()

  // load the learned faces
  const contents = await fs.readFileSync(json) as any
  const faces = JSON.parse(contents)
  // create face matcher
  const faceMatcher = await createFaceMatcher(faces)

  // open an image file
  const img = await canvas.loadImage(input)
  // find all the faces and face encodings in the current image
  const results = await faceapi
    .detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors()

  // display the results
  if (results) {
    const queryDrawBoxes = results.map(res => {
      const bestMatch = faceMatcher.findBestMatch(res.descriptor)
      return new faceapi.draw.DrawBox(res.detection.box, { label: bestMatch.toString() })
    })
    const outQuery = faceapi.createCanvasFromMedia(img)
    queryDrawBoxes.forEach(drawBox => drawBox.draw(outQuery))

    // save results
    saveFile('recognition', (outQuery as any).toBuffer('image/jpeg'))
  } else {
    console.warn('[WARNING] no faces found.')
  }

  const tend = process.hrtime(tstart)
  console.info('[INFO] total process time: %dms', tend[1] / 1000000)
}

run(input, json)
