var http = require("http")
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'})
    var data = {
        status : '0',
        msg : 'ok',
        data : {
            name :'zhangjun',
            age : '24'
        }
    }
    res.write(JSON.stringify(data));

    res.end();

}).listen(3008);
console.log('test server running at localhost:3008')