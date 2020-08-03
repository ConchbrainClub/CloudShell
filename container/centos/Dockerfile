FROM centos

EXPOSE 7681

RUN dnf upgrade -y

RUN dnf install curl wget vim git openssh mc tmux -y

RUN dnf install nodejs npm python3 python3-pip java-11-openjdk -y

RUN dnf install dotnet-sdk-3.1 -y

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.1/ttyd_linux.x86_64

RUN mv ./ttyd_linux.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "bash"]