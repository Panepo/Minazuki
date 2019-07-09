import * as faceapi from 'face-api.js'
import { canvas, faceDetectionNet, modelLink, getAll, saveJson } from './utils'

async function run() {
  // load face recognition model
  await faceDetectionNet.loadFromDisk(modelLink)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelLink)
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelLink)

  // get start time
  const tstart = process.hrtime()

  // grab the paths to the input images in our dataset
  console.info('[INFO] quantifying faces...')
  const userList = getAll()

  // initialize our lists of extracted facial descriptors and corresponding people names
  const labeledDescriptors: faceapi.LabeledFaceDescriptors[] = []

  // initialize the total number of faces processed
  let total = 0

  await Promise.all(
    userList.map(async (user: { name: string; files: string[] }, index) => {
      console.info('[INFO] processing user ' + index + '/' + userList.length)
      // initialize our lists of extracted facial descriptors
      const descriptors: Float32Array[] = []
      await Promise.all(
        user.files.map(async (file: string) => {
          // extract the person name from the image path
          const img = await canvas.loadImage('..' + file)
          descriptors.push((await faceapi.computeFaceDescriptor(
            img
          )) as Float32Array)
          total += 1
        })
      )
      if (descriptors.length > 0) {
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(user.name, descriptors)
        )
      }
    })
  )

  console.info('[INFO] serializing ' + total + ' encodings...')
  saveJson('faces', labeledDescriptors)

  const tend = process.hrtime(tstart)
  console.info('[INFO] total process time: %dms', tend[1] / 1000000)
}

run()
