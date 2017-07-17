/*
* 此插件是为了解决extract-text-webpack-plugin插件无法替换html中publicPath的问题
* */
var options = {};
function CssPbulicPathReset (opts){
    options = opts
};
CssPbulicPathReset.prototype.apply = function(compiler) {
    // 设置回调来访问编译对象：
    compiler.plugin("emit", function(compilation,callback) {
        var files = [],htmls = []
        for (var filename in compilation.assets) {
            if(/.html$/.test(filename)){
                files.push(filename)
                htmls.push(compilation.assets[filename].source().replace(/(http)*s*\/\/.*?(?=(css\/\S{1,}\.css))/g,options.publicPath))
            }
        }
        //此处将文件项push到新的数组是为了解决重写文件对conmpilation.assets的影响，从而导致页面写入错误
        files.forEach(function (item, index) {
            compilation.assets[item] = {
                source: function() {
                    return htmls[index];
                },
                size: function() {
                    return htmls[index].length;
                }
            }
        })
        callback()
    })
}

module.exports = CssPbulicPathReset