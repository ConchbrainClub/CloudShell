import { Middleware } from '../middleware.js';

export class Cors extends Middleware {

    constructor() {
        let func = async (req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', '*')
            res.setHeader('Access-Control-Allow-Headers', '*')

            if (req.method == 'OPTIONS') {
                res.end()
                return;
            }

            await next(req, res)
        }

        super(func)
    }
}