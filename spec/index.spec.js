/* eslint-env jasmine */

const Koa = require('koa')
const getBody = require('../')

const request = require('supertest')
const fs = require('fs')

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

    it('should parse json body ok', function (done) {
      app.use(getBody())

      app.use(async ctx => {
        const body = await ctx.request.getBody()
        expect(body).toEqual({ name: 'koa-get-body' })
        ctx.body = body
      })
      request(app.listen())
      .post('/')
      .set('Content-type', 'application/vnd.api+json')
      .send({name: 'koa-get-body'})
      .expect({name: 'koa-get-body'}, done)
    })

    it('should parse form body ok', function (done) {
      app.use(getBody())

      app.use(async ctx => {
        const body = await ctx.request.getBody()
        expect(body).toEqual({ name: 'koa-get-body' })
        ctx.body = body
      })
      request(app.listen())
      .post('/')
      .type('form')
      .send({ name: 'koa-get-body' }) // foo: { bar: 'barz' }, tags: ['node', 'koa']
      .expect({ name: 'koa-get-body' }, done)
    })

    it('should parse multipart ok', function (done) {
      app.use(getBody())

      app.use(async ctx => {
        const body = await ctx.request.getBody()
        expect(ctx.request.type).toEqual('multipart/form-data')
        expect(body.name).toEqual('koa-get-body')
        expect(fs.readFileSync(body.avatar.tmpPath)).toEqual(fs.readFileSync(__dirname + '/avatar.gif'))
        ctx.body = body
      })
      request(app.listen())
      .post('/')
      .field('name', 'koa-get-body')
      .attach('avatar', 'spec/avatar.gif')
      .expect('name', 'koa-get-body', done)
    })

    it('should return raw body for non-supported mime types', function (done) {
      app.use(getBody())

      app.use(async ctx => {
        const body = await ctx.request.getBody()
        expect(body).toEqual('hello')
        ctx.body = body
      })
      request(app.listen())
      .post('/')
      .type('text')
      .send('hello')
      .expect('hello', done)
    })
  })
})
