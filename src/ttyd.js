var child_process = require("child_process");
var fs = require("fs");
var nginx = require("./nginx");

var config,containers,usefulPorts;

function container (id,port,endTime){
    this.id = id;
    this.port = port;
    this.endTime = endTime;
}

function showStatus(){
    console.log("Containers " + containers.length);
    console.log("UsefulPorts " + usefulPorts.length);
}

function create(callback){

    var port = usefulPorts.shift();

    var cmd = "docker run --rm -d -p " + port + ":7681/tcp tsl0922/ttyd:latest";
    child_process.exec(cmd,(error,stdout,stderr)=>{
        if(!error && !stderr){
            //存储容器id
            stdout = stdout.replace("\n","");
            containers.push(new container(stdout,port,new Date().getTime() + 1000 * 60 * config.delayedTime));
            //配置反向代理
            nginx.apply(nginx.generator(containers),(flag)=>{
                if(flag){
                    callback(stdout);
                }
                else{
                    callback(undefined);
                }
            });

        }
        else{
            callback(undefined);
        }
    });
}

function kill(containerId,callback){

    var cmd = "docker rm -f " + containerId;
    
    containers.forEach(container => {
        if(container.id == containerId){
            child_process.exec(cmd,(error,stdout,stderr)=>{
                if(!error && !stderr){
                    //容器列表中移除
                    containers.splice(containers.indexOf(container),1);
                    //回收端口
                    usefulPorts.push(container.cport);
                    //配置反向代理
                    nginx.apply(nginx.generator(containers),(flag)=>{
                        if(flag){
                            callback(stdout);
                        }
                        else{
                            callback(undefined);
                        }
                    });

                    callback(stdout);
                }
                else{
                    callback(undefined);
                }
            });
        }
        else{
            callback(undefined);
        }
    });
}

//延长容器声明周期
function delayedLife(containerId,callback){
    containers.forEach(container => {
        if(container.id == containerId){
            container.endTime = new Date().getTime() + 1000 * 60 * config.delayedTime;
            callback(true);
        }
    });
    callback(false);
}

//自动回收过期容器
function autoRecycling(){
    containers.forEach(container => {
        if(new Date().getTime() > container.endTime){
            kill(container.id,(flag)=>{
                if(flag){
                    console.log("recycling container " + container.id);
                }
            });
        }
    });

    setTimeout(autoRecycling, 1000 * 60 * config.recyclingTime);
}

function init(){

    config = JSON.parse(fs.readFileSync("./assets/config.json"));

    usefulPorts = new Array();
    containers = new Array();

    //初始化nginx
    nginx.apply(nginx.generator(containers),(flag)=>{
        if(flag){
            console.log("nginx init successful");
        }
    });

    //初始化20个可用端口
    for(var i=7681;i<=7700;i++){
        usefulPorts.push(i);
    }

    autoRecycling();

    module.exports = {
        create,kill,delayedLife,showStatus
    }
}

init();
