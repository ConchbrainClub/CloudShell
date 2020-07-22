var baseUrl = "http://localhost";
var containerId = undefined;

function create(){
    if(!containerId){
        window.fetch(baseUrl + "/create",{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                containerId = text;
                var url = "http://localhost/" + containerId;

                setTimeout(()=>{
                    document.querySelector("iframe").src = url;
                },2000);
            });
        });
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