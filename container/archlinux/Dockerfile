FROM archlinux

EXPOSE 7681

RUN pacman -Syu --noconfirm curl wget vim git openssh htop tmux

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.3/ttyd.x86_64

RUN mv ./ttyd.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "bash"]