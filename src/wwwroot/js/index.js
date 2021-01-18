var container = {
    id: undefined,
    system: undefined,
    time: undefined
}
var forward = [];

function create(system){
    if(!container.id){
        window.fetch("/create?" + system,{
            method:"GET"
        }).then((res)=>{
            if(res.status==200){
                res.text().then((text)=>{
                    container.id = text;
                    container.system = system;
                    container.time = -1;

                    //延迟容器生命周期
                    delay();
                    document.querySelector("#loadingStatus").setAttribute("hidden","hidden");
                    setTimeout(tryConnect,500);
                });
            }
            else{
                alert("出错了,请刷新后重试");
            }
        });
    }
    else{
        alert("请先关闭当前运行中的环境");
    }
}

function tryConnect(){
    if(container.id){
        let num = Math.round((Math.random()*100000)).toString();
        let str = prompt("请输入"+num);
        if(!str || str==""){
            kill();
        }
        else if(str == num){
            let url = "/" + container.id;
            document.querySelector("#shell").querySelector("iframe").src = url;
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
    if(container.id){
        fetch("/kill?" + container.id,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                if(text.includes(container.id)){
                    document.querySelector("#shell").querySelector("iframe").src = "";
                    container.id = undefined;
                    forward = [];
                    document.querySelector("#loadingStatus").removeAttribute("hidden");
                }
                else{
                    console.log("kill container defeat");
                }
            });
        });
    }
}

function delay(){
    if(container.id){
        fetch("/delay?" + container.id,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                console.log(text);
                container.time++;
            });
        });
        setTimeout(delay,1000*60);
    }
}

function createContainer(system){
    //创建容器
    create(system);
    //离开网页关闭容器
    window.addEventListener('beforeunload',kill);
}

function fullScreen(){
    document.querySelector("#btn_mini").click();
    setTimeout(()=>{
        let iframe = document.querySelector("#shell").querySelector("iframe");
        let fullScreenFrame = document.querySelector("#fullScreenFrame");
        fullScreenFrame.src = iframe.src;
        iframe.src = "";
        fullScreenFrame.removeAttribute("hidden");
    },500);
    document.querySelector(".exitFullScreen").removeAttribute("hidden");
}

function exitFullScreen(){
    let iframe = document.querySelector("#shell").querySelector("iframe");
    let fullScreenFrame = document.querySelector("#fullScreenFrame");
    iframe.src = fullScreenFrame.src;
    fullScreenFrame.src = "";
    fullScreenFrame.setAttribute("hidden","hidden");
    document.querySelector("#showModal").click();
    document.querySelector(".exitFullScreen").setAttribute("hidden","hidden");
}

function reconnect(){
    let url = "/" + container.id;
    document.querySelector("#shell").querySelector("iframe").src = url;
}

function forwardPort(){
    let port = document.querySelector("#port").value;
    if(!isNaN(port)){
        fetch(`/forward?id=${container.id}&port=${port}`).then((res) => {
            if(res.status == 200){
                alert("转发端口成功");
                forward.push(port);
            }
            else{
                alert("转发端口失败");
            }
        });
    }
    document.querySelector("#port").value = undefined;
}

function showRunning(){
    if(container.id){
        //显示当前运行状态
        document.querySelector("#running").removeAttribute("hidden");
        document.querySelector("#containerSystem").innerText = container.system;
        document.querySelector("#containerId").innerText = container.id;
        document.querySelector("#containerTime").innerText = container.time + " min ago";

        //显示端口转发状态
        let forwardHtml = "";
        forward.forEach((port) => {
            let url = `https://cloudshell.conchbrain.club/forward/${container.id}/${port}`;
            forwardHtml += `
                <p class="card-text">
                    ${port} -> <a href="${url}">${url}</a>
                </p>
            `;
        });
        document.querySelector("#forward").innerHTML = forwardHtml;
    }
    else{
        document.querySelector("#running").setAttribute("hidden","hidden");
    }
    setTimeout(showRunning,2000);
}