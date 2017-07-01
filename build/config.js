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
            vendor_css : 'css/vendor.[hash:7].css',
            img : 'img/[name].[ext]?[hash:7]',                        //生产环境img文件名
            font : 'font/[name].[ext]?[hash:7]'                       //生产环境字体图标文件名
        },
        /*------------ WDS服务器配置 -----------*/
        server :{
            port : 3003,
            open : true
        },
        /*------------ 前端服务（WDS）代理请求后端服务 ------------*/
        proxy : {
            '/citylist' : 'http://localhost:3008/citylist',                     //城市列表
        },
        /*------------ mock数据状态 ------------*/
        ismock : true
    },
    prod : {
        env : '"production"',
        cssSourceMap : false,
        jsSourceMap : false,                                  //sourceMap会导致bundle文件体积变大多倍，所以在上生产环境时将此项设置为false，测试环境可以设置为true，便于调试
        outputPublicPath : {                                  //生产环境各资源cdn路径(tip：路径末尾必须加'/')
            js : '//j1.58cdn.com.cn/crop/biz/pc/union_vip/rebateEdit/',
            css : '//c.58cdn.com.cn/crop/biz/pc/union_vip/rebateEdit/',
            img : '//img.58cdn.com.cn/crop/biz/pc/union_vip/rebateEdit/',
            font : '//img.58cdn.com.cn/webfonts/biz/pc/union_vip/rebateEdit/'
        },
        outputFilename : {
            js : 'js/[name].js',                               //生产环境js相对路径
            css : 'css/[name].css',                            //生产环境css相对路径
            common_css : 'css/common.css',                     //生产环境公共css文件名
            vendor_css : 'css/vendor.css',
            img : 'img/[name].[ext]',                          //生产环境img相对路径
            font : 'font/[name].[ext]'                         //生产环境字体图标文件名
        },
        deleteRequestHeader : true,                            //此项配置是控制生产环境下ajax请求是否保留协议头
        requestType : 'formData'                               //请求实体数据类型[formdata<=>'formData',json<=>'',querystring]
    }
}