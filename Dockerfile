FROM node:10
EXPOSE 80
WORKDIR /app
COPY ["./assets","./assets"]
COPY ["./scripts","./scripts"]
COPY ["./src","./src"]
COPY ["./test","./test"]
COPY ["./package.json","./package.json"]

ENTRYPOINT ["node", "./src/main.js"]