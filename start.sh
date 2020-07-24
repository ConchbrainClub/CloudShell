service nginx start
node ./src/main.js

# docker run --rm -d -p 7681:7681/tcp --name test --net web-terminal_default tsl0922/ttyd:latest