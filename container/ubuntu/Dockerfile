FROM ubuntu

EXPOSE 7681

RUN apt update && apt upgrade -y

RUN DEBIAN_FRONTEND=noninteractive apt install tzdata -y

# install dev tools
RUN apt install curl wget vim git openssh-client mc htop tmux gcc make -y

# install spacevim
RUN curl -sLf https://spacevim.org/cn/install.sh | bash

RUN cd ~/.SpaceVim/bundle/vimproc.vim && make

#install starship
RUN wget https://starship.rs/install.sh && bash ./install.sh -y && rm ./install.sh

RUN echo 'eval "$(starship init bash)"' >> ~/.bashrc

# install dev env
RUN apt install nodejs npm python3 python3-pip php golang openjdk-16-jdk mysql-server -y

# config python
RUN ln -s /bin/python3 /bin/python

#install dotnet
RUN wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb

RUN dpkg -i packages-microsoft-prod.deb

RUN apt update

RUN apt install apt-transport-https -y

RUN apt update

RUN apt install dotnet-sdk-5.0 -y

RUN rm packages-microsoft-prod.deb

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.3/ttyd.x86_64

RUN mv ./ttyd.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "bash"]
