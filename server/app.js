var koa = require('koa')
var views = require('koa-views')
var process = require('process')
var staticCache = require('koa-static-cache')
var path = require('path')
var bodyParser = require('koa-bodyparser')
var qs = require('koa-qs')
var gzip = require('koa-gzip')
var path = require('path')

var router = require('./controllers')

//---------------------------------------------------------
//初始化
var app = koa()
app.use(function*(next) {
  this.env = process.env.NODE_ENV
  yield next
})

//session
var session = require('koa-generic-session')
app.use(session())
app.keys = 'reegle'


//查询字符串解析
qs(app)

app.use(staticCache(path.resolve(__dirname, '..', 'public'), {
  maxage: 60 * 60 * 24 * 365,
  dynamic: true,
  gzip:true
}))

//初始化模板引擎
app.use(views('../client/template', {
  default: 'jade',
  map: {
    html: 'jade'
  }
}))

app.use(bodyParser())

//挂载路由
app.use(router.routes())


app.use(gzip())


app.on('error', function(err) {
  console.log('server error', err)
})


app.listen(3000)
