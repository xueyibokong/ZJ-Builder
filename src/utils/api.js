const
    axios = require('axios'),
    config = require('@build/config'),
    isProduction = process.env.NODE_ENV === 'production',
    proxyTable = config.dev.proxy,
    Qs = require('querystring')
axios.defaults.paramsSerializer = function(params) {
    return Qs.stringify(params)
}
//解决跨域cookie
axios.defaults.withCredentials = true
axios.defaults.crossDomain =  true
//如果后端服务规定接受Form Data类型的请求参，则需走此判断
if(config.prod.requestType == 'formData'){
    //修改axios请求体的默认配置，此项修改是为了解决axios把上送的json参数转为json字符串的BUG
    axios.defaults.transformRequest = [(data)=>{
        if(!isProduction && config.dev.ismock){
            return data
        }else{
            //formdata类型的数据在遇到多维数组或对象时将第2维数据用JSON.stringify转换，防止数据的上送丢失
            for(let item in data) {
                if (typeof data[item] === 'object'){
                    data[item] = JSON.stringify(data[item])
                }
            }
            return Qs.stringify(data)
        }
    }]
}
export default (param) => {
    var
        url = param.url.charAt(0) === '/' ? param.url : '/' + param.url,
        urlApi = ['/'+url.split('/')[1]]
    if(isProduction){
        //如果是生产环境则替换请求url的path
        param.url = url.replace(urlApi,proxyTable[urlApi])
        //如果设置了生产环境的删除ajax请求头像则截取请求
        param.url = config.prod.deleteRequestHeader ? param.url.substring(param.url.indexOf('//')) : param.url
    }else{
        if(config.dev.ismock){
            //如果是请求mock数据则替换请求url的path
            param.url = url.replace(urlApi,proxyTable[urlApi])
            //如果请求参数有params，则将其合并到data中，以方便mockjs自定义函数在请求实体里获取
            if(param.params != undefined){
                param.data = Object.assign(param.data || {},param.params)
                //删除params，避免querystring追加到url后面造成mockjs匹配不到需要拦截的url
                delete param.params
            }
        }
    }
    return axios(param)
}
/*
 * @_searchParam
 *
 * 此方法用来匹配Api请求参与配置的mockdata数据对应的请求参
 * */
export let _searchParam = (diff,option,mockdata) => {
    option.body = typeof option.body !== 'object' ? eval('('+option.body+')') : option.body
    if(mockdata instanceof Array && mockdata.length == 1){
        return mockdata[0]._resBody || mockdata[0]
    }else if(mockdata instanceof Array && mockdata.length > 1){
        let i = 0
        mockdata.forEach((item,index)=>{
            if(diff(item._reqBody,option.body) == undefined || !(diff(item._reqBody,option.body) instanceof Array)){
                //匹配上了
                i = index
            }
        })
        return mockdata[i]._resBody
    }else{
        return mockdata._resBody || mockdata
    }

}
