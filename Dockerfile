FROM node:15.14.0-slim
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm clean
RUN pnpm build

EXPOSE 8080
CMD ["pnpm", "start"]
