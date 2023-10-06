import http from 'http'
import { Middleware } from './middleware.js'
import Response from './response.js'
import Request from './request.js'

export class App {
    constructor() {
        this.pipeline = undefined
        this.middlewares = []
        this.actions = []

        this.server = http.createServer((req, res) => {
            console.log(`\n${req.method} ${req.url}`)

            this.pipeline.invoke(
                Request.object(req, this.host),
                Response.object(res),
                this.pipeline
            )
        })
    }

    #endpoint(req, res) {
        let action = this.actions.find(i => new RegExp(`^${i.path}$`).test(req.pathname))

        if (!action) {
            res.statusCode = 404
            res.end('Not found')
            return
        }

        try {
            action.invoke(req, res)
        }
        catch (err) {
            console.error(err)
            res.statusCode = 500
            res.end('Server Error')
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

    map(path, callback) {
        this.actions.push({
            path: path,
            invoke: callback
        })
        return this
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
