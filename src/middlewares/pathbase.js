import { Middleware } from "../core/middleware.js";

export class PathBase extends Middleware {

    constructor(basePath) {
        let func = (req, res, next) => {
            if (req.url.startsWith(basePath)) {
                req.url = req.url.replace(basePath, '')
            }

            next(req, res)
        }

        super(func)
    }
}