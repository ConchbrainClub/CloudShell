import path from 'path'
import ejs from './ejs/ejs.js'

var views = ejs();

export default class Response {

    static object(res) {
        res.setCookie = this.setCookie
        res.redirect = this.redirect
        res.json = this.json
        res.render = this.render
        res.bad = this.bad
        res.forbidden = this.forbidden
        res.notfound = this.notfound
        res.error = this.error
        return res
    }

    static setCookie(key, value, time = undefined, path = '/', ) {
        let expires = () => {
            let date = new Date()
            date.setTime(date.getTime() + (time * 1000))
            return time ? `expires=${date.toGMTString()};` : ''
        }

        this.setHeader('Set-Cookie', `${key}=${value}; ${expires()} path=${path};`)
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

    static render(fileName, data = {}) {
        fileName = path.join(process.cwd(), 'src/views', fileName)

        views.render(fileName, Object.assign(this, data), (err, html) => {
            if (err) throw err
            this.setHeader('content-type', 'text/html')
            this.end(html)
        })
    }

    static bad(text = 'bad request') {
        this.statusCode = 400
        this.end(text)
    }

    static forbidden(text = 'forbidden') {
        this.statusCode = 403
        this.end(text)
    }

    static notfound(text = 'not found') {
        this.statusCode = 404
        this.end(text)
    }
    
    static error(text = 'error') {
        this.statusCode = 500
        this.end(text)
    }
}