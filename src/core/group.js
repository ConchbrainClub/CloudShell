import path from 'path'

export class Group {
    constructor(basePath) {
        this.basePath = basePath
        this.routes = []
    }

    map(routePath, callback) {
        this.routes.push({
            path: path.join(this.basePath, routePath),
            callback: callback
        })
    }
}