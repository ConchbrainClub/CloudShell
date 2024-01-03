import child_process from 'child_process'
import fs from 'fs'

import nginx from './nginx.js'
import common from '../common.js'
import { Container } from '../models/container.js'
import { Forward } from '../models/forward.js'

export class TTYD {

    constructor() {
        this.config = JSON.parse(fs.readFileSync("./assets/config.json"))

        this.usefulPorts = new Array()
        this.containers = new Array()
        this.forwardList = new Array()

        //初始化20个可用端口
        for (var i = 7681; i <= 7700; i++) {
            this.usefulPorts.push(i)
        }

        //按容器列表初始化nginx
        nginx.apply(nginx.generator(this.containers, this.forwardList), (flag) => {
            if (flag) {
                console.log("nginx init successful")
            }
            else {
                console.log("nginx init defeat")
            }
        })

        this.autoRecycling()
    }

    create(image, callback) {

        var port = this.usefulPorts.shift()

        var id = common.guid()

        if (common.inDocker()) {
            //docker
            var cmd = "docker run --rm -d --name " + id + " --net cloudshell_default lixinyang/cloudshell:" + image
        }
        else {
            //native
            var cmd = "docker run --rm -d -p " + port + ":7681/tcp --name " + id + " lixinyang/cloudshell:" + image
        }

        child_process.exec(cmd, (error, stdout, stderr) => {
            if (error || stderr) {
                callback(undefined)
                return
            }

            //存储容器
            stdout = stdout.replace("\n", "")
            this.containers.push(new Container(id, stdout, port, new Date().getTime() + 1000 * 60 * this.config.delayedTime))
            //配置反向代理
            nginx.apply(nginx.generator(this.containers, this.forwardList), (flag) => {
                if (flag) {
                    callback(id)
                }
                else {
                    callback(undefined)
                }
            })
        })
    }

    kill(id, callback) {

        this.containers.forEach(container => {
            if (container.id == id) {

                var cmd = "docker rm -f " + container.containerId

                child_process.exec(cmd, (error, stdout, stderr) => {
                    if (!error && !stderr) {
                        //容器列表中移除
                        this.containers.splice(this.containers.indexOf(container), 1)
                        //回收端口
                        this.usefulPorts.push(container.port)
                        //删除转发端口
                        this.deleteForward(id)
                        //配置反向代理
                        nginx.apply(nginx.generator(this.containers, this.forwardList), (flag) => {
                            if (flag) {
                                callback(stdout)
                            }
                            else {
                                callback(undefined)
                            }
                        })
                    }
                    else {
                        callback(undefined)
                    }
                })
            }
        })
    }

    //延长容器生命周期
    delayedLife(id, callback) {
        let container = this.containers.find(i => i.id == id)

        if(!container) {
            callback(false)
            return
        }
        
        container.endTime = new Date().getTime() + 1000 * 60 * this.config.delayedTime
        callback(true)
    }

    //自动回收过期容器
    autoRecycling() {
        this.containers.forEach(container => {
            if (new Date().getTime() > container.endTime) {
                this.kill(container.id, (flag) => {
                    if (flag) {
                        console.log("recycling container " + container.id)
                    }
                })
            }
        })

        setTimeout(this.autoRecycling.bind(this), 1000 * 60 * this.config.recyclingTime)
    }

    createForward(containerId, port) {
        this.forwardList.push(new Forward(containerId, port))
        //配置反向代理
        nginx.apply(nginx.generator(this.containers, this.forwardList), (flag) => {
            if (flag) {
                console.log("创建转发成功")
            }
        })
    }

    deleteForward(containerId) {
        let list = new Array()

        for (let i = 0; i < this.forwardList.length; i++) {
            if (this.forwardList[i].id != containerId)
                list.push(this.forwardList[i])
        }

        this.forwardList = list
    }
}