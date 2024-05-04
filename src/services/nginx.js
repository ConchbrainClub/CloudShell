import fs from 'fs'
import child_process from 'child_process'
import common from '../common.js'

var config, location
var configPath = "/etc/nginx/sites-enabled/default"

export default {
    generator(containers, forwardList) {

        var configStr = undefined

        if (containers.length + forwardList.length == 0) {
            configStr = config.replace("@location", "")
        }
        else {
            var proxyStr = ""

            containers.forEach(container => {

                if (common.inDocker()) {
                    //docker
                    proxyStr += location.replace("@path", container.id).replace("@link", `${container.id}:7681`)
                }
                else {
                    //native
                    proxyStr += location.replace("@path", container.id).replace("@link", `localhost:${container.port}`)
                }

            })

            forwardList.forEach((forward) => {
                if (common.inDocker()) {
                    //docker
                    proxyStr += location.replace("@path", `forward/${forward.id}/${forward.port}`).replace("@link", `${forward.id}:${forward.port}`)
                }
            })

            configStr = config.replace("@location", proxyStr)
        }

        console.log(configStr)

        return configStr
    },

    apply(newConfig, callback) {

        var config = fs.readFileSync(configPath).toString()

        //保存配置文件
        fs.writeFileSync(configPath, newConfig)

        //重启nginx
        child_process.exec("nginx -s reload", (error, stdout, stderr) => {
            if (error) {
                //重启nginx失败，还原配置文件
                fs.writeFileSync(configPath, config)
                callback(false)
            }
            else {
                callback(true)
            }
        })
    }
}

function init() {

    config = fs.readFileSync("./assets/default.conf").toString()
    location = fs.readFileSync("./assets/location.conf").toString()

    //启动nginx
    child_process.execSync("service nginx start")
}

init()