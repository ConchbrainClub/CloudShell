export default class Request {

    static object(req, host = 'http://localhost') {
        req.pathname = new URL(req.url, host).pathname
        req.cookie = this.parseCookie(req)
        req.query = this.parseQuery(req, host)
        req.body = this.parseBody
        return req
    }

    static parseCookie(req) {
        let cookie = {}
        if (!req.headers.cookie) return cookie

        req.headers.cookie
            .split(';')
            .forEach(i => {
                let dict = i.trim().split('=')
                cookie[[dict.at(0)]] = dict.at(1)
            })

        return cookie
    }

    static parseQuery(req, host) {
        let query = {}
        let search = new URL(req.url, host).search

        if (!search) return query

        search.slice(1)
            .split('&')
            .forEach(i => {
                let dict = i.split('=')
                if (dict.length == 1) {
                    query['id'] = decodeURI(dict.at(0))
                }
                else {
                    query[[dict.at(0)]] = decodeURI(dict.at(1))
                }
            })

        return query
    }

    static parseBody() {
        return new Promise((resolve, reject) => {
            let data = ''
            this.on('data', chunk => { data += chunk })

            this.on('end', () => {
                let contentType = this.headers['content-type']

                switch (true) {
                    case contentType.includes('application/json'):
                        resolve(JSON.parse(data))
                        break

                    case contentType.includes('application/x-www-form-urlencoded'):
                        let form = {}
                        data.split('&').forEach(i => {
                            let dict = i.split('=')
                            form[[dict.at(0)]] = decodeURI(dict.at(1))
                        })
                        resolve(form)
                        break;

                    default:
                        resolve(data)
                        break;
                }
            })
            
            this.on('error', err => { reject(err) })
        })
    }
    
}