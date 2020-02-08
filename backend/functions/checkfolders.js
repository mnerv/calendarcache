const path = require('path')
const fs = require('fs')
const rootDir = path.dirname(require.main.filename)

function createPrimaryFolders() {
  const dataPath = path.join(rootDir, 'data')
  const icsPath = path.join(dataPath, 'ics')
  // const csvPath = path.join(dataPath, 'csv')

  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath)
  if (!fs.existsSync(icsPath)) fs.mkdirSync(icsPath)
  // if (!fs.existsSync(csvPath)) fs.mkdirSync(csvPath)
}

module.exports = { createPrimaryFolders }
