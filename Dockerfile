FROM node:18.3.0-buster
WORKDIR /app

# Setup pnpm
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm test:eslint
RUN pnpm clean
RUN pnpm build

EXPOSE 8080
CMD ["pnpm", "start"]

