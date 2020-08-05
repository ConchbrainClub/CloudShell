var http = require("http");
var url = require("url");
var fs = require("fs");
var rotate = require("./rotate");

http.createServer((req,res)=>{

    var path = url.parse(req.url).pathname;

    var staticFile = __dirname + "/wwwroot" + path;

    if(fs.existsSync(staticFile)){
        if(fs.lstatSync(staticFile).isFile()){
            fs.createReadStream(staticFile).pipe(res);
        }
        else{
            rotate(req,res,path);
        }
    }
    else{
        rotate(req,res,path);
    }

}).listen(8080,()=>{
    console.log("server run at http://localhost");
});