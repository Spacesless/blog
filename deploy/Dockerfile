FROM nginx:1.18.0-alpine
FROM node:16.16.0-alpine

WORKDIR blog
COPY ../package.json /blog/package.json
RUN npm i --production --registry=https://registry.npm.taobao.org
RUN npm run build

COPY ../src /blog/src
COPY ../view /blog/view
COPY ../www /blog/www
COPY ../production.js /blog/production.js

ENV DOCKER=true
EXPOSE 8360
CMD [ "node", "/blog/production.js" ]