export class Logger {
    constructor(callback = undefined) {
        this.callback = callback
    }

    log(msg, type = 'info') {
        msg += '\n'

        if (this.callback) {
            this.callback(msg, type)
            return
        }

        switch (type) {
            case 'error':
                console.error(`${type}: ${msg}`)
                break

            case 'warn':
                console.warn(`${type}: ${msg}`)
                break

            case 'debug':
                console.debug(`${type}: ${msg}`)
                break

            case 'info':
                console.info(`${type}: ${msg}`)
                break

            default:
                console.log(`${type}: ${msg}`)
                break
        }
    }
}