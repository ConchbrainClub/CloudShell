FROM fedora

EXPOSE 7681

RUN yum update -y

RUN yum upgrade -y

RUN yum install fish curl wget vim git tmux -y

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.3/ttyd.x86_64

RUN mv ./ttyd.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "fish"]