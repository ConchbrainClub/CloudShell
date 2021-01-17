var fs = require("fs");
var ttyd = require("./ttyd");
var forward = require("./forward");

module.exports = (req,res,path)=>{
    
    switch(path){

        case "/":
            fs.createReadStream(__dirname + "/wwwroot/index.html").pipe(res);
            break;

        case "/create":
            var image = new URL(req.url, "http://localhost").search.replace("?","");

            ttyd.create(image,(id)=>{
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
            var containerId = new URL(req.url, "http://localhost").search.replace("?","");
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
            var containerId = new URL(req.url, "http://localhost").searchParams.toString().replace("?","");

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

        case "/forward":
            let url = new URL(req.url, "http://localhost");
            let id = url.searchParams.get("id");
            let port = url.searchParams.get("port");

            if(!id || !port){
                res.statusCode = 500;
                res.end("incomplete parameters");
            }

            ttyd.containers.forEach((container) => {
                if(container.id == id){
                    forward.createForward(id,port);
                    res.end("createForward successful");
                }
                else{
                    res.statusCode = 500;
                    res.end("container is not exist");
                }
            });

            break;

        default:
            res.statusCode = 404;
            res.end();
    }
}