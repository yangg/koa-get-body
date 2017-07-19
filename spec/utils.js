
const xml2js = require('xml2js')
const parser = new xml2js.Parser({ trim: true, explicitArray: false, explicitRoot: false })
module.exports.parseXML = function (xml) {
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

module.exports.buildXML = function (json) {
  var builder = new xml2js.Builder()
  return builder.buildObject(json)
}
