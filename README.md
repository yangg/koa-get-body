
# koa-get-body
A body parser for koa2, support `urlencoded`, `multipart` and `json`

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
* **jsonTypes** - *{array}*, types to detect as `json`, see [type-is](https://github.com/jshttp/type-is), default: ['json', 'json'], the following mime type will matched: `application/json`, `application/vnd.api+json`, `application/json-patch+json`
* **uploadDir** - *{string}*, custom upload dir, default to `os.tmpdir()`
* **getFileName** - *{function}*, generate upload temp filename in you own way
* more options: see [Busboy options](https://github.com/mscdex/busboy#busboy-methods)

## TODO
- [ ] add support for array  or object fieldNames (`[]` or `[name]`)

## License
MIT