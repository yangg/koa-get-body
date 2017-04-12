/* eslint-env jasmine */

const Koa = require('koa')
const getBody = require('../')

const request = require('supertest')

describe('koa-get-body', function () {
  describe('json body', function () {
    let app
    beforeEach(function () {
      app = new Koa()
    })
    it('should parse json body ok', function (done) {
      app.use(getBody())

      app.use(async ctx => {
        const body = await ctx.request.getBody()
        expect(body).toEqual({ name: 'koa-get-body' })
        ctx.body = body
      })
      request(app.listen())
      .post('/')
      .send({name: 'koa-get-body'})
      .expect({name: 'koa-get-body'}, done)
    })

    it('should parse form body ok', function (done) {
      app.use(getBody())

      app.use(async ctx => {
        const body = await ctx.request.getBody()
        expect(body).toEqual({ name: 'koa-get-body', foo: 'bar' })
        ctx.body = body
      })
      request(app.listen())
      .post('/')
      .send('name=koa-get-body&foo=bar')
      .expect({name: 'koa-get-body', foo: 'bar'}, done)
    })
  })
})
