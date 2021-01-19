let forwardList = new Array();

function forward(id, port) {
    this.id = id;
    this.port = port;
}

function createForward(containerId, port) {
    forwardList.push(new forward(containerId, port));
     //配置反向代理
    nginx.apply(nginx.generator(),(flag)=>{
        if(flag){
            console.log("创建转发成功");
        }
    });
}

function deleteForward(containerId) {
    forwardList.forEach((forward) => {
        if(forward.id == containerId){
            forwardList.splice(forwardList.indexOf(forward),1);
        }
    });
     //配置反向代理
     nginx.apply(nginx.generator(),(flag)=>{
        if(flag){
            console.log("删除转发成功");
        }
    });
}

module.exports = {
    createForward,deleteForward,forwardList
}

var nginx = require("./nginx");