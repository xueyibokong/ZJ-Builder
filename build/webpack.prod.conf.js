var
    webpack = require('webpack'),
    Merge = require('webpack-merge'),
    webpackBaseConf = require('./webpack.base.conf'),
    config = require('./config')

module.exports = Merge(webpackBaseConf,{
    devtool: 'eval-source-map',
    plugins : [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: config.prod.env
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        /*---------- 使用了 NoEmitOnErrorsPlugin 后页面中的报错不会阻塞，但是会在编译结束后报错  ----------*/
        new webpack.NoEmitOnErrorsPlugin()
    ]
})