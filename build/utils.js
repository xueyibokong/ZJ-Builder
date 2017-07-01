var
    path = require('path'),
    config = require('./config'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"), //抽离css单独打包的的插件
    glob = require('glob'),                                      //允许使用 * 等符号匹配path
    Url = require('url')

var
    isProduction = process.env.NODE_ENV === 'production',
    postcssConf =  {
        loader:'postcss-loader',
        options:{           // 如果没有options这个选项将会报错 No PostCSS Config found
            plugins: (loader) => [
                require('autoprefixer'),
                require('postcss-px2rem')({remUnit: 75})
            ]
        }
    }
//设置相对当前文件路径的绝对路径
exports.resolve = function (dir){
    return path.join(__dirname,dir);
}

//抽离vue中css样式单独打包
exports.cssLoaderExtract = function(){
    var
        loaderType = ['css','less','sass','scss','postcss'],
        vueCssExtracts = [],        //vue中css提取打包为[name].css（仅当vue开发）
        cssExtracts = [],           //src/static/css中css提取打包为common.css
        privateCssExtracts = [],    //src/module/**中css提取打包为[name].css（仅当普通开发）
        vueCssLoaders = {},
        cssLoaders = [],
        privateCssLoaders = []

    if(isProduction){
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
            privateCssExtracts.push(
                new ExtractTextPlugin({
                    filename : isProduction ? config.prod.outputFilename.css : config.dev.outputFilename.css,
                    allChunks : true
                })
            )
        })
        //到二次循环是为了利用没个抽取对象配置loader
        loaderType.forEach(function(item,index){
            var use = (item === 'css' || item === 'postcss') ? ['css-loader'] : ['css-loader',(item === 'scss' ? 'sass' : item) + '-loader'],
                use1 = (item === 'css' || item === 'postcss') ? ['css-loader',postcssConf] : ['css-loader',postcssConf,(item === 'scss' ? 'sass' : item) + '-loader']
            Object.assign(vueCssLoaders,{
                [item] : vueCssExtracts[index].extract({
                    use: use,
                    fallback: 'vue-style-loader',
                    publicPath : isProduction ? config.prod.outputPublicPath.css : config.dev.outputPublicPath.css
                })
            })
            cssLoaders.push({
                test : new RegExp('\\.' + item + '$'),
                include: path.join(__dirname,'../src/static'),
                use : cssExtracts[index].extract({
                    use: use1,
                    fallback: 'style-loader',
                    publicPath : isProduction ? config.prod.outputPublicPath.css : config.dev.outputPublicPath.css
                })
            })
            privateCssLoaders.push({
                test : new RegExp('\\.' + item + '$'),
                include: path.join(__dirname,'../src/module'),
                use : privateCssExtracts[index].extract({
                    use: use1,
                    fallback: 'style-loader',
                    publicPath : isProduction ? config.prod.outputPublicPath.css : config.dev.outputPublicPath.css
                })
            })
        })
        // node_nodules中css提取打包为vonder.css
        var vendorCssExtracts = new ExtractTextPlugin({
            filename : isProduction ? config.prod.outputFilename.vendor_css : config.dev.outputFilename.vendor_css,
            allChunks : true
        })
        cssExtracts.push(vendorCssExtracts)
        cssLoaders.push({
            test:/\.css$/,
            include: /node_modules/,                     //指定此范围为无效范围
            use : vendorCssExtracts.extract({
                use: 'css-loader',
                fallback: 'style-loader',
                publicPath : isProduction ? config.prod.outputPublicPath.css : config.dev.outputPublicPath.css
            })
        })
    }else{
        loaderType.forEach(function(item,index){
            var vue_loaders = [{
                loader : 'vue-style-loader'
            },{
                loader : 'css-loader'
            }]
            item === 'css' || item === 'postcss' ? vue_loaders : vue_loaders.push({loader: (item === 'scss' ? 'sass' : item)+'-loader'})
            Object.assign(vueCssLoaders,{
                [item] : vue_loaders
            })
            var loaders = [{
                loader : 'style-loader'
            },{
                loader : 'css-loader'
            },postcssConf]
            item === 'css' || item === 'postcss' ? loaders : loaders.push({loader:(item === 'scss' ? 'sass' : item)+'-loader'})
            cssLoaders.push({
                test : new RegExp('\\.' + item + '$'),
                use : loaders
            })
        })
    }
    return {
        vueCssExtracts,
        cssExtracts,
        privateCssExtracts,
        vueCssLoaders,
        cssLoaders,
        privateCssLoaders
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
    apiConfig = config.dev.proxy,
    ismock = config.dev.ismock && !isProduction
exports.proxyTalbe = {
    "**" : {
        target:"http://localhost:" + config.dev.server.port,
        changeOrigin:true,
        secure: false,
        pathRewrite : function(path,req){
            var pathObj = Url.parse(path)
            // console.log('+++',pathObj.pathname.split('/')[1],path)
            return path.replace('/' + pathObj.pathname.split('/')[1], '');
        },
        router : (req) => {
            req.url = req.url.charAt(0) === '/' ? req.url : '/' + req.url
            var pathObj = Url.parse(req.url),
                apiPath = '/' + pathObj.pathname.split('/')[1]
            // console.log('---',pathObj.pathname.split('/')[1])
            if(apiPath in apiConfig){
                return apiConfig[apiPath]
            }else{
                return false
            }
        },
        bypass : (req, res, proxyOptions) => {
            req.url = req.url.charAt(0) === '/' ? req.url : '/' + req.url
            var pathObj = Url.parse(req.url),
                apiPath = '/' + pathObj.pathname.split('/')[1]
            if(!(apiPath in apiConfig)){
                return false
            }
            console.log('[req: ]',req.url + '路径将请求到目标为' + apiConfig[apiPath] + (pathObj.search || '') + '的服务上')
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
//以下方法请勿修改
import Mock from 'mockjs'
import { _searchParam } from 'Api'
import Diff from 'deep-diff'
Mock.mock(${'"' + [apiConfig[key]]+'"'}, function(option){
    return _searchParam(Diff.diff || Diff.default.diff,option,data)
}).setup({timeout: '200-1000'})`
            fs.writeFileSync(file,innerData, 'utf8', function(err){
                console.log('创建文件'+file)
            })
        }else{
            let readStream = fs.createReadStream(file),data = '',apiConfigItem = apiConfig[key],innerFile = file
            readStream.on('data', function(chunk) {
                data += chunk;
                if(data.match(/Mock\.mock\(\"(\S*)\",\s{0,}function/)[1] != apiConfigItem){
                    //证明此文件对应接口修改了
                    let str = data.match(/Mock\.mock\(\"(\S*)\",\s{0,}function/)[1]
                    fs.writeFile(innerFile,data.replace(str,apiConfigItem), 'utf8', function(err){
                        console.log('修改文件'+innerFile)
                    })
                }
            });
        }
    }
}
if(ismock) MkMockdata(apiConfig)

