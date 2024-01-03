FROM ubuntu

EXPOSE 80
WORKDIR /app
ENV IN_DOCKER=true

RUN apt update && apt upgrade -y
RUN apt install curl nginx -y

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash
RUN apt install nodejs -y

RUN touch ./docker

COPY ["./assets","./assets"]
COPY ["./src","./src"]
COPY ["./package.json","./package.json"]

RUN npm install

ENTRYPOINT ["npm", "start"]