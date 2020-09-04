images=(latest ubuntu centos debian alpine archlinux kali fedora opensuse)

for((i=0;i<${#images[@]};i++));
do
    echo docker pull registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${images[${i}]}
    docker pull registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${images[${i}]}
done

for((i=0;i<${#images[@]};i++));
do
    docker tag registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${images[${i}]} lixinyang/cloudshell:${images[${i}]}
done

for((i=0;i<${#images[@]};i++));
do
    docker rmi registry.cn-shenzhen.aliyuncs.com/lllxy/cloudshell:${images[${i}]}
done

echo "Pull image from Aliyun was successful!"