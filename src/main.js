var http = require("http");
var url = require("url");
var fs = require("fs");
var ttyd = require("./ttyd");

http.createServer((req,res)=>{

    var path = url.parse(req.url).pathname;

    switch(path){

        case "/":
            fs.createReadStream("./test/index.html").pipe(res);
            break;

        case "/web-terminal.js":
            fs.createReadStream("./scripts/web-terminal.js").pipe(res);
            break;

        case "/create":
            ttyd.run((id)=>{
                if(id){
                    res.end(id);
                }
                else{
                    res.statusCode = 500;
                    res.end("error");
                }
            });

            break;

        case "/kill":
            var containerId = url.parse(req.url).query;
            ttyd.kill(containerId,(flag)=>{
                if(flag){
                    res.end("kill container "+containerId);
                }
                else{
                    res.statusCode = 500;
                    res.end("kill container defeat");
                }
            })

            break;

        case "/delay":
            var containerId = url.parse(req.url).query;

            ttyd.delayedLife(containerId,(flag)=>{
                if(flag){
                    res.end("delay successful");
                }
                else{
                    res.statusCode = 500;
                    res.end("dealy defeat");
                }
            });

            break;

        default:
            res.statusCode = 404;
            res.end();
    }

}).listen(8080,()=>{
    console.log("server run at http://localhost:8080");
});