import { Middleware } from "../core/middleware.js";

export class PathBase extends Middleware {

    constructor(basePath) {
        let func = (req, res, next) => {
            if (req.pathname.startsWith(basePath)) {
                req.pathname = req.pathname.replace(basePath, '')
            }

            next(req, res)
        }

        super(func)
    }
}