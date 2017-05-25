var
    path = require('path'),
    config = require('./config'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"), //抽离css单独打包的的插件
    glob = require('glob')                                      //允许使用 * 等符号匹配path

var
    isProduction = process.env.NODE_ENV === 'production'

//设置相对当前文件路径的绝对路径
exports.resolve = function (dir){
    return path.join(__dirname,dir);
}

//抽离vue中css样式单独打包
exports.cssLoaderExtract = function(){
    var
        vueCssExtracts = [],
        cssExtracts = [],
        vueCssLoaders = {},
        cssLoaders = [],
        loaderType = ['css','less','sass','scss','postcss']

    //第一次循环为了生成抽取对象
    loaderType.forEach(function(item,index){
        vueCssExtracts.push(
            new ExtractTextPlugin({
                filename : isProduction ? config.prod.outputFilename.css : config.dev.outputFilename.css,
                allChunks : true
            })
        )
        cssExtracts.push(
            new ExtractTextPlugin({
                filename : isProduction ? config.prod.outputFilename.common_css : config.dev.outputFilename.common_css,
                allChunks : true
            })
        )
    })
    //到二次循环是为了利用没个抽取对象配置loader
    loaderType.forEach(function(item,index){
        var use = (item === 'css' || item === 'postcss') ? ['css-loader'] : ['css-loader',(item === 'scss' ? 'sass' : item) + '-loader']
        Object.assign(vueCssLoaders,{
            [item] : vueCssExtracts[index].extract({
                use: use,
                fallback: 'vue-style-loader',
                publicPath : isProduction ? config.prod.outputPublicPath.css : config.dev.outputPublicPath.css
            })
        })
        cssLoaders.push({
            test : new RegExp('\\.' + item + '$'),
            use : cssExtracts[index].extract({
                use: use,
                fallback: 'style-loader',
                publicPath : isProduction ? config.prod.outputPublicPath.css : config.dev.outputPublicPath.css
            })
        })
    })
    return {
        vueCssExtracts,
        cssExtracts,
        vueCssLoaders,
        cssLoaders
    }
}

//配合htmlPlugin修改多页面入口
exports.getEntry = function (globPath) {
    var
        entries = {},
        tmp,
        pathname
    glob.sync(globPath).forEach(function (entry) {
        tmp = entry.split('/').splice(-2)
        pathname = tmp.splice(0, 1) // 正确输出js和html的路径
        entries[pathname] = entry
    })
    return entries
}
//proxy代理项，多项代理根据config.dev.proxy
var
    apiConfig = config.dev.proxy
    //设置全局变量ismock可以在开发文件夹取此值
    ismock = config.dev.ismock
exports.proxyTalbe = {
    "**" : {
        target:"http://localhost:" + config.dev.server.port,
        changeOrigin:true,
        secure: false,
        pathRewrite : function(path,req){
            return path.replace('/' + path.split('/')[1], '');
        },
        router : (req) => {
            var apiPath = '/' + req.url.split('/')[1]
            if(apiPath in apiConfig){
                return apiConfig[apiPath]
            }
        },
        bypass : (req, res, proxyOptions) => {
            var apiPath = '/' + req.url.split('/')[1]
            if(!(apiPath in apiConfig)){
                return false
            }
            console.log('[req: ]',req.url + '路径将请求到目标为' + apiConfig[apiPath] + '的服务上')
        }
    }
}
//创建mock数据文件根据config.dev.proxy
var fs = require('fs')
function MkMockdata(apiConf){
    var dir = path.join(__dirname,'../src/mockdata')
    for(var key in apiConfig){
        var file = dir + key + '.do.js'
        //判断是否已经有mockdata文件
        if(!fs.existsSync(file)){
            var innerData =
`let data = {
    //此处编写mockjs数据模板，或json数据
}
let Mock = require('mockjs')
Mock.mock(${'"' + [apiConfig[key]]+'"'}, data).setup({
    timeout: '200-600'
})`
            fs.writeFileSync(file,innerData, 'utf8', function(err){
                console.log('创建文件'+file)
            })
        }
    }
}
if(ismock) MkMockdata(apiConfig)

