import fs from 'fs'
import http from 'http'
import path from 'path'
import { pathToFileURL } from 'url'
import { Group } from './group.js'
import { Middleware } from './middleware.js'
import Response from './response.js'
import Request from './request.js'

export class App {
    constructor() {
        this.pipeline = undefined
        this.middlewares = []
        this.actions = []

        this.server = http.createServer((req, res) => {
            console.log(`\n${new Date()}\n${req.method} ${req.url}`)

            this.pipeline.invoke(
                Request.object(req, this.host),
                Response.object(res),
                this.pipeline
            )
        })
    }

    #endpoint(req, res) {
        let action = this.actions
            .filter(i => new RegExp(`^${i.path}$`).test(req.pathname))
            .sort((a, b) => b.path.length - a.path.length)
            .at(0)

        if (!action) {
            res.notfound()
            return
        }

        try {
            action.invoke(req, res)
        }
        catch (err) {
            console.error(err)
            res.error('Server Error')
        }
    }

    use(callback) {
        if (callback instanceof Middleware) {
            this.middlewares.push(callback)
        }
        else {
            this.middlewares.push(new Middleware(callback))
        }
        return this
    }

    map(routePath, callback) {
        routePath = routePath.replaceAll('\\', '/')

        this.actions.push({
            path: routePath,
            invoke: callback
        })
        return this
    }

    mapGroup(basePath, callback) {
        if (!basePath.startsWith('/')) basePath = '/' + basePath
        let group = new Group(basePath)
        
        callback(group)
        group.routes.forEach(i => this.map(i.path, i.callback))
    }

    mapController(dir = 'controllers', basePath = '/') {

        if (!basePath.startsWith('/')) basePath = '/' + basePath
        let controllerDir = path.join(process.cwd(), 'src', dir)

        fs.readdirSync(controllerDir).forEach(async controllerName => {
            let controllerPath = path.join(controllerDir, controllerName)
            if (fs.lstatSync(controllerPath).isDirectory()) return

            let module = (await import(pathToFileURL(controllerPath).href)).default

            Object.keys(module).forEach(actionName => {
                let routePath = path.join(basePath, controllerName.replace('.js', ''), actionName, '/?')
                this.map(routePath, module[actionName])
            })

            if (module['index']) {
                this.map(path.join(basePath, controllerName.replace('.js', ''), '/?'), module['index'])
            }

            if (controllerName.replace('.js', '') == 'home' && module['index']) {
                this.map(path.join(basePath, '/?'), module['index'])
            }
        })
    }

    build() {

        this.middlewares.forEach((middleware, index) => {
            if (index >= this.middlewares.length - 1) return
            middleware.next = this.middlewares[index + 1]
        })

        this.middlewares[this.middlewares.length - 1].next = {
            handler: (req, res, _) => {
                this.#endpoint(req, res)
            }
        }

        this.pipeline = this.middlewares[0]
        return this
    }

    start(port = 8080) {
        if (!this.pipeline) throw 'need build pipeline'
        this.host = `http://localhost:${port}`

        this.server.listen(port, () => {
            console.log(`server run at ${this.host}`)
        })
    }
}
