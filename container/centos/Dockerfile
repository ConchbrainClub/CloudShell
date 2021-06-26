FROM centos

EXPOSE 7681

RUN dnf upgrade -y

RUN dnf install fish curl wget vim git openssh mc tmux gcc make -y

# install spacevim
RUN curl -sLf https://spacevim.org/cn/install.sh | bash

RUN cd ~/.SpaceVim/bundle/vimproc.vim && make 

# install dev env
RUN dnf install nodejs npm python3 python3-pip php golang java-11-openjdk mysql-server -y

RUN ln -s /bin/python3 /bin/python

RUN ln -s /bin/pip3 /bin/pip

RUN dnf install dotnet-sdk-5.0 -y

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.3/ttyd.x86_64

RUN mv ./ttyd.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "fish"]
