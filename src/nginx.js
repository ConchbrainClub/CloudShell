var fs = require("fs");
var child_process = require("child_process");

var config,location;

function generator(containers){

    var configStr = undefined;

    if(containers.length==0){
        configStr = config.replace("@location","");
    }
    else{
        var proxyStr = "";
        containers.forEach(container => {
            proxyStr += location.replace("@path", container.id).replace("@port", container.port);
        });
        configStr = config.replace("@location",proxyStr);
    }

    return configStr;
}

function apply(newConfig,callback){

    var config = fs.readFileSync("/etc/nginx/sites-enabled/default").toString();

    //保存配置文件
    fs.writeFileSync("/etc/nginx/sites-enabled/default",newConfig);

    //重启nginx
    child_process.exec("nginx -s reload",(error,stdout,stderr)=>{
        if(error || stderr){
            //重启nginx失败，还原配置文件
            fs.writeFileSync("/etc/nginx/sites-enabled/default",config);
            callback(false);
        }
        else{
            callback(true);
        }
    });
}

function init(){

    config = fs.readFileSync("./assets/default.conf").toString();
    location = fs.readFileSync("./assets/location.conf").toString();

    module.exports = {
        generator,apply
    }
}

init();