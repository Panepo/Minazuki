import * as faceapi from 'face-api.js'
import { canvas, faceDetectionNet, modelLink, getAll } from './utils'
import * as fs from 'fs'
import * as path from 'path'

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

  // initialize log lists
  const baseDir = path.resolve(__dirname, './output')
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }
  const fileName = 'analysis_log_' + new Date().getTime().toString() + '.txt'
  const log = fs.createWriteStream(path.resolve(baseDir, fileName))

  await Promise.all(
    userList.map(async (user: { name: string; files: string[] }) => {
      let refDescriptor = null
      await Promise.all(
        user.files.map(async (file: string, index: number) => {
          // extract the person name from the image path
          const img = await canvas.loadImage('..' + file)
          if (index === 0) {
            // find the face and face encodings in the current image and save as reference
            refDescriptor = (await faceapi.computeFaceDescriptor(
              img
            )) as Float32Array
            console.info('[INFO] processing user ' + user.name)
            log.write('[INFO] processing user ' + user.name + '\n')
          } else {
            // find the face and face encodings in the current image
            const descriptor = (await faceapi.computeFaceDescriptor(
              img
            )) as Float32Array

            // compute the euclidean distance of two images
            const dist = faceapi.euclideanDistance(descriptor, refDescriptor)
            log.write(dist + '\n')
            console.info('[INFO] face distance is ' + dist.toString())
          }
        })
      )
    })
  )

  // save and close log
  log.end()

  const tend = process.hrtime(tstart)
  console.info('[INFO] total process time: %dms', tend[1] / 1000000)
}

run()
