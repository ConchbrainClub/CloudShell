export default class Request {

    static object(req, host = 'http://localhost') {
        req.pathname = new URL(req.url, host).pathname
        req.query = this.parseQuery(req, host)
        return req
    }

    static parseQuery(req, host) {
        let query = {}
        let search = new URL(req.url, host).search

        if (!search) return query

        search.slice(1)
            .split('&')
            .forEach(i => {
                let dict = i.split('=')
                if (dict.length = 1) {
                    query['id'] = decodeURI(dict.at(0))
                }
                else {
                    query[[dict.at(0)]] = decodeURI(dict.at(1))
                }
            })

        return query
    }
}
