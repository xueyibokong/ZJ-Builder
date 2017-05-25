let data = {
    //此处编写mockjs数据模板，或json数据
}
let Mock = require('mockjs')
Mock.mock("http://test.flydiv.com", data).setup({
    timeout: '200-600'
})