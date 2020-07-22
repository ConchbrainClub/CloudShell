var baseUrl = "http://localhost";
var containerId = undefined;

function create(){
    if(!containerId){
        window.fetch(baseUrl + "/create",{
            method:"GET"
        }).then((res)=>{
            if(res.status==200){
                res.text().then((text)=>{
                    containerId = text;
                    var url = "http://localhost/" + containerId;
                    tryConnect(url);
                });
            }
            else{
                alert("出错了");
            }
        });
    }
    else{
        alert("请刷新网页后重试");
    }
}

function tryConnect(url){
    var num = Math.round((Math.random()*100000)).toString();
    var str = prompt("请输入"+num);
    if(str == num){
        document.querySelector("iframe").src = url;
    }
    else{
        setTimeout(tryConnect,1000,url);
    }
}

function kill(){
    if(containerId){
        fetch(baseUrl + "/kill?" + containerId,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                console.warn(text)
            });
        });
    }
}

function delay(){
    if(containerId){
        fetch(baseUrl + "/delay?" + containerId,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                console.log(text)
            });
        });
    }

    setTimeout(delay,1000*60);
}

function init(){
    //创建容器
    create();
    //延迟容器生命周期
    delay();
    //离开网页关闭容器
    window.addEventListener('beforeunload',kill);
}