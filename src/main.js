var http = require("http");
var url = require("url");
var fs = require("fs");
var router = require("./router");

http.createServer((req,res)=>{

    var path = url.parse(req.url).pathname;

    var staticFile = __dirname + "/wwwroot" + path;

    if(fs.existsSync(staticFile)){
        if(fs.lstatSync(staticFile).isFile()){
            fs.createReadStream(staticFile).pipe(res);
        }
        else{
            router(req,res,path);
        }
    }
    else{
        router(req,res,path);
    }

}).listen(8080,()=>{
    console.log("server run at http://localhost");
});