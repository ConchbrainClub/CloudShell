export class Middleware {
    constructor(callback) {
        this.handler = callback
        this.next = undefined
    }

    invoke(req, res, middleware) {
        middleware.handler(req, res, (req, res) =>
            this.invoke(req, res, middleware.next)
        )
    }
}