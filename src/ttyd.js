const child_process = require("child_process");

var containers,usefulPorts;

function run(callback){

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

function checkPortUseful(port,callback){
    var cmd = "lsof -i:" + port;
    child_process.exec(cmd,(error,stdout,stderr)=>{
        if(!stdout){
            callback(true);
        }
        else{
            callback(false);
        }
    });
}

function init(){

    usefulPorts = new Array();
    containers = new Array();

    //初始化20个可用端口
    for(var i=7681;i<=7700;i++){
        checkPortUseful(i,(flag)=>{
            console.log(flag);
            if(flag){
                usefulPorts.push(i);
            }
        });
    }

    module.exports = {
        run
    }
}

init();
