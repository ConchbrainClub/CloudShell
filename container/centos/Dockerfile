FROM centos

EXPOSE 7681

WORKDIR /usr/bin

RUN curl https://github.com/tsl0922/ttyd/releases/download/1.6.3/ttyd.x86_64 -o ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "bash"]
