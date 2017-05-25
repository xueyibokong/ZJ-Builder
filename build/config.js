module.exports =  {
    dev : {
        env : '"development"',
        cssSourceMap : false,
        outputPublicPath : {                                          //开发环境各资源的工程路径
            js : '/',
            css : '/',
            img : '/',
            font : '/'
        },
        outputFilename : {
            js : 'js/[name].[hash:7].js',                             //生产环境js文件名
            css : 'css/[name].[hash:7].css',                          //生产环境css文件名
            common_css : 'css/common.[hash:7].css',                   //生产环境公共css文件名
            img : 'img/[name].[ext]?[hash:7]'                         //生产环境img文件名
        },
        /*------------ WDS服务器配置 -----------*/
        server :{
            port : 3003,
            open : false
        },
        /*------------ 前端服务（WDS）代理请求后端服务 ------------*/
        proxy : {
            '/host08' : 'http://localhost:3008',
            '/test'   : 'http://test.flydiv.com'
        },
        /*------------ mock数据状态 ------------*/
        ismock : true
    },
    prod : {
        env : '"production"',
        cssSourceMap : true,
        outputPublicPath : {                                  //生产环境各资源cdn路径
            js : 'http://js.flydiv.com',
            css : 'http://css.flydiv.com',                    //目前css的cdn路径重写存在问题【待解决】
            img : 'http://img.flydiv.com',
            font : 'http://font.flydiv.com'
        },
        outputFilename : {
            js : 'js/[name].js',                               //生产环境js相对路径
            css : 'css/[name].css',                            //生产环境css相对路径
            common_css : 'css/common.css',                     //生产环境公共css文件名
            img : 'img/[name].[ext]'                           //生产环境img相对路径
        }
    }
}