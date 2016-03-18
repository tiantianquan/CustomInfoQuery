var Router = require('koa-router')
var iconv = require('iconv-lite')
var urlencode = require('urlencode')
var cheerio = require('cheerio')
var Api = require('../api')


var router = new Router()

var queryRouter = new Router({
  prefix: '/wx/xyt'
})

var baseReq = function*(next) {
  var reqInfo = Api.ApiContent[this.request.path.split('/')[3].toLowerCase()]
  for(var i in this.request.body) {
    this.request.body[i] = iconv.encode(this.request.body[i], 'gbk')
  }
  var req = new Api.Req(Object.assign(
    reqInfo, {
      form: this.request.body
    }
  ))
  if(this.request.path.toLowerCase().indexOf('companyinfo')!=-1){
    for(var i in this.request.body) {
      this.request.body[i] = iconv.decode(this.request.body[i], 'gbk')
      this.request.body[i] = urlencode(this.request.body[i], 'gbk')
    }
    delete req.requestInfo.form
    req.requestInfo.body = 'companyName='+this.request.body['companyName']
    console.log(req.requestInfo)
  }

  // req.form = this.request.body
  var res = yield req.request()
  res = iconv.decode(res, 'gbk')
  this.state.$ = cheerio.load(res)
  this.state.resultTable = this.state.$('.content > table ')
  yield next
}

/**
 * 通关状态
 */
queryRouter.get('/gatewayState', function*(next) {
  yield this.render('query', {
    headText: '通关状态',
    placeholder:'请填写18位报关单号',
    formName: 'stateCode'
  })
})

queryRouter.post('/gatewayState', baseReq, function*(next) {
  yield this.render('result', {
    headText: '通关状态',
    table: this.state.resultTable.addClass('table table-bordered')
  })
})

/**
 * 企业信息
 */
queryRouter.get('/companyInfo', function*(next) {
  yield this.render('query', {
    headText: '企业信息',
    placeholder:'请填写企业名称',
    formName: 'companyName'
  })
})

queryRouter.post('/companyInfo', baseReq, function*() {
  yield this.render('result', {
    headText: '企业信息',
    table: this.state.resultTable.addClass('table table-bordered')
  })
})

/**
 * 商品归类
 */
queryRouter.get('/productClass', function*(next) {
  yield this.render('query', {
    headText: '商品归类',
    placeholder:'请输入商品名称',
    formName: 'productName'
  })
})

queryRouter.post('/productClass', baseReq, function*() {
  yield this.render('result', {
    headText: '商品归类',
    table: this.state.resultTable.addClass('table table-bordered')
  })
})


router.use('', queryRouter.routes())

module.exports = router
