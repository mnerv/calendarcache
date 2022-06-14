FROM node:18.3.0-slim
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
