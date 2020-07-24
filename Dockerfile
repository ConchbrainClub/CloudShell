FROM ubuntu

EXPOSE 80
WORKDIR /app

RUN apt update
RUN apt upgrade -y
RUN apt install nodejs -y

RUN apt install nginx -y

COPY ["./assets","./assets"]
COPY ["./src","./src"]
COPY ["./wwwroot","./wwwroot"]
COPY ["./package.json","./package.json"]
COPY ["./start.sh","./start.sh"]

ENTRYPOINT ["bash", "./start.sh"]