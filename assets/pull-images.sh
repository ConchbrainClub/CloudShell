images=(latest ubuntu centos debian alpine archlinux kali fedora opensuse)

for item in ${images[@]};
do
    echo docker pull cloudshell:${item}
    docker pull registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${item}
    docker tag registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${item} lixinyang/cloudshell:${item}
    docker rmi registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${item}
done

docker images  | grep none | awk '{print $3}' | xargs docker rmi
echo "Pull image from Aliyun was successful!"