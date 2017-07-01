var
    webpack = require('webpack'),
    path = require('path'),
    utils = require('./utils'),
    config = require('./config'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    px2rem = require('postcss-px2rem'),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')//error排序输出，友好的报错日志

var isProduction = process.env.NODE_ENV === 'production',
    cssLoaderExtract = utils.cssLoaderExtract(),
    htmlEntry = utils.getEntry('./src/module/**/index.html'),
    jsEntry = utils.getEntry('./src/module/**/main.js')

var
    baseConf = {
    entry: (function(){
        var newJsEntry = {}
        for(var item in jsEntry){
            newJsEntry[item] = ['babel-polyfill','console-polyfill',jsEntry[item]]
        }
        return newJsEntry
    })(),
    output: {
        path: path.resolve(__dirname, '../dist'),                                             //对应一个本地绝对路径，此路径是你希望一次性打包的根目录。
        publicPath: isProduction
                    ?config.prod.outputPublicPath.js:config.dev.outputPublicPath.js,          //path指定了本地构建地址，publicPath指定的是构建后在针对WDS根的路径，一般也是用这个来指定上线后的cdn域名【已理解】
        filename:   isProduction
                    ?config.prod.outputFilename.js:config.dev.outputFilename.js
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [utils.resolve('../src')],         //指定此范围为有效范围
                options: {
                    loaders:cssLoaderExtract.vueCssLoaders
                    // 其他的vue-loader放在这里
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/                     //指定此范围为无效范围
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',                       //url-loader是对file-loader的上层封装可用于转换图片为base64
                include: [utils.resolve('../src/static/img')],//指定有效范围是有意控制img在第三方库的出现，尽量保证第三方库引用的是字体图标
                options: {
                    limit: 10000,                           //转变base64
                    name: isProduction ? config.prod.outputFilename.img : config.dev.outputFilename.img,
                    publicPath:isProduction ? config.prod.outputPublicPath.img : config.dev.outputPublicPath.img
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/, //字体图标不指定范围是为了防止第三方库引用字体图标而不被打包
                loader: 'file-loader',
                options: {
                    limit: 10000,                           //转变base64
                    name: isProduction ? config.prod.outputFilename.font : config.dev.outputFilename.font,
                    publicPath:isProduction ? config.prod.outputPublicPath.font : config.dev.outputPublicPath.font
                }
            }
        ]
    },
    resolve: {
        extensions:['.js','.vue','.json','.css'],                   //自动补全
        alias: {                                            //别名
            'vue$': 'vue/dist/vue.esm.js',
            '@build' : utils.resolve(''),
            '@nm':utils.resolve('../node_modules'),
            '@component' : utils.resolve('../src/component'),
            '@mockdata' : utils.resolve('../src/mockdata'),
            '@module' : utils.resolve('../src/module'),
            '@static' : utils.resolve('../src/static'),
            '@utils' : utils.resolve('../src/utils'),
            'Api' : utils.resolve('../src/utils/api')
        }
    },
    performance: {
        hints: false
    },
    plugins : [
        /*----------- 多入口node模块部分 -----------*/
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'],
            minChunks: function (module) {
                // 该配置假定你引入的 vendor 存在于 node_modules 目录中
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),

        /*----------- 多入口公共部分 -----------*/
        new webpack.optimize.CommonsChunkPlugin({
            name: ['common'],
            minChunks: 2//被公用2次以上
        }),

        /*-------------控制台输出提示美化--------------*/
        new FriendlyErrorsPlugin(),

        new webpack.LoaderOptionsPlugin({
            vue: {
                // 使用用户自定义插件
                postcss: [require('autoprefixer')(),require('postcss-px2rem')({remUnit: 75})]
            }
        })
    ]

}
baseConf.module.rules = baseConf.module.rules
    .concat(cssLoaderExtract.cssLoaders)
    .concat(cssLoaderExtract.privateCssLoaders)
baseConf.plugins = baseConf.plugins
    .concat(cssLoaderExtract.vueCssExtracts)
    .concat(cssLoaderExtract.cssExtracts)
    .concat(cssLoaderExtract.privateCssExtracts)
    .concat(HtmlWebpackPlugins())

/*
* 在开发环境中,这里包装的html、
* js等是在内存中的可以通过浏
* 览器访问查看效果
* */
function HtmlWebpackPlugins(){
    var
        htmlplugins = [];
    for (var pathname in htmlEntry){
        var
            htmlplugin = new  HtmlWebpackPlugin({
            filename: pathname + '.html',
            template: htmlEntry[pathname],
            chunks : [pathname,'vendor', 'common'],
            inject: true,
            minify: isProduction ? {        //压缩HTML文件
                removeComments: true,       //移除HTML中的注释
                collapseWhitespace: false,  //删除空白符与换行符
                removeAttributeQuotes: true //去除属性引用
            } : false
        })
        htmlplugins.push(htmlplugin)
    }
    return htmlplugins;
}
module.exports = baseConf
console.log('--------------','当前环境是',process.env.NODE_ENV,'--------------')