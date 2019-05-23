class EnvironmentValues {
  title = 'Minazuki'
  urlDev = '/'
  urlProd = '/'
  ColorMenuIcon = '#3d5afe'
  ColorRibbon =
    'radial-gradient(farthest-side at 80% 100%, #00e676, #18ffff, #00b0ff, #3d5afe)'

  // Video options
  videoCanvas = {
    width: 640,
    height: 360
  }

  // TinyFaceDetector options
  tinyInputSize = 160
  tinyThreshold = 0.5

  // Face record options
  recordRepeatTime = 60000 // 1 min
}

// Export as singleton
const environmentValuesLoader = new EnvironmentValues()
Object.freeze(environmentValuesLoader)
export { environmentValuesLoader as environment }
