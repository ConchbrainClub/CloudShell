var child_process = require("child_process");

var containers,usefulPorts;

function container (id,port,endTime){
    this.id = id;
    this.port = port;
    this.endTime = endTime;
}

function run(callback){

    var port = usefulPorts.shift();

    var cmd = "docker run --rm -d -p " + port + ":7681/tcp tsl0922/ttyd:latest";
    child_process.exec(cmd,(error,stdout,stderr)=>{
        if(!error || !stderr){
            //存储容器id
            containers.push(new container(stdout,port,new Date().getTime() + 1000 * 60));

            callback(stdout);
        }
        else{
            callback(undefined);
        }
    });
}

function kill(containerId,callback){

    var cmd = "docker rm -f " + containerId;
    
    containers.forEach(container => {
        if(container.id.includes(containerId)){
            child_process.exec(cmd,(error,stdout,stderr)=>{
                if(!error || !stderr){
                    //容器列表中移除
                    containers.splice(containers.indexOf(container),1);
                    //回收端口
                    usefulPorts.push(container.cport);

                    callback(stdout);
                }
                else{
                    callback(undefined);
                }
            });
        }
    });
}

function showStatus(){
    console.log("Containers " + containers.length);
    console.log("UsefulPorts " + usefulPorts.length);
}

//延长容器声明周期
function delayedLife(containerId,callback){
    containers.forEach(container => {
        if(container.id.includes(containerId)){
            container.endTime = new Date().getTime() + 1000 * 60;
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
                else{
                    console.log("recycling container defeat");
                }
                showStatus();
            });
        }
        else{
            console.log("have no container need recycling");
        }
    });

    setTimeout(autoRecycling,1000*10);
}

function init(){

    usefulPorts = new Array();
    containers = new Array();

    //初始化20个可用端口
    for(var i=7681;i<=7700;i++){
        usefulPorts.push(i);
    }

    autoRecycling();

    module.exports = {
        run,kill,showStatus,delayedLife
    }
}

init();
