import plankton from './Plankton/index.js'
import { config } from 'dotenv'
import { TTYD } from './services/ttyd.js'

config()
const app = plankton()
const ttyd = new TTYD()

// Map Static file
app.useStaticFile()
app.useCors()

// Redirect to index.html

app.map('/', (req, res) => {
    res.redirect('/index.html')
})

// Create a docker container
// -----------------------------------
// query
//    - image      image name

app.map('/create', async (req, res) => {
    await new Promise((resolve, reject) => {
        let image = req.query.id

        ttyd.create(image, id => {
            if (id) {
                res.end(id)
                resolve()
            }
            else {
                res.error()
                reject()
            }
        })
    })
})

app.map('/kill', async (req, res) => {
    await new Promise((resolve, reject) => {
        let containerId = req.query.id

        ttyd.kill(containerId, (flag) => {
            if (flag) {
                res.end('kill container ' + containerId)
                resolve()
            }
            else {
                res.error('kill container defeat')
                reject()
            }
        })
    })
})

app.map('/delay', async (req, res) => {
    await new Promise((resolve, reject) => {
        let containerId = req.query.id

        ttyd.delayedLife(containerId, flag => {
            if (flag) {
                res.end('delay successful')
                resolve()
            }
            else {
                res.error('dealy defeat')
                reject()
            }
        })
    })
})

app.map('/forward', async (req, res) => {
    await new Promise(async (resolve, reject) => {
        let id = req.query.id
        let port = req.query.port

        if (!id || !port) {
            res.statusCode = 500
            res.end('incomplete parameters')
        }

        ttyd.containers.forEach((container) => {
            if (container.id == id) {
                ttyd.createForward(id, port)
                res.end('createForward successful')
                resolve()
            }
            else {
                res.error('container is not exist')
                reject()
            }
        })
    })
})

app.build().start(process.env.PORT)
