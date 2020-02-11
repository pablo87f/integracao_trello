FROM node:10.16-alpine

RUN apk add yarn

WORKDIR /opt/app

COPY . /opt/app

RUN yarn

RUN yarn build 

RUN node build/importacao_projetos.js

EXPOSE 3000

CMD ["node", "build/app"]

