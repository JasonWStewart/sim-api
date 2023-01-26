FROM node:lts-hydrogen

WORKDIR /usr/src/sim-api

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm","start"]

