var http = require("http"),Url = require('url')
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'})
    var data = {}
    switch (Url.parse(req.url).path){
        case '/citylist':
            data = {
                status: 0,
                msg: 'ok',
                data: {
                    citylist: [{
                        "cityId": 1,
                        "cityName": "北京",
                        "listName": "lsj"
                    }, {
                        "cityId": 2,
                        "cityName": "上海",
                        "listName": "cx"
                    }, {
                        "cityId": 6738,
                        "cityName": "象山",
                        "listName": "xs"
                    }]
                }
            }
            break;
    }
    res.write(JSON.stringify(data));
    res.end();

}).listen(3008);
console.log('test server running at localhost:3008')