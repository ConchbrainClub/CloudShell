var containerId = undefined;

function create(system){
    if(!containerId){
        window.fetch("/create?" + system,{
            method:"GET"
        }).then((res)=>{
            if(res.status==200){
                res.text().then((text)=>{
                    containerId = text;
                    tryConnect();
                });
            }
            else{
                alert("出错了,5秒后将重试");
                setTimeout(create,5000);
            }
        });
    }
    else{
        alert("请刷新网页后重试");
    }
}

function tryConnect(){
    if(containerId){
        var num = Math.round((Math.random()*100000)).toString();
        var str = prompt("请输入"+num);
        if(!str || str==""){
            kill();
        }
        else if(str == num){
            var url = "/" + containerId;
            document.querySelector("iframe").src = url;
        }
        else{
            setTimeout(tryConnect,1000);
        }
    }
    else{
        alert("请先创建环境");
    }
}

function kill(){
    if(containerId){
        fetch("/kill?" + containerId,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                console.log(text)
            });
        });
    }
}

function delay(){
    if(containerId){
        fetch("/delay?" + containerId,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                console.log(text)
            });
        });

        setTimeout(delay,1000*60);
    }
}

function createContainer(system){
    //创建容器
    create(system);
    //延迟容器生命周期
    delay();
    //离开网页关闭容器
    window.addEventListener('beforeunload',kill);
}