export default class Response {

    static object(res) {
        res.redirect = this.redirect
        res.json = this.json
        return res
    }

    static redirect(path) {
        this.statusCode = 302
        this.setHeader('Location', path)
        this.end()
    }

    static json(obj) {
        this.setHeader('content-type', 'application/json')
        this.end(JSON.stringify(obj))
    }
}