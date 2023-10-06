import { App } from './core/app.js'
import { StaticFile } from './middlewares/staticfile.js'
import { Cors } from './middlewares/cors.js'
import { config } from 'dotenv'
import ttyd from './ttyd.js'

config()
const app = new App()

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
    var image = new URL(req.url, "http://localhost").search.replace("?","")

    ttyd.create(image, (id)=>{
        if(id){
            res.end(id)
        }
        else{
            res.statusCode = 500
            res.end("error")
        }
    })
})

app.build().start(process.env.PORT)
