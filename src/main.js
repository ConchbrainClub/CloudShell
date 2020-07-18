var http = require("http");
var ttyd = require("./ttyd");

http.createServer((req,res)=>{
    ttyd.run(7681,(id)=>{
        if(id){
            res.end(id);
        }
        res.end("error");
    });
}).listen(8080,()=>{
    console.log("server run at http://localhost:8080");
});