import * as fs from 'fs'
import * as path from 'path'

const baseDir = path.resolve(__dirname, '../output')

export function saveFile(name: string, buf: Buffer) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  const fileName = name + '_' + new Date().getTime().toString() + '.jpg'
  fs.writeFile(path.resolve(baseDir, fileName), buf, function(err) {
    if (err) console.info(err)
    else console.info('[INFO] saved image to output/' + fileName)
  })
}

export function saveJson(name: string, buf: any) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  const fileName = name + '_' + new Date().getTime().toString() + '.json'
  const data = JSON.stringify(buf)
  fs.writeFile(path.resolve(baseDir, fileName), data, function(err) {
    if (err) console.info(err)
    else console.info('[INFO] saved json to output/' + fileName)
  })
}

export function saveTxt(name: string, data: any) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  const fileName = name + '_' + new Date().getTime().toString() + '.txt'
  fs.writeFile(path.resolve(baseDir, fileName), data, function(err) {
    if (err) console.info(err)
    else console.info('[INFO] saved data to output/' + fileName)
  })
}
