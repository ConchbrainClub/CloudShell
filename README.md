# CloudShell

CloudShell 是一个开箱即用的在线 Linux 环境，支持八种常用的 Linux 发行版本，内置 curl、ssh、spacevim、starship、git、tmux 等基本工具，同时集成了集成了 Nodejs、Python、.NET、OpenJDK、PHP、Go  等开发环境。

## 从源码构建项目

![CloudShell](https://github.com/ConchBrainClub/CloudShell/workflows/CloudShell/badge.svg)

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=conchbrainclub&repo=cloudshell)](https://github.com/conchbrainclub/cloudshell)

#### 环境

- Node.js
- Nginx
- Docker
- Docker-Compose

#### 调试项目

首先确保你已经准备好了以上环境，进入项目根目录

```shell
npm start
```

或

```shell
node ./src/main.js
```

> 注意：项目会动态**修改** nginx 配置，所以建议在**开发环境**进行调试
默认会对 **/etc/nginx/sites-enabled/default** 文件进行修改

**如果在服务器运行，推荐使用 Docker 镜像运行，否则可能会影响您反向代理其他项目**

#### 从源码打包项目

首先 Clone 项目，进入项目根目录

```shell
git clone https://github.com/ConchBrainClub/CloudShell.git
```

进入 container 目录下，构建用户容器镜像

```shell
cd ./container
bash ./build.sh
```

不想重新构建，也可以直接从阿里云拉取用户容器镜像

```shell
bash ./aliyun.sh
```

切换回项目根目录
构建 cloudshell 镜像

```shell
cd ..
docker build . --file Dockerfile --tag lixinyang/cloudshell:latest
```

构建 cloudshell 镜像并启动项目

```shell
docker-compose up
```

执行 **docker-compose up** 后，访问 http://localhost/ 即可

![](https://corehome.oss-accelerate.aliyuncs.com/blogs/screencapture-180-76-232-34-1599031047847.png)

#### 直接在服务器部署

容器镜像已经上传至 Aliyun ，可以直接拉取并运行

首先确保你的服务器上安装了 **Docker** 和 **Docker-Compose**

创建一个 docker-compose.yml 文件，并写入以下内容。

```yaml
version: '3.4'

services:

    cloudshell:
        image: lixinyang/cloudshell
        ports:
            - "80:80"
        restart: always
        volumes:
            - /usr/bin/docker:/usr/bin/docker
            - /var/run/docker.sock:/var/run/docker.sock
        user: root
```

接下来需要从阿里云拉取镜像，**执行以下脚本即可从阿里云拉取镜像**。

```shell
images=(latest ubuntu centos debian alpine archlinux kali fedora opensuse)

for item in ${images[@]};
do
    echo docker pull registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${item}
    docker pull registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${item}
done

for item in ${images[@]};
do
    docker tag registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${item} lixinyang/cloudshell:${item}
done

for item in ${images[@]};
do
    docker rmi registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${item}
done

docker images  | grep none | awk '{print $3}' | xargs docker rmi

echo "Pull image from Aliyun was successful!"
```

拉取完成后执行 **docker-compose up** ，接下来访问 http://localhost/ 即可看到界面。

端口转发功能见 [《介绍 CloudShell 端口转发功能》](https://www.lllxy.net/Blog/Detail/08cfd84f-d1bc-4a17-8d4a-8f5ed773c2b4)
