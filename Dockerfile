FROM ubuntu

EXPOSE 80
WORKDIR /app

RUN apt update
RUN apt upgrade -y
RUN apt install nodejs -y

RUN apt install nginx -y

RUN touch ./docker

COPY ["./assets","./assets"]
COPY ["./src","./src"]
COPY ["./package.json","./package.json"]

ENTRYPOINT ["node", "./src/main.js"]