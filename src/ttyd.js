const child_process = require("child_process");

var containers = new Array();

function run(port,callback){
    var cmd = "docker run --rm -d -p " + port + ":7681/tcp tsl0922/ttyd:latest";
    child_process.exec(cmd,(error,stdout,stderr)=>{
        if(!error||!stderr){
            //存储容器id
            containers.push(stdout);

            callback(stdout);
        }
        else{
            callback(undefined);
        }
    });
}

module.exports = {
    run
}