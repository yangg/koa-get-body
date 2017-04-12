
const os = require('os')
const Busboy = require('busboy')
const fs = require('fs')
const path = require('path')

function main (options) {
  options = Object.assign({
    alias: null,
    uploadDir: os.tmpdir(),
    jsonTypes: ['json', '+json'], // check type via ctx.is, see https://github.com/jshttp/type-is
    getFileName: (fieldName) => {
      return (Math.random().toString(36) + Date.now().toString(36)).substr(2, 16)
    }
  }, options)
  return async function (ctx, next) {
    let formData
    ctx.request.getBody = getBody
    options.alias && (ctx[options.alias] = getBody)
    return await next()
    async function getBody (name, defaultValue = '') {
      if (!formData) {
        if (ctx.is('multipart', 'urlencoded')) {
          formData = await formParser(ctx.req, Object.assign({ headers: ctx.req.headers }, options))
        } else if (ctx.is(options.jsonTypes)) {
          formData = await jsonParser(ctx.req)
        } else {
          formData = Promise.resolve({})
        }
      }
      if (arguments.length > 0) {
        return formData.hasOwnProperty(name) ? formData[name] : defaultValue
      }
      return formData
    }
  }
}

function jsonParser (req) {
  return new Promise(resolve => {
    let fullBody = ''
    req.on('data', chunk => {
      fullBody += chunk.toString()
    })
    req.on('end', () => {
      resolve(JSON.parse(fullBody))
    })
  })
}

function formParser (req, options) {
  const busboy = new Busboy(options)
  return new Promise((resolve, reject) => {
    let formData = {}
    let hasError
    busboy.on('file', function (fieldName, stream, filename, encoding, mimeType) {
      // save tmp files
      const tmpPath = path.join(options.uploadDir, options.getFileName(fieldName))
      let fileSize = 0
      stream.pipe(fs.createWriteStream(tmpPath))
      stream.on('data', function (data) {
        fileSize += data.length
      })
      stream.on('end', function () {
        // push file data
        formData[fieldName] = fileSize > 0 ? {
          fileName: filename,
          fileSize: fileSize,
          mimeType: mimeType,
          tmpPath: tmpPath
        } : null
      })
      stream.on('limit', function () {
        hasError = 'fileSizeLimit'
      })
    })
    busboy.on('field', function (fieldName, val) {
      // push text data
      formData[fieldName] = val
    })
    busboy.on('partsLimit', function () {
      hasError = 'partsLimit'
    })
    busboy.on('filesLimit', function () {
      hasError = 'filesLimit'
    })
    busboy.on('fieldsLimit', function () {
      hasError = 'fieldsLimit'
    })
    busboy.on('finish', function () {
      if (hasError) {
        reject(new Error(hasError))
      } else {
        resolve(formData)
      }
    })
    req.pipe(busboy)
  })
}

module.exports = main
