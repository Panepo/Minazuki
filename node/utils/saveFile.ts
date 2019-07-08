import * as fs from 'fs'
import * as path from 'path'

const baseDir = path.resolve(__dirname, '../output')

export function saveFile(name: string, buf: Buffer) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  const fileName = name + '_' + new Date().getTime().toString() + '.jpg'
  fs.writeFileSync(path.resolve(baseDir, fileName), buf)
  console.info('[INFO] saved results to output/' + fileName)
}
