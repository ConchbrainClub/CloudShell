FROM ubuntu

EXPOSE 80
WORKDIR /app

RUN apt update
RUN apt upgrade -y
RUN apt install nodejs -y

RUN apt install nginx -y

COPY ["./assets","./assets"]
COPY ["./src","./src"]
COPY ["./package.json","./package.json"]
COPY ["./start.sh","./dStart.sh"]

ENTRYPOINT ["bash", "./dStart.sh"]