
# koa-get-body
A body parser for koa2, support `urlencoded`, `multipart`， `json`，`text` and `xml`(need option xmlParser configed) (return raw body for non-supported mime types)

[![Build Status](https://travis-ci.org/yangg/koa-get-body.svg?branch=master)](https://travis-ci.org/yangg/koa-get-body)
[![npm:](https://img.shields.io/npm/v/koa-get-body.svg?style=flat)](https://www.npmjs.com/packages/koa-get-body)

## Installation
```bash
yarn add koa-get-body
```

## Usage
```js
const Koa = require('koa')
const getBody = require('koa-get-body')

let app = new Koa()
app.use(getBody())
app.use(async ctx => {
  const body = await ctx.request.getBody()
  // or get a single field
  const name = await ctx.request.getBody('name')
})
```
### Custom Options
```js
app.use(getBody({
  alias: 'getPost', // alias func name on `ctx',
  uploadDir: '/path/to/your/dir/',
  xmlParser: utils.paserXML, // see https://github.com/yangg/koa-get-body/blob/master/spec/utils.js
  getFileName: (fieldName) => {
    return shortid.generate()
  },
  limits: {
    fileSize: Infinity,
    // ...
  }
}))
app.use(async ctx => {
  const body = await ctx.getPost() // get body via alias `getPost'
})
```

## Options
* **alias** - *{string}*, append an alias to koa `ctx`, then you can use `ctx.aliasName()`
* **jsonTypes** - *{array|string}*, types to detect as `json`, see [type-is](https://github.com/jshttp/type-is), default: `['json', '+json']`, the following mime types will matched: `application/json`, `application/vnd.api+json`, `application/json-patch+json`
* **textTypes** - *{array|string}, types to detect as `text`, default: `text/*`
* **xmlTypes** - *{array|string}, types to detect as `xml`, default: `xml`
* **xmlParser** - *{function}*, a function to parse xml if you needed
* **uploadDir** - *{string}*, custom upload dir, default to `os.tmpdir()`
* **getFileName** - *{function}*, generate upload temp filename in you own way
* more options: see [Busboy options](https://github.com/mscdex/busboy#busboy-methods)

## TODO
- [ ] add support for array  or object fieldNames (`[]` or `[name]`)

## License
MIT
