FROM opensuse/leap

EXPOSE 7681

RUN zypper update

RUN zypper -n install curl wget vim git openssh htop tmux

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.1/ttyd_linux.x86_64

RUN mv ./ttyd_linux.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "bash"]