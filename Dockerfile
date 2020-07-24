FROM ubuntu

EXPOSE 80
WORKDIR /app

RUN apt update
RUN apt upgrade -y
RUN apt install nodejs -y

RUN apt install nginx -y

COPY ["./assets","./assets"]
COPY ["./scripts/start.sh","./scripts/start.sh"]
COPY ["./src","./src"]
COPY ["./wwwroot","./wwwroot"]
COPY ["./package.json","./package.json"]

ENTRYPOINT ["bash", "./start.sh"]