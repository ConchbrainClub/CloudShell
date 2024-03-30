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

    mapGroup(basePath, callback) {
        if (!basePath.startsWith('/')) basePath = '/' + basePath
        let group = new Group(basePath)

        callback(group)
        group.routes.forEach(i => this.map(i.path, i.callback))
    }
}
