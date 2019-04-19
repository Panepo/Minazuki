const pjson = require('../../package.json')
const fs = require('fs')

const CONF_FILE_PATH = './src/environment/settings.json'

/**
 * Init environment values for the application
 */
class EnvironmentValuesLoader {
  static init() {
    // Init configuration
    if (!fs.existsSync(CONF_FILE_PATH)) {
      throw new Error(
        `The file ${CONF_FILE_PATH} does not exists. Please create one :-)`
      )
    }

    const initialEnvironment = JSON.parse(fs.readFileSync(CONF_FILE_PATH))

    // Extra config values ?
    let overridesEnvironmentValues = {}
    if (
      pjson.environmentOverrideFile &&
      fs.existsSync(pjson.environmentOverrideFile)
    ) {
      overridesEnvironmentValues = JSON.parse(
        fs.readFileSync(pjson.environmentOverrideFile)
      )
    }
    return Object.assign({}, initialEnvironment, overridesEnvironmentValues)
  }
}

// Export as singleton
const environmentValuesLoader = EnvironmentValuesLoader.init()
Object.freeze(environmentValuesLoader)
export { environmentValuesLoader as environment }
