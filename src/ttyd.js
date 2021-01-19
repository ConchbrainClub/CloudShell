var child_process = require("child_process");
var fs = require("fs");
nginx = require("./nginx");
var common = require("./common");

var nginx,config,containers,forwardList,usefulPorts;

function container (id,containerId,port,endTime){
    this.id = id;
    this.containerId = containerId;
    this.port = port;
    this.endTime = endTime;
    this.forward = [];
}

function forward(id, port) {
    this.id = id;
    this.port = port;
}

function create(image,callback){

    var port = usefulPorts.shift();

    var id = common.guid();

    if(common.inDocker()){
        //docker
        var cmd = "docker run --rm -d --name " + id + " --net cloudshell_default lixinyang/cloudshell:" + image;
    }
    else{
        //native
        var cmd = "docker run --rm -d -p " + port + ":7681/tcp --name " + id + " lixinyang/cloudshell:" + image;
    }

    child_process.exec(cmd,(error,stdout,stderr)=>{
        if(!error && !stderr){

            //存储容器
            stdout = stdout.replace("\n","");
            containers.push(new container(id,stdout,port,new Date().getTime() + 1000 * 60 * config.delayedTime));
            //配置反向代理
            nginx.apply(nginx.generator(containers,forwardList),(flag)=>{
                if(flag){
                    callback(id);
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

function kill(id,callback){

    containers.forEach(container => {
        if(container.id == id){

            var cmd = "docker rm -f " + container.containerId;

            child_process.exec(cmd,(error,stdout,stderr)=>{
                if(!error && !stderr){
                    //容器列表中移除
                    containers.splice(containers.indexOf(container),1);
                    //回收端口
                    usefulPorts.push(container.port);
                    //删除转发端口
                    deleteForward(id);
                    //配置反向代理
                    nginx.apply(nginx.generator(containers,forwardList),(flag)=>{
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
function delayedLife(id,callback){
    containers.forEach(container => {
        if(container.id == id){
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


function createForward(containerId, port) {
    forwardList.push(new forward(containerId, port));
    //配置反向代理
    nginx.apply(nginx.generator(containers,forwardList),(flag)=>{
        if(flag){
            console.log("创建转发成功");
        }
    });
}

function deleteForward(containerId) {
    let list = new Array();

    for (let i = 0; i < forwardList.length; i++) {
        if(forwardList[i].id != containerId)
            list.push(forwardList[i]);
    }

    forwardList = list;
}


function init(){

    config = JSON.parse(fs.readFileSync("./assets/config.json"));

    usefulPorts = new Array();
    containers = new Array();
    forwardList = new Array();

    //初始化20个可用端口
    for(var i=7681;i<=7700;i++){
        usefulPorts.push(i);
    }
    
    //按容器列表初始化nginx
    nginx.apply(nginx.generator(containers,forwardList),(flag)=>{
        if(flag){
            console.log("nginx init successful");
        }
        else{
            console.log("nginx init defeat")
        }
    });

    autoRecycling();

    module.exports = {
        create,kill,delayedLife,createForward,containers
    }
}

init();