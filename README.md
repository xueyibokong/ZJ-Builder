# 脚手架介绍
## 目录
    .
    ├── build..............................【环境依赖】
    │   ├── config.js......................【项目自定义配置项】
    │   ├── css-publicpath-reset.js........【解决css的cdn路径的webpack小插件】
    │   ├── utils.js.......................【webpack配置所需方法】
    │   ├── webpack.base.conf.js...........【webpack配置】
    │   ├── webpack.dev.conf.js............【webpack开发环境配置】
    │   └── webpack.prod.conf.js...........【webpack生产环境配置】
    ├── src................................【项目开发目录】
    │   ├── component......................【组件目录 ps:适合vue开发】
    │   ├── mockdata.......................【前端挡板数据】
    │   ├── module.........................【多页面文件夹目录】
    │   │   ├── pageOne....................【_示例页1_】
    │   │   │   ├── index.html.............【必建固定名文件，作为编译入口模板】
    │   │   │   ├── main.js................【必建固定名文件，作为编译入口js】
    │   │   │   └── App.vue................【选建非固定名（建议固定）文件，作为vue开发的根组件】
    │   │   └── pageTwo....................【_示例页2_】
    │   ├── static.........................【开发所需静态文件目录】
    │   │   ├── css........................【css】
    │   │   ├── font.......................【字体图标】
    │   │   └── img........................【图片】
    │   └── utils..........................【公用方法目录】
    │       └── api.js.....................【ajax请求，对axios包装】
    ├── .babelrc...........................【babel配置文件】
    ├── .gitignore.........................【git提交忽略配置】
    ├── APIserver.js.......................【node服务】
    └── package.json.......................【npm配置】
## 安装依赖： 
    $ npm install
## npm任务：
### 启动 webpack-dev-server 进入开发环境
    $ npm start 或 npm run dev
    说明：
        服务启动后不会在硬盘创建编译后的文件，而是创建在内存当中，以localhost:'port'作为服务根目录，css是嵌入式的，
        框架会创建以下目录：
            .
            ├── js.................................【编译后各页面引用的js文件】
            │   ├── common.[hash:7].js.............【多页面共同引用过的js文件打包后的文件】
            │   ├── vendor.[hash:7].js.............【多页面引用node_modules下的js打包后文件】
            │   ├── pageOne.[hash:7].js............【示例页1的私有js文件打包文件】
            │   └── pageTwo.[hash:7].js............【示例页2的私有js文件打包文件】
            ├── img................................【img 小于10k的转变为base64，可以在webpack.base.conf中修改】
            ├── font...............................【字体图标 同上】
            ├── pageOne.html.......................【示例页1模板】
            └── pageTwo.html.......................【示例页2模板】
        访问页面可以在浏览器输入localhost:'port'/pageOne.html访问页面    
### 构建生产环境dist文件夹
    $ npm run build
    说明：
        build后将会在项目根目录下创建以下目录:
            .
            ├── css................................【编译后各页面引用的css文件】
            │   ├── common.css.....................【多页面共同引用过的css文件打包后的文件】
            │   ├── vendor.css.....................【多页面引用node_modules下的css打包后文件】
            │   ├── pageOne.css....................【示例页1的私有css文件打包文件】
            │   └── pageTwo.css....................【示例页2的私有css文件打包文件】
            ├── js.................................【编译后各页面引用的js文件】
            │   ├── common.js......................【多页面共同引用过的js文件打包后的文件】
            │   ├── vendor.js......................【多页面引用node_modules下的js打包后文件】
            │   ├── pageOne.js.....................【示例页1的私有js文件打包文件】
            │   └── pageTwo.js.....................【示例页2的私有js文件打包文件】
            ├── img................................【img 小于10k的转变为base64，可以在webpack.base.conf中修改】
            ├── font...............................【字体图标】
            ├── pageOne.html.......................【示例页1模板】
            └── pageTwo.html.......................【示例页2模板】
### 启动服务配合跨域请求的测试【可以不用关注】
    $ npm run _API
### 生成bundle文件的stats.json
    $ npm run _bundlestats
    说明：
        为webpack build后的bundle文件生成stats.json在根目录下，供分析打包后文件的详情，这里有两个网站实现可视化分析此json文件，
        1、http://alexkuz.github.io/webpack-chart/
        2、http://webpack.github.io/analyse/
        通过上传stats.json文件就可以可视化分析。
    注意：在生成stats.json文件后需要打开该文件，将文件头部的非json文本删除    
## 几个重要功能点的应用
### 多页面
    1、在目录src -> module下创建文件夹，其命名将在编译后被作为此页面对应的html文件名，在每个页面的文件
    夹下手动创建2个固定命名文件，main.js做为webpack编译入口，index.html做为htmlWebpackPlugin编译的
    模板入口文件，另外如果是vue开发可以选建App.vue文件，此文件命名为非固定的，不过建议同意命名为App.vue,
    因为我们可以把多页应用的每一页都看做为一个单页应用。
    2、在build后的目录中是这样规划多的，vendor.js、common.js、common.css做为公共文件被引入到每一个单页
    模板，与单文件名字对应的css、js文件将被引用到各自的单页中。 
