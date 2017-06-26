var
    webpack = require('webpack'),
    merge  = require('webpack-merge'),
    webpackBaseConf = require('./webpack.base.conf'),
    utils = require('./utils'),
    config = require('./config')
    require("babel-polyfill")
if(config.dev.ismock){
    var mockdatafiles = []
    Object.keys(config.dev.proxy).forEach(function (item,index) {
        item = item.charAt(0) === '/' ? item : '/' + item
        mockdatafiles.push('./src/mockdata' + item + '.do.js')
    })
    Object.keys(webpackBaseConf.entry).forEach(function (name) {
        webpackBaseConf.entry[name] = mockdatafiles.concat(webpackBaseConf.entry[name])
    })
}
module.exports = merge(webpackBaseConf,{
    devtool: 'cheap-module-eval-source-map',
    plugins : [
        new webpack.DefinePlugin({           //此项设置在windows系统上无发生效，兼容方式是利用cross-env模块在cli上设置环境,eg: cross-env NODE_ENV=development
            'process.env': {
                NODE_ENV: config.dev.env
            }
        }),

        /*---------- 模块热替换 ----------*/
        new webpack.HotModuleReplacementPlugin(),//此配置项配合devServer配置项中的hot实现热替换，如果是在cli中传入--hot参数同时又调用此插件的话则会出现无限制递归导致栈溢出

        /*---------- 使用了 NoEmitOnErrorsPlugin 后页面中的报错不会阻塞，但是会在编译结束后报错  ----------*/
        new webpack.NoEmitOnErrorsPlugin()
    ],

    /*---------- webpack-dev-server配置 ----------*/
    devServer: Object.assign({
        port:8888,
        //contentBase : utils.resolve(__dirname,'../src'),                       //告诉服务器从哪里提供内容。只有在你想要暴露静态文件时才需要 eg: utils.resolve(__dirname,'../dist/static')
        historyApiFallback: true,                                                //不跳转
        noInfo: true,
        inline: true,                                                            //实时刷新
        hot : true,                                                              //热替换
        open : true,                                                             //自动打开浏览器
        proxy : config.dev.ismock ? {} : utils.proxyTalbe                        //通过ismock字段控制是否走代理
    },config.dev.server)
})