'use strict'
var request = require('request-promise')
var iconv = require('iconv-lite')

var ApiContent = {
  //通关状态
  gatewaystate: {
    uri: 'http://www.haiguan.info/OnLineSearch/Gateway/weixin/weixinGatewayStateResult.aspx',
    referer: 'http://www.haiguan.info/OnLineSearch/Gateway/weixin/weixinGatewayState.html',
  },
  //企业信息
  companyinfo: {
    uri: 'http://www.haiguan.info/OnLineSearch/Gateway/weixin/weixinCompanyInfoResult.aspx',
    referer: 'http://www.haiguan.info/OnLineSearch/Gateway/weixin/weixinCompanyInfo.html'

  },
  //商品归类
  productclass: {
    uri: 'http://www.haiguan.info/OnLineSearch/Gateway/weixin/weixinProductClassResult.aspx',
    referer: 'http://www.haiguan.info/OnLineSearch/Gateway/weixin/weixinproductClass.html'
  }
}

class Req {
  constructor(opt) {
    this.uri = opt.uri
    this.referer = opt.referer
    this.form = opt.form
    this.body = opt.form
    this.requestInfo = {
      method: 'POST',
      uri: this.uri,
      //加入encoding选项,可以直接 decode body, 不需要转换
      encoding: 'binary',

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: this.referer
      },
      form: this.form
    }
  }
  request() {
    return request(this.requestInfo)
  }
}

module.exports = {
  Req,
  ApiContent
}
