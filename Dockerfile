FROM ubuntu

EXPOSE 80
WORKDIR /app

RUN apt update && apt upgrade -y
RUN apt install nodejs npm -y

RUN apt install nginx -y

RUN touch ./docker

COPY ["./assets","./assets"]
COPY ["./src","./src"]
COPY ["./package.json","./package.json"]

RUN npm install

ENTRYPOINT ["node", "./src/main.js"]