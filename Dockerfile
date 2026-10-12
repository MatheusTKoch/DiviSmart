FROM node:22

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
  && chown -R 0:0 /usr/src/app \
  && npm cache clean --force

COPY src/server.js ./src/server.js
COPY src/api ./src/api
COPY src/scripts ./src/scripts

EXPOSE 3001

CMD ["npm", "start"]
