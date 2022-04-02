FROM node:16.3.0
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile
COPY . .
RUN yarn test:eslint
RUN yarn clean
RUN yarn build

EXPOSE 8080
CMD ["yarn", "start"]
