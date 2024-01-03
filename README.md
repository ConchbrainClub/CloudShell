# CloudShell

CloudShell is an out-of-the-box online Linux environment that supports nine commonly used Linux distributions.  It comes with basic tools such as curl, ssh, spacevim, starship, git, tmux, and integrates development environments such as Nodejs, Python, .NET, OpenJDK, PHP, and Go.

## Build from source code

![CloudShell](https://github.com/ConchBrainClub/CloudShell/workflows/CloudShell/badge.svg)

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=conchbrainclub&repo=cloudshell)](https://github.com/conchbrainclub/cloudshell)

#### Environment

- Node.js
- Nginx
- Docker
- Docker-Compose

#### Debug

First, make sure you have prepared the above environment

```shell
npm start
```

or

```shell
node ./src/main.js
```

> Note: The project dynamically modifies the nginx configuration, so it is recommended to debug in the development environment.
The default will modify the file **/etc/nginx/sites-enabled/default**.

**If the server is running, it is recommended to use Docker images to run it, otherwise it may affect your ability to proxy other projects**

#### Build Docker Image

Clone the repo

```shell
git clone https://github.com/ConchBrainClub/CloudShell.git
```

Enter the container directory and build the user container image

```shell
cd ./container
bash ./build.sh
```

If you don't want to rebuild, you can also directly pull the user container image from Alibaba Cloud ECR

```shell
bash ./aliyun.sh
```

Build CloudShell image

```shell
cd ..
docker build . --file Dockerfile --tag lixinyang/cloudshell:latest
```

startup

```shell
docker-compose up
```

visit  http://localhost/

![](https://corehome.oss-accelerate.aliyuncs.com/blogs/screencapture-180-76-232-34-1599031047847.png)

## Deploy on server

First, make sure that Docker and Docker-Compose are installed on your server.

Create a docker-compose.yml file and write the following content.

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

Pull image from Alibaba Cloud. ** Follow the script below to pull the image from Alibaba Cloud**.

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

After pull image complete, execute **docker-compose up** and then visit http://localhost/.

For port forwarding function, see [this blog](https://www.lllxy.net/Blog/Detail/5b897c13-fd96-4392-bd58-ed619d9e876d)
