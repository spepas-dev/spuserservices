FROM node:21-alpine3.18

WORKDIR /app
COPY package*.json ./
COPY config ./config
COPY controllers ./controllers
COPY helper ./helper
COPY logs ./logs
COPY middleware ./middleware
COPY routes ./routes
COPY config ./config
COPY utils ./utils
COPY server.js ./
RUN npm install -g pm2
RUN npm install

EXPOSE 9006

CMD [ "npm", "run", "start" ]