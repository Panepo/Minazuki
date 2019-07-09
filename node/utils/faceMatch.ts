import * as faceapi from 'face-api.js'

export async function createFaceMatcher(
  data: { _label: string, _descriptors: any }[],
  distanceThreshold: number = 0.6
) {
  const labeledFaceDescriptors = await Promise.all(
    data.map(face => {
      const descriptors = []
      face._descriptors.forEach(desc => {
        const parsedArray = Object.values(desc) as any
        descriptors.push(new Float32Array(parsedArray))
      })
      return new faceapi.LabeledFaceDescriptors(face._label, descriptors)
    })
  )
  return new faceapi.FaceMatcher(labeledFaceDescriptors, distanceThreshold)
}
