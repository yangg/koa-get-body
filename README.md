
# koa-get-body
A body parser for koa2, support `urlencoded`, `multipart` and `json`

[![Build Status](https://travis-ci.org/yangg/koa-get-body.svg?branch=master)](https://travis-ci.org/yangg/koa-get-body)
[![npm:](https://img.shields.io/npm/v/koa-get-body.svg?style=flat)](https://www.npmjs.com/packages/koa-get-body)

## Installation
```bash
yarn add koa-get-body
```

## Options
* **alias**: append an alias to koa `ctx`, thun you can use `ctx.aliasName()`
* more options: see [Busboy options](https://github.com/mscdex/busboy#busboy-methods)

## TODO
[] add support for fieldName with `[]` or `[name]`

## License
MIT