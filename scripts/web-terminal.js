var baseUrl = "http://localhost";
var containerId = undefined;

function create(){
    if(!containerId){
        fetch({
            url: baseUrl + "/create"
        }).then((res)=>{
            containerId = res.text();
            alert(containerId)
        });
    }
}

function kill(){
    if(containerId){
        fetch({
            url: baseUrl + "/kill?" + containerId
        }).then((res)=>{
            alert(res.text());
        });
    }
}

function delay(){
    if(containerId){
        fetch({
            url: baseUrl + "/delay?" + containerId
        }).then((res)=>{
            alert(res.text());
        });
    }

    setTimeout(delay,1000*60);
}

function init(){
    //创建容器
    create();
    //延迟容器生命周期
    delay();
}

init();