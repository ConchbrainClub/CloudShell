FROM archlinux

EXPOSE 7681

RUN patched_glibc=glibc-linux4-2.33-4-x86_64.pkg.tar.zst && \
    curl -LO "https://repo.archlinuxcn.org/x86_64/$patched_glibc" && \
    bsdtar -C / -xvf "$patched_glibc"

RUN pacman -Syu --noconfirm curl wget vim git openssh htop tmux

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.1/ttyd_linux.x86_64

RUN mv ./ttyd_linux.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "bash"]