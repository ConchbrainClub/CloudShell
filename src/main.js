var http = require("http");
var url = require("url");
var ttyd = require("./ttyd");

http.createServer((req,res)=>{

    var path = url.parse(req.url).pathname;

    switch(path){
        case "/":
            ttyd.run((id)=>{
                if(id){
                    res.end(id);
                }
                else{
                    res.end("error");
                }

                ttyd.showStatus();
            });

            break;

        case "/kill":
            var containerId = url.parse(req.url).query;
            ttyd.kill(containerId,(flag)=>{
                if(flag){
                    res.end("kill container "+containerId);
                }
                else{
                    res.end("kill container defeat");
                }

                ttyd.showStatus();
            })

            break;

        case "/delay":
            var containerId = url.parse(req.url).query;

            ttyd.delayedLife(containerId,(flag)=>{
                if(flag){
                    res.end("delay successful");
                }
                else{
                    res.end("dealy defeat");
                }
            });

            ttyd.showStatus();
            break;

        default:
            res.statusCode = 404;
            res.end();
    }

    
}).listen(8080,()=>{
    console.log("server run at http://localhost:8080");
});