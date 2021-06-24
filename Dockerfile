FROM node:16.3.0
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm test:eslint
RUN pnpm clean
RUN pnpm build

EXPOSE 8080
CMD ["pnpm", "start"]
