FROM node:14.8.0

WORKDIR /app

COPY package.json /app

COPY yarn.lock /app

RUN yarn

COPY . . 

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]