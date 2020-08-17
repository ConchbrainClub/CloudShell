FROM alpine

EXPOSE 7681

RUN apk update

RUN apk upgrade

RUN apk add curl wget vim git openssh-client htop tmux

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.1/ttyd_linux.x86_64

RUN mv ./ttyd_linux.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "sh"]