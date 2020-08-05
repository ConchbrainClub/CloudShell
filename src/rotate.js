var url = require("url");
var fs = require("fs");
var ttyd = require("./ttyd");

module.exports = (req,res,path)=>{
    
    switch(path){

        case "/":
            fs.createReadStream(__dirname + "/wwwroot/index.html").pipe(res);
            break;

        case "/create":
            var image = url.parse(req.url).query;

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
}