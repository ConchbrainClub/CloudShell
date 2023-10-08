import { App } from './core/app.js'
import { StaticFile } from './middlewares/staticfile.js'
import { Cors } from './middlewares/cors.js'
import { config } from 'dotenv'
import { TTYD } from './services/ttyd.js'

config()
const app = new App()
const ttyd = new TTYD()

// Compute the api response time

app.use((req, res, next) => {
    console.time()
    next(req, res)
    console.timeEnd()
})

// Map Static file
app.use(new StaticFile('/wwwroot'))
app.use(new Cors())

// Redirect to index.html

app.map('/', (req, res) => {
    res.redirect('/index.html')
})

// Create a docker container
// -----------------------------------
// query
//    - image      image name

app.map('/create', async (req, res) => {
    var image = req.query.id

    ttyd.create(image, id => {
        if(id){
            res.end(id)
        }
        else{
            res.statusCode = 500
            res.end("error")
        }
    })
})

app.map('/kill', async (req, res) => {
    var containerId = req.query.id
    
    ttyd.kill(containerId,(flag)=>{
        if(flag){
            res.end("kill container "+containerId);
        }
        else{
            res.statusCode = 500;
            res.end("kill container defeat");
        }
    })
})

app.map('/delay', async (req, res) => {
    var containerId = req.query.id

    ttyd.delayedLife(containerId, flag => {
        if(flag){
            res.end("delay successful");
        }
        else{
            res.statusCode = 500;
            res.end("dealy defeat");
        }
    });
})

app.map('/forward', async (req, res) => {
    let id = req.query.id
    let port = req.query.port

    if(!id || !port){
        res.statusCode = 500;
        res.end("incomplete parameters");
    }

    ttyd.containers.forEach((container) => {
        if(container.id == id){
            ttyd.createForward(id,port);
            res.end("createForward successful");
        }
        else{
            res.statusCode = 500;
            res.end("container is not exist");
        }
    });
})

app.build().start(process.env.PORT)