### ajax请求代理及数据mock
    配置config中dev.proxy和dev.ismock两项；开发者可以将接口配置到dev.proxy中，如：
    dev.ismock = false
    dev.proxy = {'/test1','http://targetserver:8080/test1'，'/test2':'http://targetserver:8080/test2'}，
    这样的话在前端调用ajax时需要这么写：
    import Api from 'Api'
    Api({
        method : 'post',
        url : '/test1',
        data : {
            "transcode" : "selectmsg"
        }
    })
        .then(function(res){
          console.log(res.data)
        })
    以上请求将代理到http://targetserver:8080/test1服务接口上，
    如果dev.ismock配置项为true,那么请求将不被代理，并且会拦截该次请求到mockdata文件夹下对应的接口文件中并返回
    数据。
    建议步骤：
    1、在dev.ismock == true时，配置dev.proxy然后重启WDS（即$ npm start）,此时框架会读取此项配置并在mockdata文件夹下创建（如果未创建）
    以该项配置的[key].do.js为名的mock数据文件并写入基本方法，如果已创建则判断该项的值是否做了改动，如果改动了框架就会
    修改[key].do.js文件中的mock接口地址（也就是如果修改了dev.proxy中某一项的value，也需要重启服务），开发者可以根据
    接口文档填充此文件数据。
    2、通过修改dev.ismock的Boolean进行切换数据请求方式（是proxy还是mockdata），注意，切换后重启服务。
    3、前端调用如上，mock数据会全部加在到单页中(如果是在开发环境下)，避免在生产环境中将mock数据和mockjs模块打包到js当中。
### mock数据配置 in .do.js文件中
    let data = {} || []
    data变量名需与文件末尾_searchParam函数的第二个实参保持一致，在data中可以配置多种类型数据，
    1、eg : let data = {},这种情况下将直接把data作为response体返回。
    2、eg : let data = {_reqBody:{},_resBody:{}},直接将data._resBody作为response体返回。
    3、eg : let data = [{_reqBody:{},_resBody:{}}],在数组长度为1的情况下是不会匹配上送参数的,
    将data[0]._resBody直接作为response体返回。
    4、eg : let data = [{_reqBody:{param : 'p1'},_resBody:{}},{_reqBody:{param : 'p2'},_resBody:{}}],
    在数组长度大于1的情况下将根据上送参数匹配_reqBody,并将匹配到的_reqBody所在下标的_resBody作为respo体
    返回，如果匹配不到则返回data[0]._resBody,如果匹配到多个则返回最后一个匹配到的。
### Api in api.js
    框架提选用了axios作为ajax支持，一般情况下开发者可以不去关心这里除非想要替换ajax库，在api.js文件中主要做了以下几件事：
    1、针对mock和proxy两种情况，对请求参数的url进行了替换（mock时，请求地址为config.dev.proxy每一项的value,proxy时，
    请求地址为config.dev.proxy每一项的key）；
    2、对axios的request.body进行数据格式修改，利用qs模块对请求参数转换为querystring或者formdata（当上送参数是params则转换为querystring，
    当上送参数是data时则根据config.prod.requestType的值转换为相对应的格式）。
    3、@_searchParam是框架内部方法，提供了请求mock数据时返回对应请求参数的相应数据（不用关心）。
## 别名
    '@build' : utils.resolve(''),
    '@nm':utils.resolve('../node_modules'),
    '@component' : utils.resolve('../src/component'),
    '@mockdata' : utils.resolve('../src/mockdata'),
    '@module' : utils.resolve('../src/module'),
    '@static' : utils.resolve('../src/static'),
    '@utils' : utils.resolve('../src/utils'),
    'Api' : utils.resolve('../src/utils/api')
## CDN路径配置
    cdn路径配置项：config.prod.outputPublicPath
    ajax是否去掉协议头：config.prod.deleteRequestHeader (true：删除，false：保留)
## bug
    
## Tips
    1、在一个bundle中只能使用（css|less|sass）其中的一种，多种无法混合打包。（一个bundle指[name].css||common.css||vonder.css）
    2、css引用需要注意，src/static/css下的css文件会被打包到common.css中，一般在开发中规定这么引用css：
        (1) 如果是vue开发，每个单页需要的独有css则写在.vue组件当中（或根组件中，语言不限制），需要多个单页公用的css则可以写在src/static/css
        目录下（文件个数和语言不限），需要引用的npm插件的css则直接引用（将打包在vonder.css中）。
        (2) 如果是普通开发，每个单页需要的独有css则写在src/module/**下（文件个数和语言不限），需要多个单页公用的css则可以写在src/static/css
        目录下（文件个数和语言不限），需要引用的npm插件的css则直接引用（将打包在vonder.css中）。
    3、postcss的应用，vue中的style部分和外部引用style文件都实现了postcss编译，目前框架配置了两个postcss的插件：
        （1）自动补充前缀autoprefixer
        （2）px换算为rem，'postcss-px2rem'
        如果有需求则可以在build/utils.js文件中修改postcssConf字段
    4、一个文件代表对应着一个接口，mock数据可以按照mockjs规范书写
    5、**别名**可以方便开发过程中对文件夹的定位，不需要像'../../'这样的找相对路径.注意别名的应用只适合于模块引用
       的方法，如果想在src或css的url里用别名引用则需在别名前加'~'符号，表示按模块加载，另外还需注意如果想在js中引用静态
       资源（如：img、iconfont、svg等等）则需要用require、或import引用，如下：
```ecmascript 6
import img2 from '@static/img/img2.jpg'
let imgs = [require('@static/img/banner.png'),img2]
```