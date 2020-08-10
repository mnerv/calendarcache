FROM node:14.7.0

WORKDIR /app

COPY package.json /app

COPY yarn.lock /app

RUN yarn

COPY . /app

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]