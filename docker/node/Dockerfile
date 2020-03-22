FROM node:10.18-buster

RUN npm install -g nodemon

WORKDIR /app
RUN mkdir -p node_modules
COPY ./package.json .

RUN useradd -u 1001 -ms /bin/bash -g node dev

RUN chown -R node:node /app
COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD [ "npm", "run", "docker" ]


