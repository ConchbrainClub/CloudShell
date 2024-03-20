export class Middleware {
    constructor(callback) {
        this.handler = callback
        this.next = undefined
    }

    async invoke(req, res, middleware) {
        await middleware.handler(req, res, async (req, res) =>
            await this.invoke(req, res, middleware.next)
        )
    }
}