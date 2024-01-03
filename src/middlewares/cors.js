import { Middleware } from '../core/middleware.js';

export class Cors extends Middleware {

    constructor() {
        let func = (req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', '*')
            res.setHeader('Access-Control-Allow-Headers', '*')

            if (req.method == 'OPTIONS') {
                res.end()
                return;
            }

            next(req, res)
        }

        super(func)
    }
}