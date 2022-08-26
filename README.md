# Calendar Cache

Calendar cache service parse `html` and convert it to an `ics` file.

## Requirements

 - [nodejs](https://nodejs.dev)
 - [docker](https://www.docker.com)
 - [docker-compose](https://docs.docker.com/compose/)
 - [pnpm](https://pnpm.io)

## Development

Install the required packages

```
pnpm i
```

Run the `redis` service with docker

```
docker-compose -f docker-compose.dev.yml up -d
```

Run typescript in watch mode

```
pnpm watch
```

Run the development server

```
pnpm dev
```

### Tools

Use `redis-cli` with `docker`.

```
docker exec -it {redis-container-name} redis-cli
```

Display logs from container

```
docker logs {container-name}
```

`--follow`: use this flag to keep following new logs.

## Production

The configurable environment variable can be found in [sample.env](docs/sample.env) file. The value on the right indicate the defaults.

Run the whole service with redis using `docker-compose`

```
docker-compose up -d
```

