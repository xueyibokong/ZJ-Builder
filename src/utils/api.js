const
    axios = require('axios'),
    config = require('@build/config'),
    isProduction = process.env.NODE_ENV === 'production',
    proxyTable = config.dev.proxy
    global.ismock = config.dev.ismock && !isProduction
export default (param) => {
    var
        url = param.url.charAt(0) === '/' ? param.url : '/' + param.url,
        urlApi = ['/'+url.split('/')[1]]

    if(isProduction || ismock){
        //如果是生产环境或者是请求mock数据则替换请求url
        param.url = url.replace(urlApi,proxyTable[urlApi])
    }
    console.log(param.url)
    return axios(param)
}