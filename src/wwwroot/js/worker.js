let id = undefined;

onmessage = (e) => {
    if(e.data && !id)
        id = e.data;
    delay();
}

function delay(){
    if(id){
        fetch("/delay?" + id,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                console.log(text);
                postMessage("tick");
            });
        });
    }
    setTimeout(delay,1000*60);
}
