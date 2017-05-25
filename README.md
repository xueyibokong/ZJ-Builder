#webpack配置
##注意：
    启动WDS(webpack-dev-server)后可以通过服务器访问未bundle的.html(对应着src下的 
    '模板.html')，'查看1'；
    在这个脚手架中我应用html-webpack-plugin,此插件是对bundle后的资源进行包装并放在
    内存中，可以通过访问failname在DWS的url来查看dev效果，效果与'查看1'中引入入口js是
    一样的。
##关于build文件夹
    1、所有文件都是服务于脚手架构建，与开发代码无关。
    2、构建代码为ES5+node规范编写
    
##Tip
    1、在一个bundle中只能使用（css|less|sass|postcss）其中的一种，多种无法混合打包。
    2、通过axios配合WDS的proxy完成ajax请求代理
       mounted : () => {
          var _self = this
          axios({
              method : 'post',
              url : '/request_api',
              data : {
                  "transcode" : "selectmsg"
              }
          })
              .then(function(res){
                  console.log(res.data)
              })
       }
    
#数据mock 和 proxy
####mock 和 proxy接口设计规范
    1、一个文件代表对应着一个RD的controller即一个接口
        --注意：文件内不允许出现host:8888/a 和 host:8888/b同时存在的情况
    2、通过设置config.dev.mockdata来控制请求是走代理还是走mock数据【true:mack,false:proxy】
        --注意: 修改 config.dev.mockdata字段后须重启服务
    3、其他请求路径可以通过配置config.js中proxy做代理映射
    4、根据config.dev.proxy字段动态创建mockdata/[name].do.js并且写入基本数据
        --注意: 修改config.dev.proxy字段后须重启服务后刷新mockdata文件夹
              
    
#别名
    '@build' : utils.resolve(''),
    '@component' : utils.resolve('../src/component'),
    '@mockdata' : utils.resolve('../src/mockdata'),
    '@module' : utils.resolve('../src/module'),
    '@static' : utils.resolve('../src/static'),
    '@utils' : utils.resolve('../src/utils')
    